import React, { useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import MaterialTable, { MTableToolbar } from 'material-table';

import {
  Grid,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Select,
  Card,
  CardContent,
  Typography,
  Menu,
  IconButton,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Box
} from '@material-ui/core';


import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { makeStyles } from '@material-ui/core/styles';
import { Confirmation } from './Confirmation';
// import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import { TravelRequestDetail } from './TravelRequestDetail';

import {
  getTravelRequests,
  addTravelRequest,
  updateTravelRequest,
  changeStatusTravelRequest,
  exportTravelRequests,
  downloadDocumentsOfTravelRequest
} from '../../../../redux/travelRequest/actions';

import {
  getAllCustomerContractsByCompanyEmail,
  getAllCustomerContractsByEmployee
} from '../../../../redux/staffAssignment/actions';


import { getAllCountry } from '../../../../redux/country/actions';


import {
  getBusinessExpensesTypes
} from '../../../../redux/businessExpenseType/actions';

import {
  getStaffByCompanyEmail
} from '../../../../redux/staff/actions';

import { ThemeContext } from '../../../App/ThemeWrapper';


let self = null;

const styles = {};

const ITEM_HEIGHT = 40;

const today = new Date();
const minimunDate = new Date('1990-01-01');

const logedUser = localStorage.getItem('logedUser');
const logedUserData = JSON.parse(logedUser);

const useStyles = makeStyles((theme) => {

});
const title = brand.name + ' - Travel Requests';
const description = brand.desc;

class TravelRequest extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => { };
    self = this;
    this.state = {
      searchComplete: true,
      anchorEl: null,
      openMenu: false,
      period: 'month',
      startDate: null,
      endDate: null,
      confirmation: {
        openConfirm: false,
        titleConfirm: '',
        textConfirm: '',
      },
      rowData: null,
      status: '',
      columns: [
        {
          title: 'Status', // intl.formatMessage({ id: 'connection.id' }),
          field: 'requestStatusName',
          minWidth: 100,
          maxWidth: 150,
          export: true,
          render: rowData => {
            const value = rowData.requestStatusName;
            switch (rowData.requestStatusMasterValue) {
              case 'REQUESTED': {
                return (<Chip label={value} color="primary" style={{ backgroundColor: '#F1C40F', height: '24px' }} />);
              }
              case 'PENDING APPROVAL': {
                return (<Chip label={value} color="primary" style={{ backgroundColor: '#0A79DF', height: '24px' }} />);
              }
              case 'APPROVED': {
                return (<Chip label={value} color="primary" style={{ backgroundColor: '#27AE60', height: '24px' }} />);
              }
              default: {
                return (<Chip label={value} color="primary" style={{ backgroundColor: '#CB4335', height: '24px' }} />);
              }
            }
          }
        },
        {
          title: 'Request Code', // intl.formatMessage({ id: 'connection.id' }),
          field: 'code',
          searchable: true,
          export: true,
          minWidth: 120,
        },
        {
          title: 'Request Date', // intl.formatMessage({ id: 'connection.id' }),
          field: 'requestDate',
          searchable: false,
          export: true,
          minWidth: 150,
          render: rowData => new Date(rowData.requestDate).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          })
        },
        {
          title: 'First Departure Date', // intl.formatMessage({ id: 'connection.id' }),
          field: 'firstDepartureDate',
          searchable: false,
          export: true,
          minWidth: 150,
          render: rowData => new Date(rowData.firstDepartureDate).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          })
        },
        {
          title: 'Last Arrival Date', // intl.formatMessage({ id: 'connection.id' }),
          field: 'lastArrivalDate',
          searchable: false,
          export: true,
          minWidth: 150,
          render: rowData => new Date(rowData.lastArrivalDate).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          })
        },
        {
          title: 'Days', // intl.formatMessage({ id: 'connection.id' }),
          field: 'days',
          searchable: true,
          export: true,
          minWidth: 100,
          width: 100,
          maxWidth: 100,
        }

      ],
      components: {
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <Tooltip title="Add travel request">
              <span>
                <Fab size="small" color="primary" aria-label="add" style={{ marginBottom: '15px', marginLeft: '20px' }}>
                  <AddIcon onClick={evt => this.handleTravelRequest(evt, null)} />
                </Fab>
              </span>
            </Tooltip>
            <Grid style={{ marginLeft: '20px', marginBottom: '15px' }}>
              <FormControl style={{ marginTop: '19px', minWidth: '14%', width: '14%' }} size="small">
                <InputLabel htmlFor="combo-priod">Filter by period</InputLabel>
                <Select
                  id="combo-priod"
                  value={this.state.period}
                  onChange={(e) => this.handlePeriodChange(e)}
                >
                  <MenuItem value="month">Current month</MenuItem>
                  <MenuItem value="year">Current year</MenuItem>
                  <MenuItem value="another">Another period</MenuItem>
                </Select>
              </FormControl>

              {this.state.period === 'another'
                ? (
                  <React.Fragment>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="start-date-picker"
                        label="Start date"
                        value={this.state.startDate}
                        onChange={(date) => this.handleDateChange(date, 'startDate')}
                        style={{ minWidth: '14%', width: '14%', marginLeft: '25px' }}
                        autoOk
                        minDate={minimunDate}
                        maxDate={this.state.endDate ? this.state.endDate : today}
                        disableFuture
                      />
                    </MuiPickersUtilsProvider>


                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="End date"
                        value={this.state.endDate}
                        onChange={(date) => this.handleDateChange(date, 'endDate')}
                        style={{ minWidth: '14%', width: '14%', marginLeft: '25px' }}
                        autoOk
                        minDate={this.state.startDate ? this.state.startDate : minimunDate}
                        maxDate={today}
                        disableFuture
                      />
                    </MuiPickersUtilsProvider>
                  </React.Fragment>
                ) : null}
              <IconButton
                disabled={this.state.period === 'another' && !this.state.startDate && !this.state.endDate}
                style={{ marginLeft: '10px', marginTop: '25px' }}
                onClick={(e) => this.handleFilterData(e)}
              >
                <SearchIcon />
              </IconButton>
              {this.state.period === 'another'
                ? (
                  <IconButton
                    disabled={this.state.period === 'another' && !this.state.startDate && !this.state.endDate}
                    style={{ marginTop: '25px' }}
                    onClick={(e) => this.handleClearDates(e)}
                  >
                    <ClearIcon />
                  </IconButton>
                )
                : null}
            </Grid>
          </div>
        )
      },
      openDialog: false,
      dataDialog: null
    };
  }


  componentDidMount() {
    const { changeTheme } = this.props;
    changeTheme('greyTheme');

    const {
      getTravelRequests, getAllCountry, getAllCustomerContractsByCompanyEmail, getBusinessExpensesTypes, getStaffByCompanyEmail
    } = this.props;

    const companyEmail = logedUserData.userEmail;

    const data = {
      companyEmail,
      period: 'month',
      startDate: null,
      endDate: null
    };
    getTravelRequests(data);
    getAllCustomerContractsByCompanyEmail(companyEmail);
    getBusinessExpensesTypes();
    getAllCountry();
    getStaffByCompanyEmail(companyEmail);
  }

  componentWillUnmount() {
    this.setState({
      anchorEl: null,
      openMenu: false,
      openDialog: false,
      dataDialog: null
    });
  }


  getWeekOfYear = (dt) => {
    const tdt = new Date(dt.valueOf());
    const dayn = (dt.getDay() + 6) % 7;
    tdt.setDate(tdt.getDate() - dayn + 3);
    const firstThursday = tdt.valueOf();
    tdt.setMonth(0, 1);
    if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - tdt) / 604800000);
  }


  //----------------------------------------------------------------------------------------------

  // HANDLE ACTIONS

  handleFilterData = (e) => {
    this.setState({
      searchComplete: true,
    });
    const { getTravelRequests } = this.props;

    const companyEmail = logedUserData.userEmail;
    const data = {
      companyEmail,
      period: this.state.period,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };
    getTravelRequests(data);
  }

  handleClearDates = (e) => {
    this.setState({
      startDate: null,
      endDate: null
    });
  }

  handlePeriodChange = (e) => {
    const newValue = e.target.value;
    this.setState({
      period: newValue,
      searchComplete: false
    });
    if (newValue !== 'another') {
      this.setState({
        startDate: null,
        endDate: null
      });
    }
  }

  handleDateChange = (date, option) => {
    this.setState({
      startDate: option === 'startDate' ? date : this.state.startDate,
      endDate: option === 'endDate' ? date : this.state.endDate
    });
  }

  handleTravelRequest = (e, rowData) => {
    const { staff } = this.props;
    this.setState({
      openDialog: true,
      dataDialog: rowData || {
        requesterAvatar: staff.photo,
        requesterCompany: staff.companyName,
        requesterFatherFamilyName: staff.fatherFamilyName,
        requesterId: staff.staffId,
        requesterMotherFamilyName: staff.motherFamilyName,
        requesterName: staff.firstName,
        requesterPersonalNumber: staff.personalNumber,
      }
    });
  }

  handleNoConfirm() {
    self.setState({
      confirmation: {
        openConfirm: false,
        titleConfirm: '',
        textConfirm: '',
      },
      rowData: null
    });
  }

  handleClose = (afterSaveAction) => {
    this.setState({
      openDialog: false,
      dataDialog: null,
      period: afterSaveAction ? 'month' : this.state.period
    });
  }

  handleOpenMenu(event) {
    self.setState({
      anchorEl: event.currentTarget,
      openMenu: true
    });
  }

  handleCloseMenu() {
    self.setState({
      anchorEl: null,
      openMenu: false
    });
  }

  getMonthInLetter(month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[month];
  }


  handleExportCSV(event) {
    const { exportTravelRequests } = this.props;
    const companyEmail = logedUserData.userEmail;
    new Promise((resolve) => {
      const params = {
        fileType: 'excel',
        companyEmail,
        period: this.state.period,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      };
      exportTravelRequests(params);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
      this.setState({
        searchComplete: true,
        anchorEl: null,
        openMenu: false,
      });

      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TRAVEL REQUESTS.xlsx');
      document.body.appendChild(link);
      link.click();
    });
  }

  handleExportPDF(event) {
    const { exportTravelRequests } = this.props;
    const companyEmail = logedUserData.userEmail;
    new Promise((resolve) => {
      const params = {
        fileType: 'pdf',
        companyEmail,
        period: this.state.period,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      };
      exportTravelRequests(params);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
      this.setState({
        searchComplete: true,
        anchorEl: null,
        openMenu: false,
      });

      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TRAVEL REQUESTS.pdf');
      document.body.appendChild(link);
      link.click();
    });
  }

  handleDownloadDocuments(event, rowData) {
    const { downloadDocumentsOfTravelRequest } = this.props;
    new Promise((resolve) => {
      downloadDocumentsOfTravelRequest(rowData.id);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'TRAVEL REQUEST -' + rowData.code + ' - DOCUMENTS.pdf');
      document.body.appendChild(link);
      link.click();
    });
  }


  //-------------------------------------------------------------------------------------------------------

  render() {
    const {
      intl, location, isLoading, errors, travelRequestResponse, allCountrys, travelRequests, getTravelRequests, addTravelRequest, updateTravelRequest, changeStatusTravelRequest, customerContracts, businessExpensesTypes,
      logedUser
    } = this.props;
    const { columns } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    (!isLoading && travelRequestResponse) && this.editingPromiseResolve(travelRequestResponse);
    (!isLoading && !travelRequestResponse) && this.editingPromiseResolve(errors);

    return (
      <div>
        {/* <HelmetCustom location={location} /> */}
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        {!this.state.openDialog
          ? (
            <MaterialTable
              title=""
              columns={columns}
              data={travelRequests && travelRequests}
              actions={
                [
                  rowData => ({
                    disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_export && rowData.requestStatusMasterValue !== 'APPROVED',
                    icon: () => <CloudDownloadIcon variant="outlined" name="download" />,
                    tooltip: 'Download document(s)',
                    onClick: (e) => this.handleDownloadDocuments(e, rowData)
                  }),
                  rowData => ({
                    disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_modify && rowData.requestStatusMasterValue !== 'REQUESTED' && rowData.requestStatusMasterValue !== 'PENDING APPROVAL',
                    icon: () => <CloseIcon variant="outlined" name="cancel" />,
                    tooltip: 'Cancel', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                    onClick: (e) => {
                      this.setState({
                        confirmation: {
                          openConfirm: true,
                          titleConfirm: 'Confirmation dialog',
                          textConfirm: 'Are you sure you want to CANCEL this travel request ?'
                        },
                        rowData,
                        status: 'CANCELED'
                      });
                    }
                  }),
                  rowData => ({
                    disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_modify && rowData.requestStatusMasterValue !== 'REQUESTED' && rowData.requestStatusMasterValue !== 'PENDING APPROVAL',
                    icon: () => <EditIcon variant="outlined" name="edit" />,
                    tooltip: 'Edit', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                    onClick: (e) => this.handleTravelRequest(e, rowData)
                  }),
                  {
                    icon: 'save_alt',
                    tooltip: 'Export',
                    disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_export || (!this.state.searchComplete || (this.state.period === 'another' && !this.state.startDate && !this.state.endDate) || travelRequests.length === 0),
                    isFreeAction: true,
                    onClick: (event) => this.handleOpenMenu(event)
                  },
                ]
              }
              // localization={localizationMaterialTable(intl)}
              components={this.state.components}
              options={{
                actionsColumnIndex: -1
              }}
              detailPanel={rowData => (
                <Card className="info-content">
                  <CardContent>
                    <Grid item xs={12} md={12}>
                      <Typography component="span" variant="subtitle2" gutterBottom>
                        Journey list
                      </Typography>
                      <Box margin={1}>
                        <Table size="small" aria-label="journeys">
                          <TableHead>
                            <TableRow>
                              <TableCell>No.</TableCell>

                              <TableCell>From</TableCell>
                              <TableCell>Departure Date</TableCell>

                              <TableCell>To</TableCell>
                              <TableCell>Arrival Date</TableCell>

                              <TableCell>Transport Type</TableCell>

                              <TableCell>Lodging Type</TableCell>

                              <TableCell>Nearest Address</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowData.journeys.map((journey, index) => (
                              <TableRow key={index}>
                                <TableCell style={{ minWidth: 65, width: 65, maxWidth: 65 }}>{journey.order}</TableCell>
                                <TableCell>
                                  {`${journey.fromCityName} 
                                             ${journey.fromStateName} 
                                             ${journey.fromCountryName}`}
                                </TableCell>
                                <TableCell style={{ minWidth: 120, width: 120, maxWidth: 120 }}>
                                  {new Date(journey.departureDate).toLocaleString('es-ES', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour12: true,
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </TableCell>
                                <TableCell>
                                  {`${journey.toCityName} 
                                             ${journey.toStateName} 
                                             ${journey.toCountryName}`}
                                </TableCell>
                                <TableCell style={{ minWidth: 120, width: 120, maxWidth: 120 }}>
                                  {
                                    new Date(journey.arrivalDate).toLocaleString('es-ES', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour12: true,
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell style={{ minWidth: 130 }}>{journey.transportTypeName}</TableCell>
                                <TableCell style={{ minWidth: 130 }}>{journey.lodgingTypeName}</TableCell>
                                <TableCell style={{ minWidth: 150 }}>{journey.address}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={12}>
                      <Typography component="span" variant="subtitle2" gutterBottom>
                        Customers and operations to visit
                      </Typography>
                      <Box margin={1}>
                        <Table size="small" aria-label="customer-contracts">
                          <TableHead>
                            <TableRow>
                              <TableCell>Journey No.</TableCell>
                              <TableCell>Customer Code</TableCell>
                              <TableCell>Customer Name</TableCell>
                              <TableCell>Operation Code</TableCell>
                              <TableCell>Operation Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowData.journeys.map((journey, journeyIndex) => (
                              journey.visits.map((visit, visitIndex) => (
                                <TableRow key={visitIndex}>
                                  <TableCell>{journey.order}</TableCell>
                                  <TableCell>{visit.customerCode}</TableCell>
                                  <TableCell>{visit.customerName}</TableCell>
                                  <TableCell>{visit.operationCode}</TableCell>
                                  <TableCell>{visit.operationName}</TableCell>
                                </TableRow>
                              ))))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                  </CardContent>
                </Card>
              )}
            />
          )
          : (
            <TravelRequestDetail
              obj={this.state.dataDialog}
              handleClose={this.handleClose}
              addTravelRequest={addTravelRequest}
              updateTravelRequest={updateTravelRequest}
              getTravelRequests={getTravelRequests}
              isLoading={isLoading}
              travelRequestResponse={travelRequestResponse}
              errors={errors}
              countries={allCountrys}
              customerContracts={customerContracts}
              businessExpensesTypes={businessExpensesTypes}
            />
          )}
        {this.state.openMenu
          ? (
            <React.Fragment>
              <Menu
                id="long-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={this.state.openMenu}
                onClose={this.handleCloseMenu}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: 150
                  },
                }}
              >
                {thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_export ? (
                  <MenuItem key="csv" onClick={(event) => this.handleExportCSV(event)} value="csv">
                  Export as CSV
                  </MenuItem>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_travelRequest_export ? (
                  <MenuItem key="pdf" onClick={(event) => this.handleExportPDF(event)} value="pdf">
                  Export as PDF
                  </MenuItem>
                ) : null}
              </Menu>
            </React.Fragment>
          )
          : null
        }
        <Confirmation
          openConfirm={this.state.confirmation.openConfirm}
          options={{
            title: this.state.confirmation.titleConfirm,
            text: this.state.confirmation.textConfirm,
            rowData: this.state.rowData,
            status: this.state.status,
            case: 'TRAVEL REQUEST'
          }}
          data={{
            companyEmail: logedUserData.userEmail,
            period: this.state.period,
            startDate: this.state.startDate,
            endDate: this.state.endDate
          }}
          handleNoConfirm={this.handleNoConfirm}
          isLoading={isLoading}
          errors={errors}
          travelRequestResponse={travelRequestResponse}
          changeStatusTravelRequest={changeStatusTravelRequest}
          getTravelRequests={getTravelRequests}
        />
      </div>
    );
  }
}

TravelRequest.propTypes = {
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  travelRequestResponse: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  allCountrys: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,
  customerContracts: state.getIn(['staffAssignment']).customerContracts,
  staffAssignmentResponse: state.getIn(['staffAssignment']).staffAssignmentResponse,

  businessExpensesTypes: state.getIn(['businessExpenseType']).businessExpensesTypes,
  businessExpenseTypeResponse: state.getIn(['businessExpenseType']).businessExpenseTypeResponse,

  staff: state.getIn(['staffs']).staff,
  staffResponse: state.getIn(['staffs']).staffResponse,

  travelRequests: state.getIn(['travelRequest']).travelRequests,
  travelRequestResponse: state.getIn(['travelRequest']).travelRequestResponse,
  isLoading: state.getIn(['travelRequest']).isLoading,
  errors: state.getIn(['travelRequest']).errors,
  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTravelRequests,
  addTravelRequest,
  updateTravelRequest,
  changeStatusTravelRequest,
  exportTravelRequests,
  downloadDocumentsOfTravelRequest,
  getAllCountry,
  getAllCustomerContractsByCompanyEmail,
  getAllCustomerContractsByEmployee,
  getBusinessExpensesTypes,
  getStaffByCompanyEmail
}, dispatch);


const TravelRequestMapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(TravelRequest));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <TravelRequestMapped changeTheme={changeTheme} classes={classes} />;
};

// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(injectIntl(TravelRequest)));
