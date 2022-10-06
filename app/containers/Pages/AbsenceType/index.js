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
  TextField,
  makeStyles,
  Button,
  Typography, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import PublishIcon from '@material-ui/icons/Publish';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import Transition from '../../../components/Transition/transition';
import { ThemeContext } from '../../App/ThemeWrapper';
import styles from './absenceType-jss';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import {
  getAllAbsenceType,
  updateAbsenceType,
  deleteAbsenceType
} from '../../../redux/absenceType/actions';
import { getAllAbsenceRequestByAbsenceType } from '../../../redux/absenceRequest/actions';
import { getAllStaff } from '../../../redux/staff/actions';
import notification from '../../../components/Notification/Notification';
import clsx from 'clsx';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";


const useStyles = makeStyles(styles);

const inputDoc = React.createRef();

const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];
/*
let getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MuiTableCell: {
          body: {
            background: "white"
          }
        },
        MuiTableRow: {
          root: {
            "&.MuiTableRow-hover": {
              "&:hover td": {
                background: "red !important",
              }
            }
          }
        }
      }
    });*/

class AbsenceType extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.classes.columnBackground);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      pageNumber: null,
      numPages: null,
      code: '',
      name: '',
      description: '',
      isDialogOpen: false,
      isDeleteDialogOpen: false,
      isOpenDocument: false,
      absenceTypeSelected: {},
      absenceResponsible: null,
      inCopyResponsible: null,
      doc: {},
      docExtension: '',
      oldId: '',
      newId: '',
      replaceContractTypeList: [],
      columns: [
        {
          name: 'absenceTypeId',
          label: 'Absence Type Id',
          options: {
            viewColumns: false,
            display: false,
            filter: false,
          }
        },
        {
          name: 'code',
          label: 'Code',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'Name',
          name: 'name',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: "nowrap",
               /* position: "sticky",*/
                left: "0"
              }
            })
            // setCellProps: () => {
            //   return {
            //     className: clsx({
            //       [this.props.classes.columnBackgroundCell]: true,
            //     }),
            //     style: {
            //       whiteSpace: 'nowrap',
            //       position: 'sticky',
            //       left: '0',
            //       zIndex: 100
            //     },
            //   };
            // },
            // setCellHeaderProps: () => {
            //   return {
            //     className: clsx({
            //       [this.props.classes.columnBackgroundHeader]: true,
            //     }),
            //     style: {
            //       whiteSpace: 'nowrap',
            //       position: 'sticky',
            //       left: 0,
            //       zIndex: 101
            //     },
            //   };
            // },
          }
       /*     setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                background: this.props.classes.columnBackground.background,
                left: '0',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                background: this.props.classes.columnBackground.background,
                left: 0,
                zIndex: 101
              }
            })*/
        },
        {
          label: 'Description',
          name: 'description',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                left: '0',
                maxWidth: '300px',
                minWidth: '300px',
                width: '300px'
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                left: 0,
              }
            })
          }
        },
        {
          label: 'Duration type',
          name: 'durationType',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'Documents mandatory',
          name: 'documentsMandatory',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
/*        {
          label: 'Absence responsible',
          name: 'absenceResponsibleName',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'InCopy responsible',
          name: 'inCopyResponsibleName',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },*/
        {
          label: 'Country',
          name: 'countryName',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'State',
          name: 'stateName',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'Document',
          name: 'document',
          options: {
            filter: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value ? (
                  <IconButton
                    onClick={() => this.handleOpenDocumentDialog(tableMeta)}
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
                {thelogedUser.userRoles[0].actionsNames.hh_typesOfAbsences_modify
                  ? (
                    <IconButton onClick={() => this.handleOpenDialog(tableMeta)}>
                      <EditIcon color="secondary" />
                    </IconButton>
                  ) : null}
                {thelogedUser.userRoles[0].actionsNames.hh_typesOfAbsences_delete
                  ? (
                    <IconButton onClick={() => this.handleOpenDeleteDialog(tableMeta)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                  ) : null}
              </React.Fragment>
            )
          }
        }
      ]
    };

    this.editingPromiseResolve1 = () => {
    };

    this.editingPromiseResolve2 = () => {
    };
  }

  componentDidMount() {
    const { changeTheme, getAllAbsenceType, getAllStaff } = this.props;
    changeTheme('blueCyanTheme');
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

  handleUpdate = () => {
    const { allAbsenceType, getAllAbsenceType, updateAbsenceType } = this.props;
    const {
      code,
      name,
      description,
      absenceTypeSelected,
      absenceResponsible,
      inCopyResponsible,
      docExtension,
      doc
    } = this.state;
    const absenceType = {
      absenceTypeId: absenceTypeSelected.absenceTypeId,
      code,
      name,
      description,
/*      absenceResponsibleId: absenceResponsible.staffId,
      inCopyResponsibleId: inCopyResponsible.staffId,*/
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
    Object.keys(absenceType).forEach(e => formData.append(e, absenceType[e]));

    const promise = new Promise(resolve => {
      updateAbsenceType(formData);
      this.editingPromiseResolve1 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllAbsenceType();
        this.setState({
          isDialogOpen: false
        });
      } else {
        notification('danger', result);
      }
    });
  };

  handleOpenDialog = tableMeta => {
    const { allAbsenceType, allStaff } = this.props;
    const absenceTypeSelected = allAbsenceType.filter(
      absenceType => absenceType.absenceTypeId === tableMeta.rowData[0]
    )[0];
    this.setState({
      absenceTypeSelected,
      doc: (typeof absenceTypeSelected.document !== 'undefined' && absenceTypeSelected.document !== null) ? new File([this.base64ToArrayBuffer(absenceTypeSelected.document)], 'testdeclaration.pdf', { type: this.handleFileDataType(absenceTypeSelected.docExtension), lastModified: new Date() }) : {},
      code: absenceTypeSelected.code,
      name: absenceTypeSelected.name,
      description: absenceTypeSelected.description,
      isDialogOpen: true,
/*      absenceResponsible: allStaff.filter(
        staff => staff.staffId === absenceTypeSelected.absenceResponsibleId
      )[0],
      inCopyResponsible: allStaff.filter(
        staff => staff.staffId === absenceTypeSelected.inCopyResponsibleId
      )[0]*/
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

  handleOpenDocumentDialog = tableMeta => {
    const { allAbsenceType } = this.props;
    const absenceTypeSelected = allAbsenceType.filter(
      absenceType => absenceType.absenceTypeId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenDocument: true,
      docExtension: absenceTypeSelected.docExtension,
      absenceTypeSelected
    });
  };

  handleOpenDeleteDialog = tableMeta => {
    const { allAbsenceType, getAllAbsenceRequestByAbsenceType } = this.props;
    const absenceTypeSelected = allAbsenceType.filter(
      absenceType => absenceType.absenceTypeId === tableMeta.rowData[0]
    )[0];
    const promise = new Promise(resolve => {
      getAllAbsenceRequestByAbsenceType(absenceTypeSelected.absenceTypeId);
      this.editingPromiseResolve2 = resolve;
    });
    promise.then(result => {
      if (this.props.allAbsenceRequestByAbsenceType.length === 0) {
        this.setState({
          isDeleteDialogOpen: true,
          isRelated: false,
          oldId: tableMeta.rowData[0],
          absenceTypeSelected
        });
      } else {
        const replaceAbsenceTypeList = allAbsenceType.filter(
          absenceType => absenceType.absenceTypeId !== absenceTypeSelected.absenceTypeId
            && absenceType.stateName === absenceTypeSelected.stateName
        );
        this.setState({
          isDeleteDialogOpen: true,
          isRelated: true,
          oldId: tableMeta.rowData[0],
          replaceAbsenceTypeList,
          absenceTypeSelected
        });
      }
    });
  };

  handleClose = () => {
    this.setState({
      isDialogOpen: false,
      isOpenDocument: false,
      absenceTypeSelected: {},
      doc: {},
      isDeleteDialogOpen: false,
      newId: '',
      pageNumber: 1
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
    const { allAbsenceType } = this.props;
    const { absenceTypeSelected, docExtension } = this.state;
    return `data:${this.handleFileDataType(docExtension)};base64,${
      absenceTypeSelected.document
    }`;
  };

  handleDeleteType = () => {
    const { getAllAbsenceType, deleteAbsenceType } = this.props;
    const { oldId, newId } = this.state;
    const promise = new Promise(resolve => {
      deleteAbsenceType(oldId, newId);
      this.editingPromiseResolve1 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllAbsenceType();
        this.handleClose();
      } else {
        notification('danger', result);
      }
    });
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  handleDownload = () => {
    const { allAbsenceType } = this.props;
    const { absenceTypeSelected } = this.state;
    const doc = absenceTypeSelected.document;
    const docName = `${absenceTypeSelected.name}_Document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(absenceTypeSelected.docExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  handleChangeAbsenceResponsible = (ev, value) => {
    this.setState({ absenceResponsible: value });
  };

  handleChangeInCopyResponsible = (ev, value) => {
    this.setState({ inCopyResponsible: value });
  };

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

  changePage= (offset) => {
    const { pageNumber } = this.state;
    this.setState({
      pageNumber: pageNumber + offset
    });
  }

  previousPage= () => {
    this.changePage(-1);
  }

  nextPage = () => {
    this.changePage(1);
  }

  render() {
    const {
      classes,
      allAbsenceType,
      isLoadingAbsenceType,
      absenceTypeResponse,
      errorAbsenceType,
      allStaff,
      isLoadingAbsenceRequest,
      absenceRequestResponse,
      errorAbsenceRequest,
      logedUser
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    const {
      code,
      name,
      description,
      isDialogOpen,
      isOpenDocument,
      absenceTypeSelected,
      absenceResponsible,
      inCopyResponsible,
      doc,
      pageNumber,
      isDeleteDialogOpen,
      isRelated,
      columns,
      replaceAbsenceTypeList,
      newId,
      numPages
    } = this.state;
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.hh_typesOfAbsences_export) {
      exportButton = true;
    }
    const title = brand.name + ' - Types of staff absence';
    const { desc } = brand;
    const excludeAttributes = ['absenceTypeId','document','docExtension','stateId','absenceResponsibleId','inCopyResponsibleId'];
    const options = {
      filter: true,
      selectableRows: 'none',
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={allAbsenceType}
          url="/app/hh-rr/absenceType/create-absence-type"
          tooltip="add new staff absence type"
          fileName="absence type"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.hh_typesOfAbsences_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.hh_typesOfAbsences_export}
        />
      )
    };
    !isLoadingAbsenceType
      && absenceTypeResponse
      && this.editingPromiseResolve1(absenceTypeResponse);
    !isLoadingAbsenceType
      && !absenceTypeResponse
      && this.editingPromiseResolve1(errorAbsenceType);

    !isLoadingAbsenceRequest
      && absenceRequestResponse
      && this.editingPromiseResolve2(absenceRequestResponse);
    !isLoadingAbsenceRequest
      && !absenceRequestResponse
      && this.editingPromiseResolve2(errorAbsenceRequest);
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
          open={isDeleteDialogOpen}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">Delete Absence Type</DialogTitle>
          <DialogContent>
            {isRelated ? (
              <div>
                <Typography
                  variant="subtitle1"
                  style={{
                    fontFamily: 'sans-serif , Arial',
                    fontSize: '17px'
                  }}
                >
                  this type is related to some absence requests, notice that if
                  you delete this type all the absence requests related in the
                  system will be automatically deleted.
                </Typography>
                <div>
                  <FormControl
                    className={classes.formControl}
                    required
                    style={{ width: '30%' }}
                  >
                    <InputLabel>absence type</InputLabel>
                    <Select
                      name="newId"
                      value={newId}
                      onChange={this.handleChange}
                    >
                      {replaceAbsenceTypeList.map(absenceType => (
                        <MenuItem
                          key={absenceType.code}
                          value={absenceType.absenceTypeId}
                        >
                          {absenceType.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: '#dc3545',
                    fontFamily: 'sans-serif , Arial',
                    fontSize: '17px'
                  }}
                >
                  Are you sure you want to continue with this operation?
                </Typography>
              </div>
            ) : (
              <Typography
                variant="subtitle1"
                style={{
                  fontFamily: 'sans-serif , Arial',
                  fontSize: '17px'
                }}
              >
                this type is not related to any absence request, are you sure
                you want to delete this type?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            {isRelated ? (
              <Button color="primary" onClick={this.handleDeleteType} disabled={newId === ''}>
                  Replace and delete
              </Button>
            ) : (
              <Button color="primary" onClick={this.handleDeleteType}>
                      Delete
              </Button>
            )}
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
          <DialogTitle id="SaveFormula">Absence type document preview</DialogTitle>
          <DialogContent style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
          >
            {absenceTypeSelected ? (
              absenceTypeSelected.docExtension === 'pdf' ? (
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
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleClose} color="primary">
              Close
            </Button>
            <Button onClick={this.handleDownload} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={isDialogOpen}
          disableBackdropClick
          disableEscapeKeyDown
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">
            Edit Staff Absence Type
          </DialogTitle>
          <DialogContent>
            <TextField
              id="outlined-basic"
              label="Code"
              variant="outlined"
              name="code"
              value={code}
              fullWidth
              required
              className={classes.textField}
              onChange={this.handleChange}
              inputProps={{ maxLength: 10 }}
            />
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              name="name"
              value={name}
              fullWidth
              required
              className={classes.textField}
              onChange={this.handleChange}
            />
            <TextField
              id="outlined-basic"
              label="Description"
              variant="outlined"
              name="description"
              value={description}
              fullWidth
              className={classes.textField}
              onChange={this.handleChange}
            />
   {/*         <Autocomplete
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
              style={{ width: '100%', marginTop: '15px' }}
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
              style={{ width: '100%', marginTop: '15px' }}
              clearOnEscape
              renderInput={params => (
                <TextField
                  fullWidth
                  {...params}
                  label="InCopy Responsible"
                  variant="outlined"
                />
              )}
            />*/}
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
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={this.handleUpdate}
              disabled={!code || !name}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
        <PapperBlock
          desc=""
          title="Types of staff absence"
          icon="ios-paper-outline"
          noMargin
        >
        {/*  <MuiThemeProvider theme={getMuiTheme()}>*/}
            <MUIDataTable
              title=""
              data={allAbsenceType}
              columns={columns}
              options={options}
            />
         {/* </MuiThemeProvider>*/}
        </PapperBlock>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allAbsenceType: state.getIn(['absenceTypes']).allAbsenceType,
  absenceTypeResponse: state.getIn(['absenceTypes']).absenceTypeResponse,
  isLoadingAbsenceType: state.getIn(['absenceTypes']).isLoading,
  errorAbsenceType: state.getIn(['absenceTypes']).errors,

  allStaff: state.getIn(['staffs']).allStaff,
  absenceRequestResponse: state.getIn(['absenceRequests'])
    .absenceRequestResponse,
  isLoadingAbsenceRequest: state.getIn(['absenceRequests']).isLoading,
  errorAbsenceRequest: state.getIn(['absenceRequests']).errors,
  allAbsenceRequestByAbsenceType: state.getIn(['absenceRequests'])
    .allAbsenceRequestByAbsenceType,
  logedUser: localStorage.getItem('logedUser')
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    updateAbsenceType,
    getAllAbsenceType,
    deleteAbsenceType,
    getAllStaff,
    getAllAbsenceRequestByAbsenceType
  },
  dispatch
);

const AbsenceTypeMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AbsenceType);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AbsenceTypeMapped changeTheme={changeTheme} classes={classes} />;
};
