import React, { useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import MaterialTable, { MTableToolbar } from 'material-table';


import {
  Grid,
  FormControl,
  InputLabel,
  Drawer,
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
  Box, CardActions, Button
} from '@material-ui/core';


import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import { Confirmation } from './Confirmation';
import TravelRequestDocumentPanel from './TravelRequestDocumentPanel';

import {
  getTravelRequests,
  changeStatusTravelRequest,
  exportTravelRequests,
  approveTravelRequest
} from '../../../../redux/travelRequest/actions';

import {
  getCurrencyTypes
} from '../../../../redux/currencyType/actions';

import {
  getDataByCurrencyType,
  getDataAssociatedWithCurrencyTypes
} from '../../../../redux/currency/actions';

import { ThemeContext } from '../../../App/ThemeWrapper';
import CurrencyService from '../../../Services/CurrencyService';
import Dropzone from './Dropzone';
import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import { isString } from "lodash";
import notification from "../../../../components/Notification/Notification";


let self = null;

const styles = {};

const ITEM_HEIGHT = 40;

const today = new Date();
const minimunDate = new Date('1990-01-01');

const useStyles = makeStyles((theme) => {

});
const title = brand.name + ' - Travels Management';
const description = brand.desc;

class TravelManagement extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.editingPromiseResolve = () => {};
    self = this;
    this.state = {
      filesToUpload: [],
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
      showDrawer: false,
      columnsZ: [
        {
          title: 'Name', // intl.formatMessage({ id: 'connection.id' }),
          field: 'name',
          editable: 'never'
        },
        {
          title: 'Local Currency Type',
          field: 'currencyName',
          minWidth: 150,
          width: 150,
          maxWidth: 150,
          render: rowData => {
            const index = this.state.currencies.findIndex(obj => obj.currencyId === rowData.localCurrencyTypeId);
            return index > -1 ? this.state.currencies[index].typeOfCurrency.currencyName : '---';
          },
          validate: rowData => (this.state.localCurrencyType !== '' ? this.state.localCurrencyType !== 'none' : (rowData.localCurrencyTypeId !== '' && rowData.localCurrencyTypeId !== 'none')),
          editComponent: props => (
              <Select
                  id="local-currency-type-select"
                  name="localCurrencyType"
                  value={this.state.localCurrencyType || props.value || 'none'}
                  onChange={(e) => this.changeFileAttributeValue(e)}
                  error={this.state.localCurrencyType !== '' ? this.state.localCurrencyType === 'none' : (props.value === '' || props.value === 'none')}
              >
                <MenuItem value="none">
                  <em>Empty</em>
                </MenuItem>
                {this.state.currencies.map(currency => <MenuItem key={currency.currencyId} value={currency.currencyId}>{currency.typeOfCurrency.currencyName}</MenuItem>)}
              </Select>
          )
        },
        {
          title: 'Local Currency Amount',
          field: 'localCurrencyAmount',
          minWidth: 120,
          width: 120,
          maxWidth: 120,
          render: rowData => this.toCommas(parseFloat(rowData.localCurrencyAmount).toFixed(2)),
          validate: rowData => rowData.localCurrencyAmount > 0 && !isNaN(rowData.localCurrencyAmount)
        }
      ],
      columns: [
        {
          title: 'Status', // intl.formatMessage({ id: 'connection.id' }),
          field: 'requestStatusName',
          minWidth: 100,
          maxWidth: 150,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export,
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
          export: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export,
          minWidth: 120
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
          title: 'Requester Name', // intl.formatMessage({ id: 'connection.id' }),
          field: '',
          searchable: false,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export,
          minWidth: 150,
          render: rowData => `${rowData.requesterName} ${rowData.requesterFatherFamilyName} ${rowData.requesterMotherFamilyName}`
        },
        {
          title: 'Company Email', // intl.formatMessage({ id: 'connection.id' }),
          field: 'requesterCompanyEmail',
          searchable: false,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export,
          minWidth: 150
        },
        {
          title: 'Company Name', // intl.formatMessage({ id: 'connection.id' }),
          field: 'requesterCompany',
          searchable: false,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export,
          minWidth: 150
        }
      ],
      components: {
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
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
      getTravelRequests, travelRequests, getCurrencyTypes, getDataAssociatedWithCurrencyTypes
    } = this.props;
    const data = {
      period: 'month',
      startDate: null,
      endDate: null
    };
    getTravelRequests(data);
    /* getCurrencyTypes();
    getDataAssociatedWithCurrencyTypes(); */
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
  }


  componentWillUnmount() {
    this.setState({
      anchorEl: null,
      openMenu: false,
      openDialog: false,
      dataDialog: null
    });
  }

  changeFileAttributeValue(evt) {
    this.setState({
      localCurrencyType: evt.target.value
    });
  }

  updateEuroTotalAmount() {
    const { currencies } = this.state;
    let total = 0;
    this.state.filesToUpload.forEach(file => {
      const index = currencies.findIndex(obj => obj.currencyId === file.localCurrencyTypeId);
      if (index > -1) {
        total += (file.localCurrencyAmount * currencies[index].changeFactor);
      }
    });
    this.setState({
      euroTotalAmount: this.toCommas(total.toFixed(2))
    });
  }


  handleApprove(evt) {
    const { approveTravelRequest, getTravelRequests, data } = this.props;
    const { rowData, status, period, startDate, endDate } = this.state;
    const params = new FormData();
    params.append('travelRequestId', rowData.id);
    params.append('status', status);
    this.state.filesToUpload.forEach(el => {
      params.append('files', el.file);
      params.append('localCurrencyTypes', el.localCurrencyTypeId);
      params.append('localCurrencyAmounts', String(el.localCurrencyAmount));
    });
    // Affiche les valeurs
   /* for (var value of params.values()) {
      console.log(value);
    }
    return;*/
    this.handleCancel();
    new Promise((resolve) => {
      approveTravelRequest(params);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
      const notificationValue = Object.keys(result).length === 0 ? 'travelrequest.approved' : result;
      if (Object.keys(result).length === 0 || isString(result)) {
        const values = {
          period: period,
          startDate: startDate,
          endDate: endDate
        };
        getTravelRequests(values);
        notification('success', notificationValue);
      } else {
        notification('danger', notificationValue);
      }
    });
  }

  handleCancel(e) {
    this.setState({
      filesToUpload: [],
      status: '',
      euroTotalAmount: (0).toFixed(2)
    });
    self.setState({
      showDrawer: false,
      rowData: ''
    });
  }

  handleAddFiles(files) {
    const list = this.state.filesToUpload;
    files.forEach(f => {
      if (f.type === 'application/pdf') {
        const index = list.findIndex(obj => obj.name === f.name && obj.type === f.type);
        if (index === -1) {
          list.push({
            name: f.name,
            localCurrencyTypeId: '',
            localCurrencyAmount: (0).toFixed(2),
            type: f.type,
            file: f
          });
        }
      }
    });
    this.setState({
      filesToUpload: list
    });
  }

  validFilesData() {
    let errorCount = 0;
    this.state.filesToUpload.forEach(file => {
      if ((file.localCurrencyTypeId === '' || file.localCurrencyTypeId === 'none') || (file.localCurrencyAmount === '' || file.localCurrencyAmount <= 0)) {
        errorCount++;
      }
    });
    return errorCount === 0;
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
    const data = {
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

  closeDrawer(e) {
    self.setState({
      showDrawer: false,
      rowData: ''
    });
  }


  handleExportCSV(event) {
    const { exportTravelRequests } = this.props;
    new Promise((resolve) => {
      const params = {
        fileType: 'excel',
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
    new Promise((resolve) => {
      const params = {
        fileType: 'pdf',
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

  calculateEuroTotalAmount(rowData) {
    let totalEuroAmount = 0;
    rowData.documents.forEach(doc => {
      totalEuroAmount += doc.euroAmount;
    });
    return totalEuroAmount;
  }

  toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  //-------------------------------------------------------------------------------------------------------

  render() {
    const {
      intl, location, isLoading, errors, travelRequestResponse, travelRequests, getTravelRequests, changeStatusTravelRequest, logedUser,
      currencyTypes, currencyData, approveTravelRequest
    } = this.props;
    const { columns, showDrawer, currencies, filesToUpload, columnsZ } = this.state;

    const thelogedUser = JSON.parse(logedUser);
    (!isLoading && travelRequestResponse) && this.editingPromiseResolve(travelRequestResponse);
    (!isLoading && !travelRequestResponse) && this.editingPromiseResolve(errors);
    const files = [];
    filesToUpload.forEach(file => {
      files.push(file);
    });
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
        <MaterialTable
          title=""
          columns={columns}
          data={travelRequests && travelRequests}
          actions={
            [
              rowData => ({
                disabled: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_modify && rowData.requestStatusMasterValue !== 'REQUESTED' && rowData.requestStatusMasterValue !== 'PENDING APPROVAL',
                icon: () => <CloseIcon variant="outlined" name="cancel" />,
                tooltip: 'Reject', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                onClick: (e) => {
                  this.setState({
                    confirmation: {
                      openConfirm: true,
                      titleConfirm: 'Confirmation dialog',
                      textConfirm: 'Are you sure you want to REJECT this travel request ?'
                    },
                    rowData,
                    status: 'REJECTED'
                  });
                }
              }),
              rowData => ({
                disabled: thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_modify && rowData.requestStatusMasterValue !== 'REQUESTED' && rowData.requestStatusMasterValue !== 'PENDING APPROVAL',
                icon: () => <DoneIcon variant="outlined" name="approve" />,
                tooltip: 'Approve', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                onClick: (e) => {
                  // Show lateral panel to load all documents associated with selected travel request
                  this.setState({
                    status: 'APPROVED',
                    rowData,
                    showDrawer: true
                  });
                }
              }),
              {
                icon: 'save_alt',
                tooltip: 'Export',
                disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export || (!this.state.searchComplete || (this.state.period === 'another' && !this.state.startDate && !this.state.endDate) || travelRequests.length === 0),
                isFreeAction: true,
                onClick: (event) => this.handleOpenMenu(event)
              }
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
                {rowData.documents.length > 0
                  ? (
                    <Grid item xs={12} md={12}>
                      <Typography component="span" variant="subtitle2" gutterBottom>
                        Attached documents
                      </Typography>
                      <Box margin={1}>
                        <Table size="small" aria-label="attached-documents">
                          <TableHead>
                            <TableRow>
                              <TableCell>No.</TableCell>
                              <TableCell>File Name</TableCell>
                              <TableCell>Upload Date</TableCell>
                              <TableCell>Local Currency Name</TableCell>
                              <TableCell>Local Currency Amount</TableCell>
                              <TableCell>Euro Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rowData.documents.map((doc, docIndex) => (
                              <TableRow key={docIndex}>
                                <TableCell style={{ minWidth: 65, width: 65, maxWidth: 65 }}>{doc.order}</TableCell>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell style={{ minWidth: 200, width: 200, maxWidth: 200 }}>
                                  {
                                    new Date(doc.uploadDate).toLocaleString('es-ES', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      hour12: true,
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                </TableCell>
                                <TableCell style={{ minWidth: 150, width: 150, maxWidth: 150 }}>{doc.localCurrencyTypeName}</TableCell>
                                <TableCell style={{ minWidth: 150, width: 150, maxWidth: 150 }}>{this.toCommas(parseFloat(doc.localCurrencyAmount).toFixed(2))}</TableCell>
                                <TableCell style={{ minWidth: 150, width: 150, maxWidth: 150 }}>{this.toCommas(parseFloat(doc.euroAmount).toFixed(2))}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow>
                              <TableCell colSpan={4} />
                              <TableCell variant="head" style={{ fontSize: 14 }}>Total</TableCell>
                              <TableCell variant="head" style={{ fontSize: 14 }}>{this.toCommas(this.calculateEuroTotalAmount(rowData).toFixed(2))}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Box>
                    </Grid>
                  ) : null}
              </CardContent>
            </Card>
          )}
        />
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export ? (
                  <MenuItem key="csv" onClick={(event) => this.handleExportCSV(event)} value="csv">
                Export as CSV
                  </MenuItem>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_travelManagement_export ? (
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
            status: this.state.status
          }}
          data={{
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
        <Drawer anchor="right" open={showDrawer}>
          {/*       <TravelRequestDocumentPanel
            currencyTypes={currencyTypes}
            allCurrencyData={currencies}
               approveTravelRequest={approveTravelRequest}
            getTravelRequests={getTravelRequests}
              isLoading={isLoading}
               errors={errors}
                   travelRequestResponse={travelRequestResponse}
            data={{
              rowData: this.state.rowData,
              status: this.state.status,
              period: this.state.period,
              startDate: this.state.startDate,
              endDate: this.state.endDate
            }}
            closeDrawer={this.closeDrawer}
          /> */}
          <Card style={{ width: 600, maxWidth: 600 }}>
            <CardContent>
              <Grid item>
                <Dropzone
                  onFilesAdded={(files) => this.handleAddFiles(files)}
                />
              </Grid>
              <Grid item style={{ marginTop: '10px' }}>
           {/*     <HelmetCustom location={location} />*/}
                <MaterialTable
                  style={{ height: 405, maxHeight: 405, overflow: 'auto' }}
                  title="Files to attach to the travel request"
                  columns={columnsZ}
                  data={files}
                  options={{
                    search: false,
                    paging: false,
                    headerStyle: { position: 'sticky', top: 0 },
                    maxBodyHeight: 305,
                    actionsColumnIndex: -1,
                    actionsCellStyle: {
                      paddingLeft: 20,
                      minWidth: 120,
                      width: 120,
                      maxWidth: 120
                    }
                  }}
                  components={{
                    Toolbar: props => (
                      <div style={{
                        color: green[500],
                        alignItems: 'center',
                        height: 45
                      }}
                      >
                        <MTableToolbar {...props} />
                      </div>
                    )
                  }}
                  editable={{
                    onRowUpdateCancelled: rowData => {
                      this.setState({
                        localCurrencyType: ''
                      });
                    },
                    onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const updateData = newData;
                        const index = oldData.tableData.id;
                        updateData.localCurrencyTypeId = this.state.localCurrencyType ? this.state.localCurrencyType : oldData.localCurrencyTypeId;
                        updateData.file = oldData.file;
                        const updatedFiles = this.state.filesToUpload;
                        updatedFiles[index] = updateData;
                        this.setState({
                          filesToUpload: updatedFiles,
                          localCurrencyType: ''
                        });
                        this.updateEuroTotalAmount();
                        resolve();
                      }, 1000);
                    }),
                    onRowDelete: (oldData) => new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const newFiles = this.state.filesToUpload;
                        newFiles.splice(oldData.tableData.id, 1);
                        this.setState({
                          filesToUpload: newFiles,
                          localCurrencyType: ''
                        });
                        this.updateEuroTotalAmount();
                        resolve();
                      }, 1000);
                    })
                  }}
                />
              </Grid>
            </CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <CardActions style={{ marginLeft: '7px' }}>
                  <Button variant="contained" size="small" onClick={(e) => this.handleCancel(e)} color="default">
                    Cancel
                  </Button>
                  <Button variant="contained" size="small" disabled={this.state.filesToUpload.length === 0 || !this.validFilesData()} onClick={(e) => this.handleApprove(e)} color="primary">
                    Approve
                  </Button>
                </CardActions>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" align="right" gutterBottom style={{ color: green[500], marginTop: '5px', marginRight: '15px' }}>
                  {`€ ${this.state.euroTotalAmount}`}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Drawer>
      </div>
    );
  }
}

TravelManagement.propTypes = {
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  travelRequestResponse: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  travelRequests: state.getIn(['travelRequest']).travelRequests,
  travelRequestResponse: state.getIn(['travelRequest']).travelRequestResponse,
  isLoading: state.getIn(['travelRequest']).isLoading,
  errors: state.getIn(['travelRequest']).errors,

  currencyTypes: state.getIn(['currencyType']).currencyTypes,
  currencyTypeResponse: state.getIn(['currencyType']).currencyTypeResponse,

  currencyData: state.getIn(['currency']).currencyData,
  currencyResponse: state.getIn(['currency']).currencyResponse,
  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTravelRequests,
  changeStatusTravelRequest,
  exportTravelRequests,
  approveTravelRequest,
  getCurrencyTypes,
  getDataByCurrencyType,
  getDataAssociatedWithCurrencyTypes
}, dispatch);

const TravelManagementMapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(TravelManagement));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <TravelManagementMapped changeTheme={changeTheme} classes={classes} />;
};


// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(injectIntl(TravelManagement)));
