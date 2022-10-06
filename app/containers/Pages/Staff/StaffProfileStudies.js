import React, { Component, useContext } from 'react';
import {
  IconButton,
  Avatar,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  makeStyles,
  Tooltip,
  Button,
  Grid,
  TextField,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  InputLabel, Badge, withStyles
} from '@material-ui/core';

import PropTypes from 'prop-types';
import Ionicon from 'react-ionicons';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Document, Page, pdfjs } from 'react-pdf';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import PublishIcon from '@material-ui/icons/Publish';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showSpinner } from 'dan-redux/actions/uiActions';
import { Image } from '@material-ui/icons';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import AssignmentIcon from '@material-ui/icons/Assignment';
import EditRoundedIcon from '@material-ui/icons/EditRounded';
import Transition from '../../../components/Transition/transition';
import { ThemeContext } from '../../App/ThemeWrapper';
import CountryService from '../../Services/CountryService';
import StaffService from '../../Services/StaffService';
import StaffDocumentsService from '../../Services/StaffDocumentsService';
import AddressBlock from '../Address';
import styles from './staff-jss';
import {
  setStaff,
  setEdit,
  getAllStaff,
  updateStaff
} from '../../../redux/staff/actions';
import { getAllCountry } from '../../../redux/country/actions';
import { getAllStateByCountry } from '../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../redux/city/actions';
import {
  addStaffDocument,
  deleteStaffDocument
} from '../../../redux/staffDocument/actions';
import notification from '../../../components/Notification/Notification';
pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.1.266/pdf.worker.js';
/* pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`; */

const inputDoc = React.createRef();

const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];

const useStyles = makeStyles(styles);
const inputCvDoc = React.createRef();
const SmallAvatar = withStyles(theme => ({
  root: {
    width: 40,
    height: 40,
    border: `2px solid ${theme.palette.background.paper}`
  }
}))(Avatar);
class StaffProfileGeneralInformation extends Component {
  state = {
    docIndex: 0,
    documentToDelete: '',
    cvDoc: {},
    cvDocExtension: '',
    numPages: null,
    pageNumber: null,
    isDeleteDocument: false,
    isOpenCvDocument: false,
    isOpenDocument: false,
    isAddDocumentation: false,
    firstName: '',
    fatherFamilyName: '',
    motherFamilyName: '',
    personalPhone: '',
    personalEmail: '',

    companyPhone: '',
    companyMobilePhone: '',
    companyEmail: '',
    skype: '',
    birthday: new Date(),
    birthCountry: null,
    emergencyContactName: '',
    emergencyContactPhone: '',

    fullAddress: '',

    postCode: '',

    city: null,
    docNumber: '',
    docExpeditionDate: new Date(),
    docExpirationDate: new Date(),
    doc: {},
    docExtension: '',
    docId: '',
    docType: '',
    studiesList: [{
      inputDoc: React.createRef(), doc: {}, docExtension: '', studieName: ''
    }],
    // studiesList: []
  };

  editingPromiseResolve1 = () => {};

  editingPromiseResolve2 = () => {};

  editingPromiseResolve3 = () => {};

  editingPromiseResolve4 = () => {};

  editingPromiseResolve5 = () => {};

  componentDidMount() {
    const {
      staff,
      getAllCountry,
      getAllStateByCountry,
      getAllCityByState,
      showSpinner
    } = this.props;
    /*
    const promise1 = new Promise(resolve => {
      getAllCountry();
      this.editingPromiseResolve3 = resolve;
    });
    promise1.then(() => {
      const promise2 = new Promise(resolve => {
        getAllStateByCountry(staff.countryId);
        this.editingPromiseResolve4 = resolve;
      });
      promise2.then(() => {
        const promise3 = new Promise(resolve => {
          getAllCityByState(staff.stateId);
          this.editingPromiseResolve5 = resolve;
        });
        promise3.then(() => {
          this.setInitialData();
          showSpinner(false);
        });
      });
    }); */
    this.setInitialData();
    showSpinner(false);
  }

  base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  setInitialData = () => {
    const theList = [];
    const { staff } = this.props;
    if (staff.studiesListName.length) {
      for (let i = 0; i < staff.studiesListName.length; i++) {
        if (staff.studiesListDoc[i] !== '') {
          theList.push({
            inputDoc: React.createRef(),
            doc: new File([this.base64ToArrayBuffer(staff.studiesListDoc[i])], 'test.pdf', {
              type: this.handleFileDataType(staff.studiesListDocExtension[i]),
              lastModified: new Date()
            }),
            docExtension: staff.studiesListDocExtension[i],
            studieName: staff.studiesListName[i]
          });
        } else {
          theList.push({
            inputDoc: React.createRef(),
            doc: {},
            docExtension: '',
            studieName: staff.studiesListName[i]
          });
        }
      }
      this.setState({ studiesList: theList });
    }
    if (staff.cvDoc !== '') {
      this.setState({
        cvDoc: new File([this.base64ToArrayBuffer(staff.cvDoc)], 'test.pdf', {
          type: this.handleFileDataType(staff.cvDocExtension),
          lastModified: new Date(),
          cvDocExtension: staff.cvDocExtension
        }),
        cvDocExtension: staff.cvDocExtension
      });
    } else {
      this.setState({ cvDoc: {} });
    }
  };

  handleOpenEditData = () => {
    const { setEdit } = this.props;

    setEdit(true);
  };

  handleOpenEditDocumentation = () => {
    this.setState({
      isAddDocumentation: true
    });
  };


  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  };

  handleCancel = () => {
    // this.setState({ studiesList: [] });
    const { setEdit } = this.props;
    setEdit(false);
    this.setInitialData();
  };

  handleUpdate = () => {
    const {
      setStaff, setEdit, staff, updateStaff, getAllStaff
    } = this.props;
    const {
      studiesList, cvDocExtension, cvDoc
    } = this.state;
    const newStaff = {
      staffId: staff.staffId, cvDocExtension, cvDoc
    };
    const studiesListName = [];
    let test = 0;
    const studiesListDocExtension = [];
    const formData = new FormData();
    if (cvDoc.constructor === File) {
      formData.append('cvDoc', cvDoc);
    } else {
      formData.append(
        'cvDoc',
        new Blob([], { type: 'application/json' })
      );
    }
    studiesList.forEach(studie => {
      if (studie.studieName !== '') {
        studiesListName.push(studie.studieName);
        studiesListDocExtension.push(studie.docExtension);
        if (studie.doc.constructor === File) {
          formData.append('studiesListDoc', studie.doc);
        } else {
          formData.append('studiesListDoc', new File([], 'aaa', { type: 'application/json' }));
        }
      } else {
        /* formData.append('studiesListDoc', null);
        studiesListName.push(null); */
      }
      if (studie.studieName === '' && studie.doc.constructor === File) {
        notification('danger', 'certification without studie name');
        test = 1;
      }
    });
    if (test === 1) {
      return;
    }
    newStaff.studiesListName = studiesListName;
    newStaff.studiesListDocExtension = studiesListDocExtension;
    Object.keys(newStaff).forEach(e => formData.append(e, newStaff[e]));

    const promise = new Promise(resolve => {
      // get client information
      updateStaff(formData);
      this.editingPromiseResolve1 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        /* getAllStaff();
        setEdit(false);
                StaffService.getStaffById(staff.staffId).then(({ data }) => {
          setStaff(data);
        }); */
        StaffService.getStaffById(staff.staffId).then(({ data }) => {
          setStaff(data);
          setEdit(false);
        });
      } else {
        notification('danger', result);
      }
    });
  };

  handleUpdateDocuments = () => {};

  handleUploadDocClick = () => {
    inputDoc.current.click();
  };

  handleDocChange = () => {
    const lastDot = inputDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        doc: inputDoc.current.files[0],
        docExtension: ext
      });
    }
  };

  handleClose = () => {
    this.setState({
      isAddDocumentation: false,
      docNumber: '',
      docExpeditionDate: new Date(),
      docExpirationDate: new Date(),
      docExtension: '',
      doc: {},
      docType: ''
    });
  };

  handleAddDocument = () => {
    const { setStaff, staff, addStaffDocument } = this.props;
    const {
      docNumber,
      docExpeditionDate,
      docExpirationDate,
      docExtension,
      doc,
      docType
    } = this.state;
    const document = {
      staffId: staff.staffId,
      name: docType,
      number: docNumber,
      expeditionDate: docExpeditionDate.toISOString().slice(0, 10),
      expirationDate: docExpirationDate.toISOString().slice(0, 10),
      docExtension
    };

    const formData = new FormData();
    if (doc.constructor === File) {
      formData.append('doc', doc);
    } else {
      formData.append(
        'doc',
        new Blob([JSON.stringify({})], {
          type: 'application/json'
        })
      );
    }
    Object.keys(document).forEach(e => formData.append(e, document[e]));

    const promise = new Promise(resolve => {
      // get client information
      addStaffDocument(formData);
      this.editingPromiseResolve2 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllStaff();
        StaffService.getStaffById(staff.staffId).then(({ data }) => {
          setStaff(data);
        });
        this.setState({
          isAddDocumentation: false,
          docNumber: '',
          docExpeditionDate: new Date(),
          docExpirationDate: new Date(),
          docExtension: '',
          doc: {},
          docType: ''
        });
      } else {
        notification('danger', result);
      }
    });
  };

  handleOpenDialog = (docId, docExtension) => {
    this.setState({
      isOpenDocument: true,
      docId,
      docExtension
    });
  };

  handleDeleteDocumentDialog = (index) => {
    this.setState({
      isDeleteDocument: true,
      documentToDelete: index
    });
  };

  handleDialogClose = () => {
    this.setState({
      isOpenDocument: false,
      docId: ''
    });
  };

  handleCancelDialogDeleteClose = () => {
    this.setState({
      isDeleteDocument: false,
    });
  };

  handleDeleteDocumentConfirmation= () => {
    const { documentToDelete, studiesList } = this.state;
    studiesList[documentToDelete].doc = {};
    studiesList[documentToDelete].inputDoc = React.createRef();
    studiesList[documentToDelete].docExtension = '';
    this.setState({
      isDeleteDocument: false,
      studiesList
    });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages
    });
  };

  fileToBase64 = file => {
    const binaryString = window.atob(file);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  };

  handleFileDataType = ext => {
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
        return 'image/jpeg';
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'tiff':
        return 'image/tiff';
    }
  };

  renderFile = () => {
    const { staff } = this.props;
    const { docId, docExtension, docIndex } = this.state;
    return `data:${this.handleFileDataType(docExtension)};base64,${
      staff.studiesListDoc[docIndex]
    }`;
  }


  handleDeleteDocument = documentId => {
    const { setStaff, staff, deleteStaffDocument } = this.props;
    const promise = new Promise(resolve => {
      // get client information
      deleteStaffDocument(documentId);
      this.editingPromiseResolve2 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllStaff();
        StaffService.getStaffById(staff.staffId).then(({ data }) => {
          setStaff(data);
        });
      } else {
        notification('danger', result);
      }
    });
  };

  handleOpenDocumentDialog = index => {
    const { staff } = this.props;
    this.setState({
      isOpenDocument: true,
      docExtension: staff.studiesListDocExtension[index],
      docIndex: index
    });
  };

  handleOpenCvDocumentListDialog = () => {
    this.setState({
      isOpenCvDocument: true,
    });
  };

  renderCvDocumentFile = () => {
    const { staff } = this.props;
    return `data:${this.handleFileDataType(staff.cvDocExtension)};base64,${staff.cvDoc}`;
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  handleCloseCvDocumentDialog = () => {
    this.setState({
      isOpenCvDocument: false,
      pageNumber: 1
    });
  };

  changePage = (offset) => {
    const { pageNumber } = this.state;
    this.setState({
      pageNumber: pageNumber + offset
    });
  };

  previousPage = () => {
    this.changePage(-1);
  };

  nextPage = () => {
    this.changePage(1);
  };

  handleOpenDoc = () => {
    const { studiesList } = this.state;
    studiesList.push({
      inputDoc: React.createRef(), doc: {}, docExtension: '', studieName: ''
    });
    this.setState({
      studiesList
    });
  };

  handleDeleteDoc = (row) => {
    const { studiesList } = this.state;
    if (studiesList.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = studiesList.filter((rows, index) => index != row);
      this.setState({ studiesList: newDocs });
    }
    if (studiesList.length === 1) {
      this.setState({
        studiesList: [{
          inputDoc: React.createRef(), doc: {}, docExtension: '', studieName: ''
        }]
      });
    }
  };

  handleDocChange = index => {
    const { studiesList } = this.state;
    const lastDot = studiesList[index].inputDoc.current.files[0].name.lastIndexOf(
      '.'
    );
    const ext = studiesList[index].inputDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      studiesList[index].doc = studiesList[index].inputDoc.current.files[0];
      studiesList[index].docExtension = ext;
      studiesList[index].studieName = studiesList[index].studieName;
      this.setState({
        studiesList
      });
    }
  };

  handleUploadDocClick = (e, index) => {
    console.log(e.target.name);
    if (e.target.name === 'deleteButton') {
      e.preventDefault();
      e.stopPropagation();
    } else {
      const { studiesList } = this.state;
      studiesList[index].inputDoc.current.click();
    }
  };

  handleChangeStudieName = (index, e) => {
    const {
      studiesList
    } = this.state;
    studiesList[index].studieName = e.target.value;
    this.setState({ studiesList });
  };

  handleUploadCvDocClick = () => {
    inputCvDoc.current.click();
  };

  handleCvDocChange = () => {
    const lastDot = inputCvDoc.current.files[0].name.lastIndexOf(
      '.'
    );
    const ext = inputCvDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        cvDoc: inputCvDoc.current.files[0],
        cvDocExtension: ext
      });
    }
  };

  render() {
    const {
      classes,
      staff,
      isEdit,
      logedUser,
      isLoadingStaff, staffResponse, errorStaff

    } = this.props;
    const thelogedUser = JSON.parse(logedUser);

    const {
      numPages, pageNumber, studiesList, cvDoc, isDeleteDocument,
      isOpenCvDocument,
      isAddDocumentation,
      isOpenDocument,
      docNumber,
      docExpeditionDate,
      docExpirationDate,
      doc,
      docExtension,
      docType
    } = this.state;

    !isLoadingStaff
    && staffResponse
    && this.editingPromiseResolve1(staffResponse);
    !isLoadingStaff
    && !staffResponse
    && this.editingPromiseResolve1(errorStaff);

    const docTypes = [
      'ID Card',
      'Passport',
      'Professional ID Card',
      'Health National Security Card'
    ];

    return (
      <div>
        <Dialog
          maxWidth="sm"
          TransitionComponent={Transition}
          fullWidth
          scroll="body"
          aria-labelledby="changeProfilePic"
          open={isDeleteDocument}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="SaveFormula">delete document</DialogTitle>
          <DialogContent>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
             Are you sure you want to delete this document ?
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleCancelDialogDeleteClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteDocumentConfirmation} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>


        <Dialog
          maxWidth="lg"
          TransitionComponent={Transition}
          fullWidth
          scroll="body"
          aria-labelledby="changeProfilePic"
          open={isOpenDocument}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="SaveFormula">Document preview</DialogTitle>
          <DialogContent>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {docExtension === 'pdf' ? (
                <>
                  <Document
                    file={this.renderFile()}
                    onLoadSuccess={this.onDocumentLoadSuccess}
                    onLoadError={console.error}
                  >
                    <Page pageNumber={pageNumber} />
                  </Document>
                  <div>
                    <div className="pagec">
                  Page
                      {' '}
                      {pageNumber || (numPages ? 1 : '--')}
                      {' '}
                of
                      {' '}
                      {numPages || '--'}
                    </div>
                    <div className="buttonc">
                      <button
                        type="button"
                        disabled={pageNumber <= 1}
                        onClick={this.previousPage}
                        className="Pre"

                      >
                Previous
                      </button>
                      <button
                        type="button"
                        disabled={pageNumber >= numPages}
                        onClick={this.nextPage}
                      >
                Next
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <img src={this.renderFile()} alt="Document" />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleDialogClose} color="primary">
              Close
            </Button>
            <Button onClick={this.handleDownload} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isAddDocumentation}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">Add new document</DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
                marginBottom: 20,
                width: '100%'
              }}
            >
              <IconButton
                className={
                  doc.constructor === Object
                    ? classes.uploadAvatarEmpty
                    : classes.uploadAvatarDone
                }
                onClick={this.handleUploadDocClick}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="file"
                    id="file"
                    accept=".png, .jpg, .jpeg, .pdf, .tiff"
                    ref={inputDoc}
                    multiple={false}
                    style={{ display: 'none' }}
                    onChange={this.handleDocChange}
                  />
                  <PublishIcon
                    className={classes.uploadIcon}
                    color="secondary"
                  />
                  <Typography
                    variant="subtitle1"
                    className={classes.uploadText}
                  >
                    Document
                  </Typography>
                </div>
              </IconButton>
            </div>
            <FormControl className={classes.formControl} fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="docType"
                value={docType}
                onChange={this.handleChange}
              >
                {docTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-basic"
              label="Number"
              variant="outlined"
              name="docNumber"
              fullWidth
              required
              value={docNumber}
              className={classes.textField}
              onChange={this.handleChange}
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputProps={{ readOnly: true }}
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                name="docExpeditionDate"
                label="Expedition date"
                value={docExpeditionDate}
                onChange={value => this.handleDateValue(value, 'docExpeditionDate')
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                fullWidth
              />
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                inputProps={{ readOnly: true }}
                variant="inline"
                format="dd/MM/yyyy"
                margin="normal"
                id="date-picker-inline"
                name="docExpirationDate"
                label="Expiration date"
                value={docExpirationDate}
                onChange={value => this.handleDateValue(value, 'docExpirationDate')
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date'
                }}
                fullWidth
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={this.handleAddDocument}
              disabled={doc.constructor === Object}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
        <div className={classes.divSpace}>
          <Typography
            variant="subtitle1"
            style={{
              fontFamily: 'sans-serif , Arial',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
            color="secondary"
          >
            Studies / curriculum vitae
          </Typography>
          {!isEdit ? (
            <div>
              {thelogedUser.userRoles[0].actionsNames.hh_staff_personalInformationManagement_modify
                ? (
                  <Tooltip title="Edit">
                    <Button
                      name="personalInformation"
                      style={{ backgroundColor: 'transparent' }}
                      disableRipple
                      endIcon={<EditIcon />}
                      onClick={this.handleOpenEditData}
                    />
                  </Tooltip>
                ) : null}
            </div>
          ) : (
            <div />
          )}
        </div>
        {!isEdit ? (
          <Grid
            container
            spacing={2}
            direction="row"
            justifycontent="left"
            alignItems="center"
            style={{ marginTop: '15px' }}
          >
            <Grid
              xs={12}
              item
              md={6}
              container
              spacing={2}
              direction="row"
              justifycontent="left"
              alignItems="center"
            >

              {staff.studiesListName.length ? staff.studiesListName.map((studie, index) => (
                <React.Fragment key={index}>
                  <Grid item xs={12} md={8}>
                    <div className={classes.divInlineStudies}>
                      <Avatar style={{ marginRight: '8px' }}>
                        <Ionicon icon="md-school" />
                      </Avatar>
                      {staff.studiesListName[index]}
                    </div>
                  </Grid>
                  {staff.studiesListDoc[index] ? (
                    <Grid item xs={4}>
                      <IconButton
                        style={{ marginTop: '-9px' }}
                        onClick={() => this.handleOpenDocumentDialog(index)}
                      >
                        <VisibilityIcon color="secondary" />
                      </IconButton>
                    </Grid>
                  ) : (
                    <Grid item xs={4}>
                      <IconButton
                        style={{ marginTop: '-9px' }}
                        disabled
                      >
                        <VisibilityIcon color="secondary" />
                      </IconButton>
                    </Grid>
                  )}
                </React.Fragment>
              ))


                : (
                  <>
                    there is no studies. to assign new studies click
                    <Button
                      name="personalInformation"
                      style={{ backgroundColor: 'transparent' }}
                      disableRipple
                      endIcon={<EditIcon />}
                    />
                  </>
                )

              }

            </Grid>
            <Grid item xs={12} md={6} container>
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{
                      fontFamily: 'sans-serif , Arial',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}
                    color="secondary"
                  >
                    curriculum vitae
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={6}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {staff.cvDoc ? (
                    <Grid item xs={4}>
                      <IconButton
                        style={{ marginTop: '0px' }}
                        onClick={() => this.handleOpenCvDocumentListDialog()}
                      >
                        <VisibilityIcon color="secondary" />
                      </IconButton>
                    </Grid>
                  ) : (
                    <Grid item xs={4}>
                      <IconButton
                        style={{ marginTop: '0px' }}
                        disabled
                      >
                        <VisibilityIcon color="secondary" />
                      </IconButton>
                    </Grid>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <div />
        )}
        {isEdit ? (
          <div>
            <Grid
              container
              spacing={2}
              direction="row"
              justifycontent="left"
              alignItems="center"
            >
              <Grid
                xs={12}
                item
                md={7}
                container
                spacing={2}
                direction="row"
                justifycontent="left"
                alignItems="center"
              >
                {studiesList.map((doc1, index) => (
                  <React.Fragment key={index + 10}>
                    <Grid item xs={12} md={8}>
                      <TextField
                        id="outlined-basic"
                        label={`studie ${index + 1}`}
                        variant="outlined"
                        name="studieName"
                        fullWidth
                        value={studiesList[index].studieName}
                        className={classes.textField}
                        onChange={(e) => this.handleChangeStudieName(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12} md={2} style={{ marginTop: '15px' }}>
                      {/* <Button
                        style={{ height: '55px' }}
                        fullWidth
                        variant="outlined"
                        component="span"
                        startIcon={<Image color="primary" />}
                        className={
                          doc1.doc.constructor === Object
                            ? classes.uploadAvatarEmptyEntity
                            : classes.uploadAvatarDoneEntity
                        }
                        onClick={() => this.handleUploadDocClick(index)}
                      >
                          document
                      </Button> */}
                      <Badge
                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                        overlap="circle"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right'
                        }}
                        badgeContent={(
                          <Tooltip title="delete document" style={{ width: '25px', height: '25px' }}>
                            <SmallAvatar>
                              <Button
                                name="deleteButton"
                                onClick={() => this.handleDeleteDocumentDialog(index)}
                                variant="contained"
                                /* className={classes.badgeButton} */
                              >
                                <DeleteIcon color="secondary" fontSize="small" />
                              </Button>
                            </SmallAvatar>
                          </Tooltip>
                        )}
                      >
                        <Avatar
                          name="addButton"
                          onClick={(e) => this.handleUploadDocClick(e, index)}
                          className={
                            doc1.doc.constructor === Object
                              ? classes.uploadAvatarEmptyEntity
                              : classes.uploadAvatarDoneEntity
                          }
                        >
                          <Ionicon icon="md-school" style={{ color: '#039be5' }} />
                        </Avatar>
                      </Badge>


                      {/*                <Tooltip title="Delete document">
                        <IconButton
                          size="small"
                          color="primary"
                          style={{
                            marginTop: '-23px', minWidth: '15px', padding: '0px', display: 'flex', background: 'red'
                          }}
                          variant="contained"
                          onClick={() => this.handleDeleteDocumentDialog(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                      <input
                        type="file"
                        id="file"
                        accept=".png, .jpg, .jpeg, .pdf, .tiff"
                        ref={doc1.inputDoc}
                        multiple={false}
                        style={{ display: 'none' }}
                        onChange={() => this.handleDocChange(index)}
                      />
                    </Grid>
                    <Grid item x={2} style={{ marginTop: '25px' }}>
                      <IconButton size="small" color="primary" onClick={() => this.handleOpenDoc()}>
                        <AddIcon />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => this.handleDeleteDoc(index)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}

              </Grid>
              <Grid item xs={12} md={5} container>
                <Grid item xs={12} md={6}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    curriculum vitae
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <IconButton
                      className={
                        cvDoc.constructor === Object
                          ? classes.uploadAvatarEmpty
                          : classes.uploadAvatarDone
                      }
                      onClick={this.handleUploadCvDocClick}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <input
                          type="file"
                          id="file"
                          accept=".png, .jpg, .jpeg, .pdf, .tiff"
                          ref={inputCvDoc}
                          multiple={false}
                          style={{ display: 'none' }}
                          onChange={this.handleCvDocChange}
                        />
                        <PublishIcon
                          className={classes.uploadIcon}
                          color="secondary"
                        />
                        <Typography
                          variant="subtitle1"
                          className={classes.uploadText}
                        >
                          curriculum vitae
                        </Typography>
                      </div>
                    </IconButton>
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.divSpace} style={{ marginTop: 20 }}>
              <Button
                className={classes.textField}
                color="primary"
                variant="contained"
                size="small"
                onClick={this.handleCancel}
              >
                Cancel
              </Button>
              <Button
                className={classes.textField}
                color="primary"
                variant="contained"
                size="small"
                onClick={this.handleUpdate}
              >
                Update
              </Button>
            </div>
          </div>
        ) : (
          <div />
        )}

        <Dialog
          maxWidth="lg"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenCvDocument}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="cv">Curriculum vitae</DialogTitle>
          <DialogContent>
            {staff && staff.cvDoc && (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {
                  staff !== '' ? (
                    staff.cvDocExtension === 'pdf' ? (
                      <>
                        <Document
                          file={this.renderCvDocumentFile()}
                          onLoadSuccess={this.onDocumentLoadSuccess}
                          onLoadError={console.error}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        <div>
                          <div className="pagec">
                                  Page
                            {' '}
                            {pageNumber || (numPages ? 1 : '--')}
                            {' '}
                                  of
                            {' '}
                            {numPages || '--'}
                          </div>
                          <div className="buttonc">
                            <button
                              type="button"
                              disabled={pageNumber <= 1}
                              onClick={this.previousPage}
                              className="Pre"

                            >
                                    Previous
                            </button>
                            <button
                              type="button"
                              disabled={pageNumber >= numPages}
                              onClick={this.nextPage}
                            >
                                    Next
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img src={this.renderFile()} alt="Document" />
                    )
                  ) : (
                    <div />
                  )
                }
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseCvDocumentDialog}
              color="primary"
            >
              Close
            </Button>
            <Button onClick={this.handleDownloadCvDocument} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  staff: state.getIn(['staffs']).selectedStaff,
  allStaff: state.getIn(['staffs']).allStaff,
  staffResponse: state.getIn(['staffs']).staffResponse,
  isLoadingStaff: state.getIn(['staffs']).isLoading,
  errorStaff: state.getIn(['staffs']).errors,
  staffDocumentResponse: state.getIn(['staffDocuments']).staffDocumentResponse,
  isLoadingStaffDocument: state.getIn(['staffDocuments']).isLoading,
  errorStaffDocument: state.getIn(['staffDocuments']).errors,
  isEdit: state.getIn(['staffs']).isEditStaff,
  // country
  allCountrys: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,
  isLoadingCountry: state.getIn(['countries']).isLoading,
  errorsCountry: state.getIn(['countries']).errors,
  // state
  allStateCountrys: state.getIn(['stateCountries']).allStateCountrys,
  stateCountryResponse: state.getIn(['stateCountries']).stateCountryResponse,
  isLoadingState: state.getIn(['stateCountries']).isLoading,
  errorsState: state.getIn(['stateCountries']).errors,
  // city
  allCitys: state.getIn(['cities']).allCitys,
  cityResponse: state.getIn(['cities']).cityResponse,
  isLoadingCity: state.getIn(['cities']).isLoading,
  errorsCity: state.getIn(['cities']).errors,
  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    updateStaff,
    getAllStaff,
    setStaff,
    setEdit,
    addStaffDocument,
    deleteStaffDocument,
    getAllCountry,
    getAllStateByCountry,
    getAllCityByState,
    showSpinner
  },
  dispatch
);

const StaffProfileGeneralInformationMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffProfileGeneralInformation);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return (
    <StaffProfileGeneralInformationMapped
      changeTheme={changeTheme}
      classes={classes}
    />
  );
};
