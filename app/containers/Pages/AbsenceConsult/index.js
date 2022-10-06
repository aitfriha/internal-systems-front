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
  Avatar,
  makeStyles,
  Button,
  Tooltip,
  Typography
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import FolderIcon from '@material-ui/icons/Folder';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import HourglassEmptyOutlinedIcon from '@material-ui/icons/HourglassEmptyOutlined';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Document, Page, pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Transition from '../../../components/Transition/transition';
import { ThemeContext } from '../../App/ThemeWrapper';
import styles from './absenceRequest-jss';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import {
  getAllAbsenceRequest,
  updateAbsenceConsult
} from '../../../redux/absenceRequest/actions';
import notification from '../../../components/Notification/Notification';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

const useStyles = makeStyles(styles);

class AbsenceRequest extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {};
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      numPages: null,
      pageNumber: null,
      isOpenDocument: false,
      isOpenDocumentsList: false,
      docExtension: '',
      docIndex: 0,
      absenceRequestSelected: {},
      responseType: '',
      isRespondDialog: false,
      selectedRequestId: '',
      isConfirmProcess: false,
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
          name: 'state',
          label: '',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>{this.renderStateAvatar(value)}</React.Fragment>
            )
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
  /*              position: 'sticky',
                background: 'white',*/
                left: '0',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
         /*       position: 'sticky',
                background: 'white',*/
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
          label: 'Absence Hours Rate',
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
          label: ' ',
          name: 'state',
          options: {
            filter: false,
            viewColumns: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value === 'In progress' && (
                  <div>
                    {thelogedUser.userRoles[0].actionsNames.hh_absenceConsult_modify
                      ? (
                        <Tooltip title="Accept">
                          <IconButton
                            onClick={() => this.handleOpenRespondDialog(tableMeta, 'Accept')
                            }
                          >
                            <DoneIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    {thelogedUser.userRoles[0].actionsNames.hh_absenceConsult_modify
                      ? (
                        <Tooltip title="Reject">
                          <IconButton
                            onClick={() => this.handleOpenRespondDialog(tableMeta, 'Reject')
                            }
                          >
                            <ClearIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                  </div>
                )}
                {value === 'Rejected' && (
                    <div>
                      {thelogedUser.userRoles[0].actionsNames.hh_absenceConsult_modify
                          ? (
                              <Tooltip title="Accept">
                                <IconButton
                                    onClick={() => this.handleOpenRespondDialog(tableMeta, 'Accept')
                                    }
                                >
                                  <DoneIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                          ) : null}
                    </div>
                )}
                {value === 'Accepted' && (
                    <div>
                      {thelogedUser.userRoles[0].actionsNames.hh_absenceConsult_modify
                          ? (
                              <Tooltip title="Accept">
                                <IconButton
                                    onClick={() => this.handleOpenRespondDialog(tableMeta, 'Reject')
                                    }
                                >
                                  <ClearIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                          ) : null}
                    </div>
                )}
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

  renderStateAvatar = state => {
    if (state === 'In progress') {
      return (
        <Avatar style={{ backgroundColor: '#67615A' }}>
          <HourglassEmptyOutlinedIcon />
        </Avatar>
      );
    }
    if (state === 'Accepted') {
      return (
        <Avatar style={{ backgroundColor: '#008000' }}>
          <DoneIcon />
        </Avatar>
      );
    }
    if (state === 'Rejected') {
      return (
        <Avatar style={{ backgroundColor: '#F10006' }}>
          <ClearIcon />
        </Avatar>
      );
    }
  };

  handleOpenRespondDialog = (tableMeta, responseType) => {
    this.setState({
      isRespondDialog: true,
      responseType,
      selectedRequestId: tableMeta.rowData[0]
    });
  };

  handleUpdateRequest = () => {
    const { getAllAbsenceRequest, updateAbsenceConsult } = this.props;
    const { responseType, selectedRequestId } = this.state;
    let absenceRequest = {};
    this.setState({
      isConfirmProcess: true
    });
    if (responseType === 'Accept') {
      absenceRequest = {
        absenceRequestId: selectedRequestId,
        state: 'Accepted'
      };
    } else if (responseType === 'Reject') {
      absenceRequest = {
        absenceRequestId: selectedRequestId,
        state: 'Rejected'
      };
    }

    const promise = new Promise(resolve => {
      updateAbsenceConsult(absenceRequest);
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      console.log("absenceRequest#################################################");
      console.log(absenceRequest);
      console.log(result);
      if (isString(result)) {
        notification('success', result);
        getAllAbsenceRequest();
        this.handleCloseResponseDialog();
      } else {
        notification('danger', result);
      }
      this.setState({
        isConfirmProcess: false
      });
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

  handleCloseResponseDialog = () => {
    this.setState({
      isRespondDialog: false
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

  render() {
    const {
      classes,
      allAbsenceRequest,
      isLoadingAbsenceRequest,
      absenceRequestResponse,
      errorAbsenceRequest,
      logedUser
    } = this.props;
    const {
      pageNumber,
      numPages,
      isOpenDocumentsList,
      isOpenDocument,
      absenceRequestSelected,
      docExtension,
      responseType,
      isRespondDialog,
      isConfirmProcess,
      columns
    } = this.state;
    const title = brand.name + ' - Absence Consult';
    const { desc } = brand;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.hh_absenceConsult_export) {
      exportButton = true;
    }
    const options = {
      filter: true,
      selectableRows: 'none',
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 10,
      download: exportButton,
      print: exportButton
    };
    !isLoadingAbsenceRequest && absenceRequestResponse && this.editingPromiseResolve(absenceRequestResponse);
    !isLoadingAbsenceRequest && !absenceRequestResponse && this.editingPromiseResolve(errorAbsenceRequest);

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
          open={isRespondDialog}
          onClose={this.handleCloseResponseDialog}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="sm"
          TransitionComponent={Transition}
        >
          <DialogTitle id="alert-dialog-title">{`${responseType} absence request`}</DialogTitle>
          <DialogContent>
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'sans-serif , Arial',
                fontSize: '17px'
              }}
            >
              {`Are you sure you want to ${responseType} this absence request?`}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              color="primary"
              onClick={this.handleCloseResponseDialog}
              disabled={isConfirmProcess}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={this.handleUpdateRequest}
              disabled={isConfirmProcess}
            >
              Confirm
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
          <DialogTitle id="docList">List of documents </DialogTitle>
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
          <DialogTitle id="SaveFormula">Absence consult documents</DialogTitle>
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
          title="Staff Absence Consult Requests"
          icon="ios-paper-outline"
          noMargin
          desc=""
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

  absenceRequestResponse: state.getIn(['absenceRequests']).absenceRequestResponse,
  isLoadingAbsenceRequest: state.getIn(['absenceRequests']).isLoading,
  errorAbsenceRequest: state.getIn(['absenceRequests']).errors,

  logedUser: localStorage.getItem('logedUser')
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllAbsenceRequest,
    updateAbsenceConsult
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
