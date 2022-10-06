import axios from 'axios';
import moment from 'moment';
import { API } from '../../../config/apiUrl';
import 'moment/locale/es';
const Nuxeo = require('nuxeo');


const getNuxeoConfig = () => axios.get(`${API}/documentManagerConfig/all`);

const executeNXQuery = (nuxeo, query, element) => (nuxeo.operation('Repository.Query').enrichers({ document: ['favorites', 'acls', 'publications', 'thumbnail', 'preview', 'tags'] })
  .params({
    language: 'NXQL',
    query,
    sortOrder: 'DESC',
    pageSize: element,
    maxResults: element
  })
  .execute({ schemas: ['file', 'dublincore'] })
  .then((docs) => docs.entries));

const checkUserExist = (nuxeo, username) => nuxeo.operation('UserGroup.Suggestion')
  .params({
    searchType: 'USER_TYPE',
    searchTerm: username
  })
  .execute();

const createUser = (nuxeo, username, email, password, firstName, company) => {
  const newUser = {
    properties: {
      username,
      password,
      firstName,
      company,
      email,
    },
  };
  return nuxeo.users()
    .create(newUser);
};

const addUserToGroup = (nuxeo, group, userId) => nuxeo.request('group/' + group + '/user/' + userId)
  .post();

const CreateWorkspaceForUser = async (nuxeo, nuxeoDomain, workspaceType, name, user) => {
  await nuxeo.operation('Document.Create')
    .enrichers({ document: ['acls'] })
    .input(`/${nuxeoDomain}/${workspaceType}/`)
    .params({
      type: 'Workspace',
      name
    })
    .execute()
    .then(doc => nuxeo.operation('Document.AddACE')
      .enrichers({ document: ['acls'] })
      .input(doc.path)
      .params({
        acl: 'local',
        user,
        permission: 'Everything',
        grant: true,
        overwrite: true
      })
      .execute())
    .catch(err => console.log(err));
};

const createSectionOrFolder = async (nuxeo, type, name, url) => {
  await nuxeo.operation('Document.FetchByProperty')
    .params({
      property: 'dc:title',
      values: name
    })
    .execute()
    .then((docs) => {
      let exists = false;
      docs.entries.forEach(element => {
        if (element.type === type) {
          exists = true;
        }
      });
      if (docs.entries.length === 0 || !exists) {
        const newDocument = {
          'entity-type': 'document',
          name,
          type,
          properties: {
            'dc:title': name,
            'dc:description': ''
          }
        };
        return nuxeo.repository()
          .create(url, newDocument);
      }
    })
    .catch(err => console.log(err));
};

const createUserGroup = (nuxeo, name) => nuxeo.operation('Group.CreateOrUpdate')
  .params({
    groupname: name,
    grouplabel: name,
    description: '',
    mode: 'createorUpadate'
  })
  .execute();

const shareDocumentWithUserOrGroup = (nuxeo, userOrGroupName, documentPath) => nuxeo.operation('Document.AddPermission')
  .enrichers({ document: ['favorites', 'breadcrumb', 'userVisiblePermissions', 'acls', 'publications', 'tags'] })
  .input(documentPath)
  .params({
    permission: 'Read',
    username: userOrGroupName,
    acl: 'local',
    begin: moment(),
  })
  .execute();

const handlePublishFileToSection = (nuxeo, filePath, subSection) => {
  console.log(subSection);
  executeNXQuery(nuxeo, "SELECT * FROM Section WHERE dc:title = '" + subSection + "'", 1).then((section) => {
    nuxeo.operation('Document.PublishToSections')
      .input(filePath)
      .params({
        target: [section[0].uid],
        override: true
      })
      .execute({ schemas: ['file', 'dublincore'] })
      .then((docs) => {
      });
  }).catch((err) => { console.error(err); });
};

const validateFileName = (nuxeo, name, file, itterator) => nuxeo.operation('Document.FetchByProperty')
  .params({ property: 'dc:title', values: name })
  .execute()
  .then((docs) => {
    if (docs.entries.length > 0) {
      let denom = file.name.trim();
      const array = denom.split('.');
      let i = 0;
      while (i < array.length - 1) {
        if (i > 0) {
          denom = denom + '.' + array[i];
        } else {
          denom = array[i];
        }
        i += 1;
      }
      if (itterator === 0) {
        itterator = itterator + docs.entries.length + 1;
      } else {
        itterator += docs.entries.length;
      }
      denom = denom + '(' + itterator + ').' + array[array.length - 1];
      return validateFileName(nuxeo, denom, file, itterator);
    }
    return name;
  });

const handleUploadFiles = (nuxeo, nuxeoDomain, files, mainSection, subSection) => {
  const pathList = [];

  const promises = files.map(file => validateFileName(nuxeo, file.name, file, 0).then(name => {
    const blob = new Nuxeo.Blob({
      content: file, name, mimeType: file.type, size: file.size
    });
    const newDocument = {
      'entity-type': 'document',
      name,
      type: 'File',
      properties: {
        'dc:title': name
      }
    };
    return nuxeo.repository()
      .create(`/${nuxeoDomain}/workspaces/nuxeoUsuarioWorkspace/${mainSection}`, newDocument)
      .then((doc1) => nuxeo.batchUpload()
        .upload(blob)
        .then((res) =>
        // let objblod = res.blob;
        // eslint-disable-next-line implicit-arrow-linebreak
          nuxeo.operation('Blob.AttachOnDocument')
            .param('document', `/${nuxeoDomain}/workspaces/nuxeoUsuarioWorkspace/${mainSection}/${name}`)
            .input(res.blob)
            .execute()
            .then((doc) => {
              handlePublishFileToSection(nuxeo, doc1.path, subSection);
              return { title: file.name, path: doc1.path };
            })
        )
        .catch((error) => {
          console.log(error);
        }))
      .catch((error) => {
        console.log(error);
      });
  }));

  return Promise.all(promises);
};

const handleDeleteDocument = (nuxeo, path) => nuxeo.operation('Document.UnpublishAll')
  .input(path)
  .execute()
  .then(() => nuxeo.repository()
    .delete(path));


const nuxeoFunctions = {
  getNuxeoConfig,
  checkUserExist,
  createUser,
  addUserToGroup,
  CreateWorkspaceForUser,
  createSectionOrFolder,
  createUserGroup,
  shareDocumentWithUserOrGroup,
  handleUploadFiles,
  handlePublishFileToSection,
  handleDeleteDocument,
  executeNXQuery
};

export default nuxeoFunctions;
