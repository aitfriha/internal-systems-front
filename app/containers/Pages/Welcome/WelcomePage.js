import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { connect } from 'react-redux';
import MenuButtons from 'dan-components/MenuButtons/MenuButtons';
import { PropTypes } from 'prop-types';
import { isEmpty } from 'lodash';
import history from '../../../utils/history';
import welcomecommercialpic from './welcomeCommercial.png';
import LeftSidebarLayout from '../../Templates/layouts/LeftSidebarLayout';
import { ThemeContext } from '../../App/ThemeWrapper';


import nuxeoFunctions from '../CommercialDocumentManager/nuxeoFunctions';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const Nuxeo = require('nuxeo');
let documentManagerConfig = {};

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      picture: ''
    };
  }

  componentDidMount() {
    // console.log(this.props.moduleName);
    // history.push('/app/gestion-commercial/welcome?the=search');
    const { changeTheme } = this.props;
    // console.log(localStorage.getItem('themeModule'));
    changeTheme(localStorage.getItem('themeModule'));
    nuxeoFunctions.getNuxeoConfig().then(conf => {
      documentManagerConfig = conf.data.payload;
      // console.log(documentManagerConfig);

      let nuxeo = new Nuxeo({
        baseURL: documentManagerConfig.nuxeourl,
        auth: {
          method: 'basic',
          username: documentManagerConfig.user,
          password: documentManagerConfig.password
        }
      });

      nuxeoFunctions.checkUserExist(nuxeo, 'nuxeouser').then(res => {
        if (res.length === 0) {
          console.log('exist');
          let logedUser = localStorage.getItem('logedUser');
          logedUser = JSON.parse(logedUser);
          console.log(logedUser);
          console.log(localStorage);
          const email = logedUser.userEmail;
          nuxeoFunctions.createUser(nuxeo, 'nuxeouser', 'nuxeouser', 'nuxeouser', 'nuxeouser', 'Módulo de Gestión Documental')
            .then((user) => {
              console.log('nuxeo user created', user);

              nuxeoFunctions.addUserToGroup(nuxeo, 'administrators', user.id)
                .then(() => {
                  console.log('added to group');
                  nuxeo = new Nuxeo({
                    baseURL: documentManagerConfig.nuxeourl,
                    auth: {
                      method: 'basic',
                      username: 'nuxeouser',
                      password: 'nuxeouser'
                    }
                  });
                  nuxeoFunctions.CreateWorkspaceForUser(nuxeo, documentManagerConfig.dominio, 'workspaces', 'nuxeoUserWorkspace', 'nuxeouser')
                    .then(() => {
                      console.log('nuxeo workspace created');
                      console.log(email);
                      nuxeoFunctions.checkUserExist(nuxeo, email).then(res => {
                        console.log(res);
                        if (res.length === 0) {
                          nuxeoFunctions.createUser(nuxeo, email, email, email, email, 'internal system user')
                            .then((user1) => {
                              console.log('loged user created', user1);

                              nuxeoFunctions.addUserToGroup(nuxeo, 'administrators', user1.id);
                              nuxeoFunctions.CreateWorkspaceForUser(nuxeo, documentManagerConfig.dominio, 'UserWorkspaces', email, email)
                                .then(() => {
                                  console.log('user workspace created');

                                  nuxeoFunctions.createSectionOrFolder(nuxeo, 'Section', 'Clients', `/${documentManagerConfig.dominio}/sections`)
                                    .then(() => {
                                      console.log('clients section created');

                                      nuxeoFunctions.createUserGroup(nuxeo, 'ClientsUsers')
                                        .then(() => {
                                          console.log('user group created');

                                          nuxeoFunctions.shareDocumentWithUserOrGroup(nuxeo, 'ClientsUsers', `/${documentManagerConfig.dominio}/sections/Clients`)
                                            .then(doc => console.log(doc))
                                            .catch(err => console.log(err));
                                          nuxeoFunctions.addUserToGroup(nuxeo, 'ClientsUsers', email);
                                        })
                                        .catch(err => console.log(err));
                                    })
                                    .catch(err => console.log(err));
                                  nuxeoFunctions.createSectionOrFolder(nuxeo, 'Folder', 'Clients', `/${documentManagerConfig.dominio}/workspaces/nuxeoUserWorkspace/`)
                                    .then(doc => console.log(doc))
                                    .catch(err => console.log(err))

                                    .catch(err => console.log(err));
                                });
                            });
                        }
                      });
                    }).catch(err => console.log(err));
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        } else {
          console.log(' user exist');
          /* nuxeo.users()
            .delete("nuxeoUser")
            .then(function (user) {
              console.log(user)
            }).catch(function (r) {
              console.log(r)
            }) */
        }
      }).catch(err => console.log(err));
    });
  }

  render() {
    const { moduleName, picture } = this.props;
    const title = brand.name + ' - Blank Page';
    const description = brand.desc;
    const titleException = ['/app', '/app/crm-dashboard', '/app/crypto-dashboard'];
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title={moduleName} desc="">
          <img src={picture} alt="dd" />
          <div style={{ display: 'none' }}>
            <LeftSidebarLayout
              history={history}
              moduleName={moduleName}
              titleException={titleException}
            />
          </div>
        </PapperBlock>
      </div>
    );
  }
}
WelcomePage.propTypes = {
  /** Location */
  location: PropTypes.object.isRequired,
};
PapperBlock.defaultProps = {
  whiteBg: false,
  noMargin: false,
  colorMode: false,
  overflowX: false,
  icon: 'ios-bookmark-outline',
  desc: ''
};
const mapStateToProps = () => ({
  moduleName: localStorage.getItem('moduleName'),
  picture: localStorage.getItem('picture')
});
const WelcomePageMapped = connect(
  mapStateToProps,
  null
)(WelcomePage);
// export default BlankPage;
export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <WelcomePageMapped changeTheme={changeTheme} classes={classes} />;
};
