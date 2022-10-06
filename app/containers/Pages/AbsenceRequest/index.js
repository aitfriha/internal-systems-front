import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import { Helmet } from 'react-helmet';
import { PapperBlock } from 'dan-components';
import brand from 'dan-api/dummy/brand';

import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Button, Typography, FormControl, InputLabel, Select, MenuItem, Avatar, TextField, Tooltip
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import FolderIcon from '@material-ui/core/SvgIcon/SvgIcon';
import ListItemText from '@material-ui/core/ListItemText';
import EditIcon from '@material-ui/icons/Edit';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import PublishIcon from '@material-ui/icons/Publish';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import Transition from '../../../components/Transition/transition';
import { ThemeContext } from '../../App/ThemeWrapper';
import styles from './absenceRequest-jss';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import {
  updateAbsenceRequest,
  getAllAbsenceRequest,
  deleteAbsenceRequest
} from '../../../redux/absenceRequest/actions';
import notification from '../../../components/Notification/Notification';
import { getAllStaff } from '../../../redux/staff/actions';
import { getAllAbsenceType, getAllAbsenceTypeByState } from '../../../redux/absenceType/actions';
import history from '../../../utils/history';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const useStyles = makeStyles(styles);
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];
class AbsenceRequest extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {};
    this.absencePromiseResolve = () => {};
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      absenceResponsible: {},
      inCopyResponsible: {},
      isStartDateError: false,
      isEndDateError: false,
      absenceRequestToEdit: '',
      absenceRequestToUpdate: {},
      minEndDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      docList: [],
      hourRate: 0,
      displayIt: true,
      staff: null,
      numPages: null,
      absenceType: null,
      pageNumber: null,
      isOpenDocument: false,
      isEditDialogOpen: false,
      absenceRequestToDelete: '',
      isOpenDocumentsList: false,
      docExtension: '',
      docIndex: 0,
      isDeleteDialogOpen: false,
      absenceRequestSelected: {},
      columns: [
        {
          name: 'absenceRequestId',
          label: 'Absence Request Id',
          options: {
            viewColumns: false,
            display: false,
            filter: false,
          }
        },
        {
          name: 'absenceTypeName',
          label: 'Absence Type',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'Staff',
          name: 'staffName',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                /*                position: 'sticky',
                background: 'white', */
                left: '0',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                /*       position: 'sticky',
                background: 'white', */
                left: 0,
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Start Date',
          name: 'startDate',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'End Date',
          name: 'endDate',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'Absence Days',
          name: 'absenceDays',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'estimate hours',
          name: 'hourRate',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'Document',
          name: 'documentList',
          options: {
            filter: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          label: 'Request State',
          name: 'state',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            filter: true
          }
        },
        {
          label: 'Absence responsible',
          name: 'absenceResponsibleName',
          options: {
            filter: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'InCopy responsible',
          name: 'inCopyResponsibleName',
          options: {
            filter: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: ' ',
          name: ' ',
          options: {
            filter: false,
            viewColumns: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {thelogedUser.userRoles[0].actionsNames.hh_absenceRequest_delete
                  ? (
                    <IconButton onClick={() => this.handleEditRequest(tableMeta)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  ) : null}
                {thelogedUser.userRoles[0].actionsNames.hh_absenceRequest_delete
                  ? (
                    <IconButton onClick={() => this.handleDeleteRequest(tableMeta)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  ) : null}
              </React.Fragment>
            )
          }
        }
      ]
    };
  }

  componentDidMount() {
    const { changeTheme, getAllAbsenceRequest } = this.props;
    changeTheme('blueCyanTheme');
    getAllAbsenceRequest();
    const { getAllStaff, getAllAbsenceType } = this.props;
    getAllStaff();
    getAllAbsenceType();
  }

  setCellProps = () => ({
    style: {
      whiteSpace: 'nowrap',
      left: '0',
      zIndex: 100
    }
  });

  setCellHeaderProps = () => ({
    style: {
      whiteSpace: 'nowrap',
      left: 0,
      zIndex: 101
    }
  });

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleDeleteRequest = tableMeta => {
    this.setState({
      isDeleteDialogOpen: true,
      absenceRequestToDelete: tableMeta.rowData[0]
    });
  };

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

  handleAddDocumentButton = () => {
    const { docList } = this.state;
    docList.push({ inputDoc: React.createRef(), doc: {}, docExtension: '' });
    this.setState({
      docList
    });
  };

  handleEditRequest = tableMeta => {
    const { docList } = this.state;
    // docList.push({ inputDoc: React.createRef(), doc: {}, docExtension: '' });
    const {
      allAbsenceRequest, allStaff, allAbsenceTypeByState, getAllAbsenceTypeByState
    } = this.props;
    const absenceRequestToUpdateSelected = allAbsenceRequest.filter(
      absenceRequest => absenceRequest.absenceRequestId === tableMeta.rowData[0]
    )[0];
    if (absenceRequestToUpdateSelected.documentList.length > 0) {
      absenceRequestToUpdateSelected.documentList.forEach((doc, index) => {
        docList.push({
          inputDoc: React.createRef(),
          doc: new File([this.base64ToArrayBuffer(absenceRequestToUpdateSelected.documentList[index])], 'test.pdf', {
            type: this.handleFileDataType((absenceRequestToUpdateSelected.docExtensionList[index])),
            lastModified: new Date()
          }),
          docExtension: absenceRequestToUpdateSelected.docExtensionList[index]
        });
      });
    } else {
      docList.push({ inputDoc: React.createRef(), doc: {}, docExtension: '' });
    }
    // return;
    const sta = allStaff.filter(
      staff => staff.staffId === absenceRequestToUpdateSelected.staffId
    )[0];
    new Promise((resolvea) => {
      getAllAbsenceTypeByState(sta.contractTypeStateId);
      this.absencePromiseResolve = resolvea;
    }).then((result) => {
      if (this.props.allAbsenceTypeByState.length > 0) {
        this.setState({
          docList,
          absenceRequestToEdit: absenceRequestToUpdateSelected.absenceRequestId,
          isEditDialogOpen: true,
          hourRate: absenceRequestToUpdateSelected.hourRate,
          startDate: absenceRequestToUpdateSelected.startDate == '-' ? new Date() : new Date(absenceRequestToUpdateSelected.startDate.toString().slice(0, 10)),
          endDate: absenceRequestToUpdateSelected.endDate == '-' ? new Date() : new Date(absenceRequestToUpdateSelected.endDate.toString().slice(0, 10)),
          absenceType: this.props.allAbsenceTypeByState.filter(
            absenceType => absenceType.absenceTypeId === absenceRequestToUpdateSelected.absenceTypeId
          )[0],
          staff: this.props.allStaff.filter(
            staff => staff.staffId === absenceRequestToUpdateSelected.staffId
          )[0],
          absenceResponsible: allStaff.filter(
            staff => staff.staffId === absenceRequestToUpdateSelected.absenceResponsibleId
          )[0],
          inCopyResponsible: allStaff.filter(
            staff => staff.staffId === absenceRequestToUpdateSelected.inCopyResponsibleId
          )[0]
        });
      } else {
        console.log('no');
      }
    });
  };

  handleOpenDocumentDialog = index => {
    const { absenceRequestSelected } = this.state;
    this.setState({
      isOpenDocument: true,
      docExtension: absenceRequestSelected.docExtensionList[index],
      docIndex: index
    });
  };

  handleOpenDocumentListDialog = tableMeta => {
    const { allAbsenceRequest } = this.props;
    const absenceRequestSelected = allAbsenceRequest.filter(
      absenceRequest => absenceRequest.absenceRequestId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenDocumentsList: true,
      absenceRequestSelected
    });
  };

  handleCloseDocumentListDialog = () => {
    this.setState({
      isOpenDocumentsList: false,
      absenceRequestSelected: {}
    });
  };

  handleCloseDocumentDialog = () => {
    this.setState({
      isOpenDocument: false,
      docExtension: '',
      docIndex: 0
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
    const { absenceRequestSelected, docExtension, docIndex } = this.state;
    return `data:${this.handleFileDataType(docExtension)};base64,${
      absenceRequestSelected.documentList[docIndex]
    }`;
  };

  handleClose = () => {
    this.setState({
      isDeleteDialogOpen: false,
      isEditDialogOpen: false,
      docList: [],
    });
  };

  handleDeleteAbsenceRequest = () => {
    this.setState({
      isDeleteDialogOpen: false,
    });
    const { absenceRequestToDelete } = this.state;
    const { getAllAbsenceRequest, deleteAbsenceRequest } = this.props;
    const promise = new Promise(resolve => {
      deleteAbsenceRequest(absenceRequestToDelete);
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllAbsenceRequest();
      } else {
        notification('danger', result);
      }
    });
  };

  calculDays = () => {
    const { startDate, endDate } = this.state;
    const start = moment(startDate, 'DD/MM/YYYY');
    const end = moment(endDate, 'DD/MM/YYYY');

    const endFirstWeek = start.clone().endOf('week');
    const startLastWeek = end.clone().startOf('week');
    const days = (startLastWeek.diff(endFirstWeek, 'days') * 5) / 7;
    let firstWeekDays = endFirstWeek.day() - start.day(); // check first week
    if (start.day() == 0) --firstWeekDays; // -1 if start with sunday
    let lastWeekDays = end.day() - startLastWeek.day(); // check startLastWeek week
    if (end.day() == 6) --lastWeekDays; // -1 if end with saturday
    const workingDays = firstWeekDays + Math.floor(days) + lastWeekDays;


    return workingDays;
  };

  handleUpdateAbsenceRequest= () => {
    const { updateAbsenceRequest, getAllAbsenceRequest } = this.props;
    const {
      staff,
      absenceType,
      startDate,
      endDate,
      hourRate,
      docList,
      absenceRequestToEdit,
      absenceResponsible,
      inCopyResponsible
    } = this.state;
    const absenceRequest = {
      absenceRequestId: absenceRequestToEdit,
      startDate:
          absenceType.durationType === 'day'
            ? startDate.toISOString().slice(0, 10)
            : '-',
      endDate:
          absenceType.durationType === 'day'
            ? endDate.toISOString().slice(0, 10)
            : '-',
      absenceDays: absenceType.durationType === 'day' ? this.calculDays() : '-',
      hourRate: absenceType.durationType === 'hour' ? hourRate : '-',
      staffId: staff.staffId,
      absenceTypeId: absenceType.absenceTypeId,
      fromName:
          staff.firstName
          + ' '
          + staff.fatherFamilyName
          + ' '
          + staff.motherFamilyName,
      absenceResponsibleId: absenceResponsible.staffId,
      inCopyResponsibleId: inCopyResponsible.staffId,
    };
    const docExtensionList = [];
    const formData = new FormData();
    if (absenceType.documentsMandatory == 'yes') {
      docList.forEach(doc => {
        if (doc.doc.constructor === File) {
          docExtensionList.push(doc.docExtension);
          formData.append('docList', doc.doc);
        }
      });
    } else {
      docList.push(formData.append(
        'doc',
        new Blob([JSON.stringify({})], {
          type: 'application/json'
        })
      ));
    }

    formData.append('docExtensionList', docExtensionList);
    Object.keys(absenceRequest).forEach(e => formData.append(e, absenceRequest[e])
    );
    const promise = new Promise(resolve => {
      updateAbsenceRequest(formData);
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllAbsenceRequest();
        this.setState({
          isEditDialogOpen: false,
          docList: [],
        });
      } else {
        notification('danger', result);
        this.setState({
          isEditDialogOpen: false,
          docList: [],
        });
      }
    });
  };

  handleDownload = () => {
    const { absenceRequestSelected, docIndex, docExtension } = this.state;
    const doc = absenceRequestSelected.documentList[docIndex];
    const docName = `${absenceRequestSelected.name}_Document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(docExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  previousPage = () => {
    this.changePage(-1);
  }

  nextPage = () => {
    this.changePage(1);
  }

  changePage = (offset) => {
    const { pageNumber } = this.state;
    this.setState({
      pageNumber: pageNumber + offset
    });
  }

  handleChangeStaff = (ev, value) => {
    const { getAllAbsenceTypeByState } = this.props;
    new Promise((resolve) => {
      getAllAbsenceTypeByState(value.contractTypeStateId);
      this.editingPromiseResolveA = resolve;
    }).then((result) => {
      if (this.props.allAbsenceTypeByState.length !== 0) {
        this.setState({ displayIt: true });
        this.setState({ countryOfPerson: '' });
      } else {
        notification('danger', 'For this person you have to include the absence type for this country : ' + value.contractTypeCountry);
        this.setState({ displayIt: false });
        this.setState({ countryOfPerson: value.contractTypeCountry });
      }
    });

    this.setState({ staff: value });
  };

  handleChangeAbsenceType = (ev, value) => {
    console.log(value);
    this.setState({ absenceType: value, startDate: new Date(), endDate: new Date() });
  };

  handleCheckHourRateValue = () => {
    const { hourRate, absenceType } = this.state;
    if (absenceType && absenceType.durationType === 'hour') {
      if (
        Number(hourRate) === parseFloat(hourRate)
          && parseFloat(hourRate) <= 7
          && parseFloat(hourRate) > 0
      ) {
        return false;
      }
      return true;
    }
    return false;
  };

  handleDocChange = index => {
    const { docList } = this.state;
    const lastDot = docList[index].inputDoc.current.files[0].name.lastIndexOf(
      '.'
    );
    const ext = docList[index].inputDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      docList[index].doc = docList[index].inputDoc.current.files[0];
      docList[index].docExtension = ext;
      this.setState({
        docList
      });
    }
  };

  handleUploadDocClick = index => {
    const { docList } = this.state;
    docList[index].inputDoc.current.click();
  };

  onErrorDate = (error, value, input) => {
    if (error !== '') {
      if (input === 'startDate') {
        this.setState({
          isStartDateError: true
        });
      } else {
        this.setState({
          isEndDateError: true
        });
      }
    }
  };

  onAcceptDate = (value, input) => {
    if (input === 'startDate') {
      this.setState({
        isStartDateError: false
      });
    } else {
      this.setState({
        isEndDateError: false
      });
    }
  };

  handleDateValue = (value, name) => {
    if (name === 'startDate') {
      this.setState({
        minEndDate: value,
        [name]: value
      });
    } else {
      this.setState({
        [name]: value
      });
    }
  };

  handleChangeAbsenceResponsible = (ev, value) => {
    this.setState({ absenceResponsible: value });
  };

  handleChangeInCopyResponsible = (ev, value) => {
    this.setState({ inCopyResponsible: value });
  };

  render() {
    const {
      classes,
      allAbsenceRequest,
      isLoadingAbsenceRequest,
      absenceRequestResponse,
      errorAbsenceRequest,
      logedUser,
      allStaff, allAbsenceTypeByState, isLoading, absenceTypeResponse, errors
    } = this.props;

    (!isLoading && absenceTypeResponse) && this.absencePromiseResolve(absenceTypeResponse);
    (!isLoading && !absenceTypeResponse) && this.absencePromiseResolve(errors);

    const {
      absenceResponsible, inCopyResponsible,
      pageNumber,
      numPages,
      isOpenDocumentsList,
      isOpenDocument,
      absenceRequestSelected,
      docExtension,
      columns,
      isDeleteDialogOpen,
      isEditDialogOpen,
      absenceType, staff, displayIt, hourRate, docList, startDate, endDate, minEndDate
    } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.hh_absenceRequest_export) {
      exportButton = true;
    }
    const excludeAttributes = ['absenceRequestId', 'staffId', 'absenceTypeId', 'docExtensionList', 'documentList'];
    const title = brand.name + ' - Staff absence requests';
    const { desc } = brand;
    const options = {
      filter: true,
      selectableRows: 'none',
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 10,
      download: exportButton,
      print: exportButton,
      customToolbar: () => (
        <CustomToolbar
          csvData={allAbsenceRequest}
          url="/app/hh-rr/absenceRequest/create-absence-request"
          tooltip="create new absence request"
          fileName="absence request"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.hh_absenceRequest_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.hh_absenceRequest_export}
        />
      )
    };
    !isLoadingAbsenceRequest
      && absenceRequestResponse
      && this.editingPromiseResolve(absenceRequestResponse);
    !isLoadingAbsenceRequest
      && !absenceRequestResponse
      && this.editingPromiseResolve(errorAbsenceRequest);


    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={desc} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={desc} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={desc} />
        </Helmet>
        <Dialog
          open={isEditDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-title">Update absence type</DialogTitle>
          <DialogContent>
            <div>
              <Grid
                container
                spacing={6}
                direction="row"
                justify="center"
                alignItems="center"
              >
                <Grid
                  item
                  xs={12}
                  md={7}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}
                >
                  <Autocomplete
                    id="combo-box-demo"
                    value={staff}
                    options={allStaff}
                    getOptionLabel={option => `${option.firstName} ${option.fatherFamilyName} ${
                      option.motherFamilyName
                    }`
                    }
                    getOptionSelected={(option, value) => option.staffId === value.staffId
                    }
                    onChange={this.handleChangeStaff}
                    style={{ width: '40%', marginTop: 1 }}
                    clearOnEscape
                    renderInput={params => (
                      <TextField
                        fullWidth
                        {...params}
                        label="Staff"
                        variant="outlined"
                      />
                    )}
                  />
                  {displayIt ? (
                    <Autocomplete
                      id="combo-box-demo"
                      value={absenceType}
                      options={allAbsenceTypeByState && allAbsenceTypeByState}
                      getOptionLabel={option => `${option.name}`}
                      getOptionSelected={(option, value) => option.absenceRequestId === value.absenceRequestId
                      }
                      onChange={this.handleChangeAbsenceType}
                      style={{ width: '40%', marginTop: 1 }}
                      clearOnEscape
                      renderInput={params => (
                        <TextField
                          fullWidth
                          {...params}
                          label="Absence Type"
                          variant="outlined"
                        />
                      )}
                    />
                  ) : (
                    <Typography
                      variant="subtitle1"
                      style={{
                        color: '#dc3545',
                        fontFamily: 'sans-serif , Arial',
                        fontSize: '17px'
                      }}
                    >
                        include the absencee type of :
                      {' '}
                      {/*     {countryOfPerson} */}
                    </Typography>
                  )}
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={7}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12
                  }}
                >
                  <Autocomplete
                    id="combo-box-demo"
                    value={absenceResponsible}
                    options={allStaff}
                    getOptionLabel={option => `${option.firstName} ${option.fatherFamilyName} ${
                      option.motherFamilyName
                    }`
                    }
                    getOptionSelected={(option, value) => option.staffId === value.staffId
                    }
                    onChange={this.handleChangeAbsenceResponsible}
                    style={{ width: '40%', marginTop: 1 }}
                    clearOnEscape
                    renderInput={params => (
                      <TextField
                        fullWidth
                        {...params}
                        label="Absence Responsible"
                        variant="outlined"
                      />
                    )}
                  />
                  <Autocomplete
                    id="combo-box-demo"
                    value={inCopyResponsible}
                    options={allStaff}
                    getOptionLabel={option => `${option.firstName} ${option.fatherFamilyName} ${
                      option.motherFamilyName
                    }`
                    }
                    getOptionSelected={(option, value) => option.staffId === value.staffId
                    }
                    onChange={this.handleChangeInCopyResponsible}
                    style={{ width: '40%', marginTop: 1 }}
                    clearOnEscape
                    renderInput={params => (
                      <TextField
                        fullWidth
                        {...params}
                        label="InCopy Responsible"
                        variant="outlined"
                      />
                    )}
                  />

                </Grid>
                { absenceType !== null && absenceType && absenceType.durationType === 'day' ? (
                  <Grid
                    item
                    xs={12}
                    md={7}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 12
                    }}
                  >
                    <div style={{ width: '40%', marginTop: 1 }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          name="startDate"
                          label="Start Date"
                          value={startDate}
                          onError={(error, value) => this.onErrorDate(error, value, 'startDate')
                          }
                          onAccept={value => this.onAcceptDate(value, 'startDate')}
                          onChange={value => this.handleDateValue(value, 'startDate')
                          }
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                    <div style={{ width: '40%', marginTop: 1 }}>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                          disableToolbar
                          variant="inline"
                          format="dd/MM/yyyy"
                          margin="normal"
                          id="date-picker-inline"
                          name="endDate"
                          label="End Date"
                          value={endDate}
                          /*  minDate={minEndDate} */
                          onError={(error, value) => this.onErrorDate(error, value, 'endDate')
                          }
                          onAccept={value => this.onAcceptDate(value, 'endDate')}
                          onChange={value => this.handleDateValue(value, 'endDate')}
                          KeyboardButtonProps={{
                            'aria-label': 'change date'
                          }}
                          fullWidth
                        />
                      </MuiPickersUtilsProvider>
                    </div>
                  </Grid>
                ) : (
                  <div />
                )}
                {absenceType !== null && absenceType && absenceType.durationType === 'hour' && (
                  <Grid
                    item
                    xs={12}
                    md={7}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 12
                    }}
                  >
                    <div style={{ width: '100%' }}>
                      <TextField
                        id="outlined-basic"
                        label="Number of estimate hours"
                        variant="outlined"
                        name="hourRate"
                        value={hourRate}
                        fullWidth
                        className={classes.textField}
                        onChange={this.handleChange}
                      />
                      {this.handleCheckHourRateValue() && (
                        <Typography
                          variant="subtitle1"
                          style={{
                            color: '#dc3545',
                            fontFamily: 'sans-serif , Arial',
                            fontSize: '11px'
                          }}
                        >
                              the inserted value must be a decimal number greater than 1
                              and equal or less than 8
                        </Typography>
                      )}
                    </div>
                  </Grid>
                )}
                <Grid item xs={12} md={7}>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}
                  >
                    {absenceType !== null
                    && absenceType && absenceType.documentsMandatory === 'yes'
                    && docList.map((doc, index) => (
                      <Button
                        className={
                          doc.doc.constructor === Object
                            ? classes.uploadAvatarEmpty
                            : classes.uploadAvatarDone
                        }
                        onClick={() => this.handleUploadDocClick(index)}
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
                            ref={doc.inputDoc}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={() => this.handleDocChange(index)}
                          />
                          <PublishIcon
                            className={classes.uploadIcon}
                            color="secondary"
                          />
                        </div>
                      </Button>
                    ))}
                  </div>
                </Grid>
                {absenceType !== null && absenceType && absenceType.documentsMandatory === 'yes' && (
                  <Grid
                    item
                    xs={12}
                    md={7}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: 5
                    }}
                  >
                    <Tooltip title="Add Document Field">
                      <IconButton
                        color="primary"
                        variant="contained"
                        size="medium"
                        onClick={this.handleAddDocumentButton}
                        disabled={docList.length === 18}
                      >
                        <AddCircleOutlineIcon color="secondary" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                )}
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={
                !staff
                      || !absenceType
                || !absenceResponsible
                || !inCopyResponsible
                /*   || isStartDateError */
                /*  || isEndDateError */
                      || (absenceType.documentsMandatory === 'yes' && docList.length > 0 && docList[0].doc.constructor === Object)
                /*  || isSubmit */
                      || this.handleCheckHourRateValue()
              }
              onClick={this.handleUpdateAbsenceRequest}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDeleteDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="alert-dialog-title">Delete Absence Type</DialogTitle>
          <DialogContent>
            <div>
              <Typography
                variant="subtitle1"
                style={{
                  fontFamily: 'sans-serif , Arial',
                  fontSize: '17px'
                }}
              >
                Are you sure you want to delete this absence request ?
              </Typography>
            </div>
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.handleDeleteAbsenceRequest}>
                  Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="xs"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenDocumentsList}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="docList">List of documents</DialogTitle>
          <DialogContent>
            {absenceRequestSelected && absenceRequestSelected.documentList && (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                <Grid container spacing={2}>
                  <List>
                    {absenceRequestSelected.documentList.map((doc, index) => (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            <FolderIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          style={{ cursor: 'pointer' }}
                          primary={`Absence document ${index + 1}`}
                          onClick={() => this.handleOpenDocumentDialog(index)}
                        />
                        <IconButton
                          onClick={() => this.handleOpenDocumentDialog(index)}
                        >
                          <VisibilityIcon color="secondary" />
                        </IconButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseDocumentListDialog}
              color="primary"
            >
              Close
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
          <DialogTitle id="SaveFormula">Absence Requests Documents </DialogTitle>
          <DialogContent>
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {absenceRequestSelected && docExtension !== '' ? (
                docExtension === 'pdf' ? (
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
                )
              ) : (
                <div />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseDocumentDialog}
              color="primary"
            >
              Close
            </Button>
            <Button onClick={this.handleDownload} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
        <PapperBlock
          desc=""
          title="Staff Absence Requests"
          icon="ios-paper-outline"
          noMargin
        >
          <MUIDataTable
            title=""
            data={allAbsenceRequest}
            columns={columns}
            options={options}
          />
        </PapperBlock>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allAbsenceRequest: state.getIn(['absenceRequests']).allAbsenceRequest,
  absenceRequestResponse: state.getIn(['absenceRequests'])
    .absenceRequestResponse,
  isLoadingAbsenceRequest: state.getIn(['absenceRequests']).isLoading,
  errorAbsenceRequest: state.getIn(['absenceRequests']).errors,

  logedUser: localStorage.getItem('logedUser'),

  allStaff: state.getIn(['staffs']).allStaff,

  allAbsenceTypeByState: state.getIn(['absenceTypes']).allAbsenceTypeByState,
  isLoading: state.getIn(['absenceTypes']).isLoading,
  errors: state.getIn(['absenceTypes']).errors,
  absenceTypeResponse: state.getIn(['absenceTypes']).absenceTypeResponse,
/*
  allAbsenceType: state.getIn(['absenceTypes']).allAbsenceType,
  absenceTypeResponseAbsenceType: state.getIn(['absenceTypes']).absenceTypeResponse,
  isLoadingAbsenceType: state.getIn(['absenceTypes']).isLoading,
  errorAbsenceType: state.getIn(['absenceTypes']).errors, */
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllAbsenceRequest,
    deleteAbsenceRequest,
    getAllStaff,
    getAllAbsenceType,
    getAllAbsenceTypeByState,
    updateAbsenceRequest
  },
  dispatch
);

const AbsenceRequestMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbsenceRequest);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AbsenceRequestMapped changeTheme={changeTheme} classes={classes} />;
};
