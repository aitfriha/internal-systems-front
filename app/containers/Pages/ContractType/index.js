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
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem, Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import excelIcon from '../../../api/images/wordIcone.png';
import styles from '../AbsenceType/absenceType-jss';
import Transition from '../../../components/Transition/transition';
import { ThemeContext } from '../../App/ThemeWrapper';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import {
  getAllContractType,
  updateContractType,
  deleteContractType
} from '../../../redux/contractType/actions';
import { getAllStaffContractByContractType } from '../../../redux/staffContract/actions';
import notification from '../../../components/Notification/Notification';


const useStyles = makeStyles(styles);
const inputDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'docx'];
class ContractType extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      code: '',
      name: '',
      description: '',
      isDialogOpen: false,
      isDeleteDialogOpen: false,
      isRelated: false,
      contractTypeSelected: {},
      doc: {},
      contractModel: {
        value: 'full-time',
        label: 'full-time',
      },
      replaceContractTypeList: [],
      isOpenDocumentsList: false,
      docExtension: '',
      oldId: '',
      newId: '',
      columns: [
        {
          name: 'contractTypeId',
          label: 'Contract Type Id',
          options: {
            viewColumns: false,
            display: false,
            filter: false,
            print: false,
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
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'contract Model',
          name: 'contractModel',
          options: {
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps()
          }
        },
        {
          label: 'contract Document',
          name: 'documentModelContract',
          options: {
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
          label: 'Description',
          name: 'description',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                left: '0',
                zIndex: 100,
                minWidth: '300px',
                width: '300px'
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                left: 0,
                zIndex: 101
              }
            })
          }
        },
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
          label: ' ',
          name: ' ',
          options: {
            filter: false,
            viewColumns: false,
            export: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {thelogedUser.userRoles[0].actionsNames.hh_typesOfContracts_modify
                  ? (
                    <IconButton onClick={() => this.handleOpenDialog(tableMeta)}>
                      <EditIcon color="secondary" />
                    </IconButton>
                  ) : null}
                {thelogedUser.userRoles[0].actionsNames.hh_typesOfContracts_delete
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
    const { changeTheme, getAllContractType } = this.props;
    changeTheme('blueCyanTheme');
    getAllContractType();
  }

  setCellProps = () => ({
    style: {
      whiteSpace: 'nowrap',
      /*  position: 'sticky', */
      left: '0',
      zIndex: 100
    }
  });

  setCellHeaderProps = () => ({
    style: {
      whiteSpace: 'nowrap',
      /* position: 'sticky', */
      left: 0,
      zIndex: 101
    }
  });

  handleOpenDocumentListDialog = tableMeta => {
    const { allContractType } = this.props;
    const contractTypeSelected = allContractType.filter(
      absenceRequest => absenceRequest.contractTypeId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenDocumentsList: true,
      contractTypeSelected
    });
  };

  handleUploadDocDelete= () => {
    inputDoc.current.value = '';
    this.setState({
      doc: {},
      docExtension: '',
      contractTypeSelected: {}
    });
  };

  handleUploadDocClick = () => {
    inputDoc.current.value = '';
    inputDoc.current.click();
  };

  handleCloseDocumentListDialog = () => {
    this.setState({
      isOpenDocumentsList: false,
      contractTypeSelected: {}
    });
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
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
  };

  renderFile = () => {
    const { contractTypeSelected } = this.state;
    return `data:${this.handleFileDataType(contractTypeSelected.docExtension)};base64,${
      contractTypeSelected.documentModelContract
    }`;
  };

  handleDownload = () => {
    const { contractTypeSelected } = this.state;
    const doc = contractTypeSelected.documentModelContract;
    const docName = `${contractTypeSelected.name}_Document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(contractTypeSelected.docExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleUpdate = () => {
    const {
      allContractType,
      getAllContractType,
      updateContractType
    } = this.props;
    const {
      code, name, description, contractTypeSelected, contractModel, docExtension, doc
    } = this.state;
    const contractType = {
      contractTypeId: contractTypeSelected.contractTypeId,
      code,
      name,
      docExtension,
      contractModel: contractModel.value,
      description
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
    Object.keys(contractType).forEach(e => formData.append(e, contractType[e]));
    const promise = new Promise(resolve => {
      updateContractType(formData);
      this.editingPromiseResolve1 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllContractType();
        this.setState({
          isDialogOpen: false
        });
      } else {
        notification('danger', result);
      }
    });
  };

  handleOpenDialog = tableMeta => {
    const { allContractType } = this.props;
    const contractTypeSelected = allContractType.filter(
      contractType => contractType.contractTypeId === tableMeta.rowData[0]
    )[0];
    this.setState({
      contractTypeSelected,
      code: contractTypeSelected.code,
      name: contractTypeSelected.name,
      description: contractTypeSelected.description,
      contractModel: {
        value: contractTypeSelected.contractModel,
        label: contractTypeSelected.contractModel,
      },
      /* doc: typeof contractTypeSelected.documentModelContract !== 'undefined' ? contractTypeSelected.documentModelContract : {}, */
      doc: new File([this.base64ToArrayBuffer(contractTypeSelected.documentModelContract)], 'test.pdf', {
        type: this.handleFileDataType(contractTypeSelected.docExtension),
        lastModified: new Date()
      }),
      docExtension: typeof contractTypeSelected.docExtension !== 'undefined' ? contractTypeSelected.docExtension : '',
      isDialogOpen: true
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

  handleOpenDeleteDialog = tableMeta => {
    const { allContractType, getAllStaffContractByContractType } = this.props;
    const contractTypeSelected = allContractType.filter(
      contractType => contractType.contractTypeId === tableMeta.rowData[0]
    )[0];
    const promise = new Promise(resolve => {
      // get client information
      getAllStaffContractByContractType(contractTypeSelected.contractTypeId);
      this.editingPromiseResolve2 = resolve;
    });
    promise.then(result => {
      if (this.props.allStaffContractByContractType.length === 0) {
        this.setState({
          isDeleteDialogOpen: true,
          isRelated: false,
          oldId: contractTypeSelected.contractTypeId
        });
      } else {
        const replaceContractTypeList = allContractType.filter(
          type => type.contractTypeId !== contractTypeSelected.contractTypeId
            && type.stateName === contractTypeSelected.stateName
        );
        this.setState({
          isDeleteDialogOpen: true,
          isRelated: true,
          oldId: contractTypeSelected.contractTypeId,
          replaceContractTypeList
        });
      }
    });
  };

  handleChangeContractModel = (ev, value) => {
    this.setState({ contractModel: value });
  };

  handleClose = () => {
    this.setState({
      isDialogOpen: false,
      isDeleteDialogOpen: false,
      newId: ''
    });
  };

  handleDeleteType = () => {
    const { getAllContractType, deleteContractType } = this.props;
    const { oldId, newId } = this.state;
    const promise = new Promise(resolve => {
      deleteContractType(oldId, newId);
      this.editingPromiseResolve1 = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllContractType();
        this.handleClose();
      } else {
        notification('danger', result);
      }
    });
  };

  render() {
    const contractModels = [
      {
        value: 'full-time',
        label: 'full-time',
      },
      {
        value: 'part-time',
        label: 'part-time',
      },
      {
        value: 'internship',
        label: 'internship',
      }];
    const {
      classes,
      allContractType,
      isLoadingContractType,
      contractTypeResponse,
      errorContractType,
      isLoadingStaffContract,
      staffContractResponse,
      errorStaffContract,
      logedUser
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    const {
      code,
      name,
      description,
      isDialogOpen,
      isDeleteDialogOpen,
      isRelated,
      replaceContractTypeList,
      newId,
      columns,
      isOpenDocumentsList,
      contractTypeSelected,
      docExtension,
      doc,
      contractModel,
    } = this.state;
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.hh_typesOfContracts_export) {
      exportButton = true;
    }
    const title = brand.name + ' - Types of staff contract';
    const { desc } = brand;
    const excludeAttributes = ['contractTypeId', 'documentModelContract', 'stateId', 'docExtension'];
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
          csvData={allContractType}
          url="/app/hh-rr/contractType/create-contract-type"
          tooltip="add new staff contract type"
          fileName="contract type"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.hh_typesOfContracts_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.hh_typesOfContracts_export}
        />
      )
    };
    !isLoadingContractType
      && contractTypeResponse
      && this.editingPromiseResolve1(contractTypeResponse);
    !isLoadingContractType
      && !contractTypeResponse
      && this.editingPromiseResolve1(errorContractType);

    !isLoadingStaffContract
      && staffContractResponse
      && this.editingPromiseResolve2(staffContractResponse);
    !isLoadingStaffContract
      && !staffContractResponse
      && this.editingPromiseResolve2(errorStaffContract);
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
          maxWidth="xl"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenDocumentsList}
          classes={{
            paper: classes.paper
          }}
        >
          <DialogTitle id="docList">Contract type document</DialogTitle>
          <DialogContent>
            {contractTypeSelected && contractTypeSelected.documentModelContract && (
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
                  contractTypeSelected !== '' ? (
                    (contractTypeSelected.docExtension === 'pdf') ? (
                      <Document
                        file={this.renderFile()}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                        onLoadError={console.error}
                      >
                        <Page pageNumber={1} />
                      </Document>
                    ) : (
                      (contractTypeSelected.docExtension === 'docx') ? (
                        <img src={excelIcon} alt="document" />
                      ) : (
                        <img src={this.renderFile()} alt="document" />
                      )
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
              onClick={this.handleCloseDocumentListDialog}
              color="primary"
            >
              Close
            </Button>
            <Button onClick={this.handleDownload} color="primary">
              Download
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
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">
            Delete Contract Type
          </DialogTitle>
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
                  this type is related to some contracts, choose an other
                  contract type to replace it:
                </Typography>
                <div>
                  <FormControl
                    className={classes.formControl}
                    required
                    style={{ width: '30%' }}
                  >
                    <InputLabel>Contract type</InputLabel>
                    <Select
                      name="newId"
                      value={newId}
                      onChange={this.handleChange}
                    >
                      {replaceContractTypeList.map(type => (
                        <MenuItem key={type.code} value={type.contractTypeId}>
                          {type.name}
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
                    fontSize: '14px'
                  }}
                >
                  Notice that all the staff contract history related to this
                  contract type will be deleted permanently
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
                this type is not related to any contract, are you sure you want
                to delete this type?
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button autoFocus color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            {isRelated ? (
              <Button
                color="primary"
                disabled={newId === ''}
                onClick={this.handleDeleteType}
              >
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
            Edit Contract Type
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
            <Autocomplete
              id="combo-box-demo"
              name="contractModel"
              value={contractModel}
              options={contractModels}
              getOptionLabel={option => option.label || ''}
              onChange={this.handleChangeContractModel}
              style={{ marginTop: 13 }}
              clearOnEscape
              renderInput={params => (
                <TextField
                  fullWidth
                  {...params}
                  label="Contract Model"
                  variant="outlined"
                />
              )}
            />
            <div
              style={{
                textAlign: 'center', opacity: '0.7'
              }}
            >
              {contractTypeSelected && contractTypeSelected.documentModelContract && (
                <div>
                  {
                    contractTypeSelected !== '' ? (
                      docExtension === 'pdf' ? (
                        <Document
                          file={this.renderFile()}
                          onLoadSuccess={this.onDocumentLoadSuccess}
                          onLoadError={console.error}
                        />
                      ) : (
                        docExtension === 'docx' ? (
                          <img
                            src={excelIcon}
                            style={{
                              maxWidth: 160, marginTop: 20
                            }}
                            alt="Document"
                          />
                        ) : (
                          <img
                            src={this.renderFile()}
                            style={{
                              maxWidth: 160, marginTop: 20
                            }}
                            alt="Document"
                          />
                        )
                      )
                    ) : (
                      <div />
                    )
                  }
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20,
                  marginBottom: 0,
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
                      accept=".png, .jpg, .jpeg, .pdf, .tiff, .docx"
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
                      model contract
                    </Typography>
                  </div>
                </IconButton>
              </div>
              <div
                style={{
                  marginTop: 2,
                }}
              >
                <Button variant="text" onClick={this.handleUploadDocDelete}>delete</Button>
              </div>
            </div>
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
          title="Types of staff contract"
          icon="ios-paper-outline"
          noMargin
          desc=""
        >
          <MUIDataTable
            title=""
            data={allContractType}
            columns={columns}
            options={options}
          />
        </PapperBlock>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allContractType: state.getIn(['contractTypes']).allContractType,
  contractTypeResponse: state.getIn(['contractTypes']).contractTypeResponse,
  isLoadingContractType: state.getIn(['contractTypes']).isLoading,
  errorContractType: state.getIn(['contractTypes']).errors,
  staffContractResponse: state.getIn(['staffContracts']).staffContractResponse,
  isLoadingStaffContract: state.getIn(['staffContracts']).isLoading,
  errorStaffContract: state.getIn(['staffContracts']).errors,
  allStaffContractByContractType: state.getIn(['staffContracts'])
    .allStaffContractByContractType,
  logedUser: localStorage.getItem('logedUser')
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    updateContractType,
    getAllContractType,
    deleteContractType,
    getAllStaffContractByContractType
  },
  dispatch
);

const ContractTypeMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContractType);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <ContractTypeMapped changeTheme={changeTheme} classes={classes} />;
};
