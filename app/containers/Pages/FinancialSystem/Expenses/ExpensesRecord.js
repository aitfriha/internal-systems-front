import React, { useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CloseIcon from '@material-ui/icons/Close';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import CommuteIcon from '@material-ui/icons/Commute';
import HotelIcon from '@material-ui/icons/Hotel';
import LocalGasStationIcon from '@material-ui/icons/LocalGasStation';
import HelpIcon from '@material-ui/icons/Help';
import MaterialTable, { MTableToolbar } from 'material-table';
import {
  Grid,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Select,
  Tabs,
  Tab,
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
import withStyles from '@material-ui/core/styles/withStyles';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isString } from 'lodash';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { makeStyles } from '@material-ui/core/styles';
import localizationMaterialTable from '../../../../api/localizationMaterialUI/localizationMaterialTable';
import { Confirmation } from '../Travels/Confirmation';
// import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import notification from '../../../../components/Notification/Notification';
import { ExpenseDetail } from './ExpenseDetail';

import { getAllCountry } from '../../../../redux/country/actions';

import {
  getStaffExpensesTypes,
} from '../../../../redux/staffExpenseType/actions';

import {
  getAllPersonTypes
} from '../../../../redux/personType/actions';

import {
  getAllVoucherTypes
} from '../../../../redux/voucherType/actions';

import {
  getExpenses,
  saveExpense,
  saveExpenseWithFile,
  exportExpenses,
  changeStatusExpense,
  downloadDocumentOfExpense
} from '../../../../redux/expense/actions';

import {
  getCurrencyTypes,
} from '../../../../redux/currencyType/actions';

import {
  getDataByCurrencyType,
  getDataAssociatedWithCurrencyTypes
} from '../../../../redux/currency/actions';

import {
  getStaffByCompanyEmail
} from '../../../../redux/staff/actions';

import { ThemeContext } from '../../../App/ThemeWrapper';
import CurrencyService from "../../../Services/CurrencyService";
import {
  getAllExpenseStatus,
} from '../../../../redux/expenseStatus/actions';


let self = null;

const styles = {};

const ITEM_HEIGHT = 40;

const today = new Date();
const minimunDate = new Date('1990-01-01');


const logedUser = localStorage.getItem('logedUser');
const logedUserData = JSON.parse(logedUser);

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 2 }}>
      {props.children}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => {

});
const title = brand.name + ' - Expenses Record';
const description = brand.desc;

class ExpensesRecord extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
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
      selectedTab: 0,
      columns: [
        {
          title: 'Status', // intl.formatMessage({ id: 'connection.id' }),
          field: 'status',
          minWidth: 100,
          maxWidth: 150,
          export: true,
          render: rowData => {
            const value = rowData.expenseStatusName;
            switch (rowData.expenseStatusName) {
              case 'PAID': {
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
          title: 'Expense Date', // intl.formatMessage({ id: 'connection.id' }),
          field: 'expenseDate',
          searchable: false,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
          minWidth: 120,
          width: 120,
          maxWidth: 120,
          render: rowData => new Date(rowData.expenseDate).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          })
        },
        {
          title: 'Voucher Type',
          field: 'voucherTypeName',
          searchable: true,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
          minWidth: 120,
          width: 120,
          maxWidth: 120
        },
        {
          title: 'Local Currency Type', // intl.formatMessage({ id: 'connection.id' }),
          field: 'localCurrencyTypeName',
          searchable: true,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
          minWidth: 120
        },
        {
          title: 'Local Currency Amount', // intl.formatMessage({ id: 'connection.id' }),
          field: 'localCurrencyAmount',
          searchable: true,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
          minWidth: 150,
          width: 150,
          maxWidth: 150,
          render: rowData => this.toCommas((rowData.localCurrencyAmount).toFixed(2))
        },
        {
          title: 'Euro Amount', // intl.formatMessage({ id: 'connection.id' }),
          field: 'euroAmount',
          searchable: true,
          export: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
          minWidth: 120,
          width: 120,
          maxWidth: 120,
          render: rowData => rowData.euroAmount
        /*  render: rowData => `${this.toCommas((rowData.euroAmount).toFixed(2))}` */
        }
      ],
      components: {
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            <Grid container direction="row" spacing={2}>
              <Grid item xs={12} md={6}>
                {thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_create ? (
                  <Tooltip title="Add">
                    <span>
                      <Fab size="small" color="primary" aria-label="add" style={{ marginLeft: 20 }}>
                        <AddIcon onClick={(e) => this.handleExpense(e, null)} />
                      </Fab>
                    </span>
                  </Tooltip>
                ) : null}
              </Grid>
              <Grid item xs={12} md={6} style={{ marginTop: 5 }}>
                <Box display="flex" justifyContent="flex-end" style={{ marginRight: 20 }}>
                  <Chip label={`€ ${(this.getSubtotal('PAID')).toFixed(2)}`} color="primary" style={{ backgroundColor: '#F1C40F', marginLeft: 20 }} />
                  <Chip label={`€ ${(this.getSubtotal('ALL')).toFixed(2)}`} color="primary" style={{ backgroundColor: '#27AE60', marginLeft: 20 }} />
                </Box>
              </Grid>
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
      getStaffByCompanyEmail, getCurrencyTypes, getDataAssociatedWithCurrencyTypes, getAllCountry, getStaffExpensesTypes, getAllPersonTypes, getAllVoucherTypes, getExpenses,
      staff
    } = this.props;
    getStaffExpensesTypes();
    getAllCountry();
    getAllPersonTypes();
    getAllVoucherTypes();

    const companyEmail = logedUserData.userEmail;

    const data = {
      companyEmail,
      period: 'month',
      startDate: null,
      endDate: null
    };
    getExpenses(data);
/*
    getCurrencyTypes();
    getDataAssociatedWithCurrencyTypes();
    */
   // getDataAssociatedWithCurrencyTypes();
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    const { getAllExpenseStatus } = this.props;
    getAllExpenseStatus();

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

  getExpenseSubtypeBy(rowData) {
    console.log(rowData.expenseTypeMasterValue);
    console.log(rowData.expenseSubtypeId);
    let subtype = null;
    const { staffExpensesTypes } = this.props;
    const index = staffExpensesTypes.findIndex(obj => obj.masterValue === rowData.expenseTypeMasterValue);
    if (index > -1) {
      const subtypeIndex = staffExpensesTypes[index].subtypes.findIndex(obj => obj.id === rowData.expenseSubtypeId);
      subtype = subtypeIndex > -1 ? staffExpensesTypes[index].subtypes[subtypeIndex] : null;
    }
    console.log(subtype);
    return subtype;
  }

  getSubtotal(option) {
    const { expenses } = this.props;
    const data = this.state.selectedTab === 0 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'SUPPORT')
      : this.state.selectedTab === 1 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'TRANSPORT')
        : this.state.selectedTab === 2 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'LODGING')
          : this.state.selectedTab === 3 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'KMS')
            : expenses.filter(expense => expense.expenseTypeMasterValue === 'OTHERS');

    let subtotalPaid = 0;
    let subtotalAmount = 0;
    data.forEach(expense => {
      if (expense.expenseStatusMasterValue === 'PAID') {
        subtotalPaid += expense.euroAmount;
      } else {
        subtotalAmount += expense.euroAmount;
      }
    });
    return option === 'PAID' ? subtotalPaid : subtotalAmount;
  }


  //----------------------------------------------------------------------------------------------

  // HANDLE ACTIONS

  handleFilterData = (e) => {
    this.setState({
      searchComplete: true,
    });
    const { getExpenses, expenses } = this.props;

    const companyEmail = logedUserData.userEmail;

    const data = {
      companyEmail,
      period: this.state.period,
      startDate: this.state.startDate,
      endDate: this.state.endDate
    };
    getExpenses(data);
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

  handleSelectedTab(evt, newTab) {
    this.setState({
      selectedTab: newTab
    });
  }

  handleExpense = (e, rowData) => {
    let type = '';
    switch (this.state.selectedTab) {
      case 0: {
        type = 'SUPPORT';
        break;
      }
      case 1: {
        type = 'TRANSPORT';
        break;
      }
      case 2: {
        type = 'LODGING';
        break;
      }
      case 3: {
        type = 'KMS';
        break;
      }
      case 4: {
        type = 'OTHERS';
        break;
      }
      default: {
        break;
      }
    }
    const { staff } = this.props;
    const data = rowData || {
      staffPersonalNumber: staff.personalNumber,
      staffName: staff.firstName,
      staffFatherFamilyName: staff.fatherFamilyName,
      staffMotherFamilyName: staff.motherFamilyName,
      staffCompany: staff.companyName,
      staffId: staff.staffId,
    };
    data.type = type;
    this.setState({
      openDialog: true,
      dataDialog: data
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
    const tab = this.state.selectedTab;
    this.setState({
      openDialog: false,
      dataDialog: null,
      selectedTab: tab,
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


  toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }


  handleExportCSV(event) {
    const { exportExpenses } = this.props;

    const companyEmail = logedUserData.userEmail;
    new Promise((resolve) => {
      const params = {
        fileType: 'excel',
        companyEmail,
        period: this.state.period,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      };
      exportExpenses(params);
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
      link.setAttribute('download', 'EXPENSES.xlsx');
      document.body.appendChild(link);
      link.click();
    });
  }

  handleExportPDF(event) {
    const { exportExpenses } = this.props;
    const companyEmail = logedUserData.userEmail;
    new Promise((resolve) => {
      const params = {
        fileType: 'pdf',
        companyEmail,
        period: this.state.period,
        startDate: this.state.startDate,
        endDate: this.state.endDate
      };
      exportExpenses(params);
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
      link.setAttribute('download', 'EXPENSES.pdf');
      document.body.appendChild(link);
      link.click();
    });
  }

  handleDownloadDocument(event, rowData) {
    const { downloadDocumentOfExpense } = this.props;
    new Promise((resolve) => {
      downloadDocumentOfExpense(rowData.id);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
      const url = window.URL.createObjectURL(new Blob([result]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Expenses Record.pdf');
      document.body.appendChild(link);
      link.click();
    });
  }


  //-------------------------------------------------------------------------------------------------------

  render() {
    const {
      intl, location, isLoading, errors, countries, staffExpensesTypes, personTypes, voucherTypes, expenses, expenseResponse, getExpenses, changeStatusExpense, logedUser,
      currencyTypes, currencyData, saveExpenseWithFile, saveExpense, staff,expensesStatus
    } = this.props;

    const { columns, currencies } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    (!isLoading && expenseResponse) && this.editingPromiseResolve(expenseResponse);
    (!isLoading && !expenseResponse) && this.editingPromiseResolve(errors);

    const tabTitle = this.state.selectedTab === 0 ? 'Support expenses history'
      : this.state.selectedTab === 1 ? 'Transport expenses history'
        : this.state.selectedTab === 2 ? 'Lodging expenses history'
          : this.state.selectedTab === 3 ? 'Kms expenses history'
            : 'History of others expenses';

    const data = this.state.selectedTab === 0 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'SUPPORT')
      : this.state.selectedTab === 1 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'TRANSPORT')
        : this.state.selectedTab === 2 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'LODGING')
          : this.state.selectedTab === 3 ? expenses.filter(expense => expense.expenseTypeMasterValue === 'KMS')
            : expenses.filter(expense => expense.expenseTypeMasterValue === 'OTHERS');

    let totalPaid = 0;
    let totalAmount = 0;
    expenses.forEach(expense => {
      if (expense.expenseStatusMasterValue === 'PAID') {
        totalPaid += expense.euroAmount;
      } else {
        totalAmount += expense.euroAmount;
      }
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
        {!this.state.openDialog
          ? (
            <Card>
              <CardContent>
                <Grid container direction="row" spacing={2} style={{ marginLeft: 20, marginBottom: 25 }}>
                  <Grid item md={2}>
                    <FormControl style={{
                      minWidth: 140, width: 140, maxWidth: 140, marginTop: 16
                    }}
                    >
                      <InputLabel htmlFor="combo-priod-record">Filter by period</InputLabel>
                      <Select
                        id="combo-priod-record"
                        value={this.state.period}
                        onChange={(e) => this.handlePeriodChange(e)}
                      >
                        <MenuItem value="month">Current month</MenuItem>
                        <MenuItem value="year">Current year</MenuItem>
                        <MenuItem value="another">Another period</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {this.state.period === 'another'
                    ? (
                      <React.Fragment>
                        <Grid item md={2}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="start-date-picker-record"
                              label="Start date"
                              value={this.state.startDate}
                              onChange={(date) => this.handleDateChange(date, 'startDate')}
                              style={{ minWidth: 140, width: 140, maxWidth: 140 }}
                              autoOk
                              minDate={minimunDate}
                              maxDate={this.state.endDate ? this.state.endDate : today}
                              disableFuture
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>

                        <Grid item md={2}>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                              disableToolbar
                              variant="inline"
                              format="dd/MM/yyyy"
                              margin="normal"
                              id="date-picker-inline-record"
                              label="End date"
                              value={this.state.endDate}
                              onChange={(date) => this.handleDateChange(date, 'endDate')}
                              style={{ minWidth: 140, width: 140, maxWidth: 140 }}
                              autoOk
                              minDate={this.state.startDate ? this.state.startDate : minimunDate}
                              maxDate={today}
                              disableFuture
                            />
                          </MuiPickersUtilsProvider>
                        </Grid>
                      </React.Fragment>
                    ) : null}

                  <Grid item md={2} style={{ marginTop: 20 }}>
                    <IconButton
                      disabled={this.state.period === 'another' && !this.state.startDate && !this.state.endDate}
                      onClick={(e) => this.handleFilterData(e)}
                    >
                      <SearchIcon />
                    </IconButton>
                    {this.state.period === 'another'
                      ? (
                        <IconButton
                          disabled={this.state.period === 'another' && !this.state.startDate && !this.state.endDate}
                          onClick={(e) => this.handleClearDates(e)}
                        >
                          <ClearIcon />
                        </IconButton>
                      )
                      : null}
                  </Grid>
                </Grid>

                <Tabs
                  value={this.state.selectedTab}
                  onChange={(e, newValue) => this.handleSelectedTab(e, newValue)}
                  variant="scrollable"
                  scrollButtons="on"
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Support" icon={<FastfoodIcon />} />
                  <Tab label="Transport" icon={<CommuteIcon />} />
                  <Tab label="Lodging" icon={<HotelIcon />} />
                  <Tab label="Kms" icon={<LocalGasStationIcon />} />
                  <Tab label="Others" icon={<HelpIcon />} />
                </Tabs>
                <TabContainer>
                  <MaterialTable
                    title={tabTitle}
                    columns={columns}
                    data={data}
                    components={this.state.components}
                    actions={
                      [
                        rowData => ({
                          disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export,
                         /* disabled: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export && rowData.voucherTypeMasterValue === 'DONT EXIST',*/
                          icon: () => <CloudDownloadIcon variant="outlined" name="download" />,
                          tooltip: 'Download',
                          onClick: (e) => this.handleDownloadDocument(e, rowData)
                        }),
                        rowData => ({
                         /* disabled: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_modify && rowData.expenseStatusMasterValue !== 'PENDING APPROVAL',*/
                          disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_modify,
                          icon: () => <CloseIcon variant="outlined" name="cancel" />,
                          tooltip: 'Cancel', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                          onClick: (e) => {
                            this.setState({
                              confirmation: {
                                openConfirm: true,
                                titleConfirm: 'Confirmation dialog',
                                textConfirm: 'Are you sure you want to CANCEL this expense ?'
                              },
                              rowData,
                              status: 'CANCELED'
                            });
                          }
                        }),
                        rowData => ({
                          disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_modify,
                         /* disabled: thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_modify && rowData.expenseStatusMasterValue !== 'PENDING APPROVAL',*/
                          icon: () => <EditIcon variant="outlined" name="edit" />,
                          tooltip: 'Edit', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                          onClick: (e) => this.handleExpense(e, rowData)
                        }),
                        {
                          icon: 'save_alt',
                          tooltip: 'Export',
                          disabled: !thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_export && !this.state.searchComplete && (this.state.period === 'another' && !this.state.startDate && !this.state.endDate) || data.length === 0,
                          isFreeAction: true,
                          onClick: (event) => this.handleOpenMenu(event)
                        },
                      ]
                    }
                    options={{
                      actionsColumnIndex: -1
                    }}
                    detailPanel={rowData => (
                      <Card className="info-content">
                        <CardContent>
                          <Grid container direction="row" style={{ marginBottom: 5 }}>
                            <Grid item xs={12} md={4}>
                              <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                Register Date:
                              </Typography>
                              <Typography component="span" color="textSecondary">
                                {new Date(rowData.registerDate).toLocaleString('es-ES', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour12: true,
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Typography>
                            </Grid>
                            {rowData.expenseTypeAllowSubtypes
                              ? (
                                <Grid item xs={12} md={4}>
                                  <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                    Expense Subtype:
                                  </Typography>
                                  <Typography component="span" color="textSecondary">
                                    {this.getExpenseSubtypeBy(rowData) ? this.getExpenseSubtypeBy(rowData).name : ''}
                                  </Typography>
                                </Grid>
                              ) : null
                            }
                            {rowData.expenseStatusMasterValue === 'PAID'
                              ? (
                                <Grid item xs={12} md={4}>
                                  <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                    Payment Date:
                                  </Typography>
                                  <Typography component="span" color="textSecondary">
                                    {rowData.paymentDate ? rowData.paymentDate : ''}
                                  </Typography>
                                </Grid>
                              )
                              : null}
                          </Grid>
                          {(rowData.expenseTypeMasterValue === 'SUPPORT' || rowData.expenseTypeMasterValue === 'LODGING' || rowData.expenseTypeMasterValue === 'OTHERS')
                            ? (
                              <React.Fragment>
                                <Grid container direction="row">
                                  <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                    <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                      Expense City:
                                    </Typography>
                                    <Typography component="span" color="textSecondary">
                                      {rowData.expenseCityName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                    <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                      Expense State:
                                    </Typography>
                                    <Typography component="span" color="textSecondary">
                                      {rowData.expenseStateName}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                    <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                      Expense Country:
                                    </Typography>
                                    <Typography component="span" color="textSecondary">
                                      {rowData.expenseCountryName}
                                    </Typography>
                                  </Grid>
                                </Grid>
                                {rowData.expenseTypeMasterValue === 'LODGING'
                                  ? (
                                    <React.Fragment>
                                      <Grid container direction="row">
                                        <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                          <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                            Arrival Date:
                                          </Typography>
                                          <Typography component="span" color="textSecondary">
                                            {new Date(rowData.arrivalDate).toLocaleString('es-ES', {
                                              year: 'numeric',
                                              month: '2-digit',
                                              day: '2-digit',
                                              hour12: true,
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                          <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                            Departure Date:
                                          </Typography>
                                          <Typography component="span" color="textSecondary">
                                            {new Date(rowData.departureDate).toLocaleString('es-ES', {
                                              year: 'numeric',
                                              month: '2-digit',
                                              day: '2-digit',
                                              hour12: true,
                                              hour: '2-digit',
                                              minute: '2-digit'
                                            })}
                                          </Typography>
                                        </Grid>
                                      </Grid>
                                    </React.Fragment>
                                  )
                                  : rowData.expenseTypeMasterValue === 'OTHERS'
                                    ? (
                                      <React.Fragment>
                                        <Grid item xs={12} md={12} style={{ marginBottom: 5 }}>
                                          <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                            Description:
                                          </Typography>
                                          <Typography component="span" color="textSecondary">
                                            {rowData.description}
                                          </Typography>
                                        </Grid>
                                      </React.Fragment>
                                    )
                                    : null
                                }
                              </React.Fragment>
                            )
                            : ((rowData.expenseTypeMasterValue === 'TRANSPORT' || rowData.expenseTypeMasterValue === 'KMS') && rowData.persons.length > 0)
                              ? (
                                <React.Fragment>
                                  <Grid container direction="row">
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        From City:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.fromCityName}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        From State:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.fromStateName}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        From Country:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.fromCountryName}
                                      </Typography>
                                    </Grid>
                                  </Grid>

                                  <Grid container direction="row">
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        To City:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.toCityName}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        To State:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.toStateName}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={4} style={{ marginBottom: 5 }}>
                                      <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                        To Country:
                                      </Typography>
                                      <Typography component="span" color="textSecondary">
                                        {rowData.toCountryName}
                                      </Typography>
                                    </Grid>
                                  </Grid>

                                  {rowData.expenseTypeMasterValue === 'KMS'
                                    ? (
                                      <Grid item xs={12} md={12} style={{ marginBottom: 5 }}>
                                        <Typography component="span" variant="subtitle2" gutterBottom style={{ marginRight: '5px' }}>
                                          Kms:
                                        </Typography>
                                        <Typography component="span" color="textSecondary">
                                          {rowData.kms}
                                        </Typography>
                                      </Grid>
                                    )
                                    : null}
                                </React.Fragment>
                              )
                              : null
                          }
                          {rowData.expenseTypeMasterValue === 'SUPPORT' || rowData.expenseTypeMasterValue === 'TRANSPORT' || rowData.expenseTypeMasterValue === 'KMS'
                            ? (
                              <Grid item xs={12} md={12} style={{ marginTop: 10 }}>
                                <Typography component="span" variant="subtitle2" gutterBottom>
                                  {rowData.expenseTypeMasterValue === 'SUPPORT' ? 'Associated people' : 'Persons to visit'}
                                </Typography>
                                <Box margin={1}>
                                  <Table size="small" aria-label="persons-table">
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Person Type</TableCell>
                                        <TableCell>Company Name</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Father Family Name</TableCell>
                                        <TableCell>Mother Family Name</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {rowData.persons.map((person, index) => (
                                        <TableRow key={index}>
                                          <TableCell style={{ minWidth: 150, width: 150, maxWidth: 150 }}>{person.personTypeName}</TableCell>
                                          <TableCell>{person.companyName}</TableCell>
                                          <TableCell>{person.name}</TableCell>
                                          <TableCell>{person.fatherFamilyName}</TableCell>
                                          <TableCell>{person.motherFamilyName}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Grid>
                            )
                            : null}
                        </CardContent>
                      </Card>
                    )}
                  />
                </TabContainer>
                <Grid container direction="row" spacing={2}>
                  <Grid item xs={6} md={6}>
                    <Typography variant="h5" align="left" gutterBottom style={{ color: '#F1C40F', marginLeft: 15 }}>
                      {`€ ${this.toCommas((totalPaid).toFixed(2))}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <Typography variant="h5" align="right" gutterBottom style={{ color: '#27AE60', marginRight: 15 }}>
                      {`€ ${this.toCommas((totalAmount).toFixed(2))}`}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )
          : (
            <ExpenseDetail
              obj={this.state.dataDialog}
              handleClose={this.handleClose}
              isLoading={isLoading}
              errors={errors}
              expenseResponse={expenseResponse}
              staffExpensesTypes={staffExpensesTypes}
              countries={countries}
              personTypes={personTypes}
              voucherTypes={voucherTypes}
              expensesStatus={expensesStatus}
              allCurrencyData={currencies}
              saveExpense={saveExpense}
              saveExpenseWithFile={saveExpenseWithFile}
              getExpenses={getExpenses}
            />
          )}
        {this.state.openMenu
          ? (
            <React.Fragment>
              <Menu
                id="expense-record-export-menu"
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_create ? (
                  <MenuItem key="csv" onClick={(event) => this.handleExportCSV(event)} value="csv">
                  Export as CSV
                  </MenuItem>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_expenseRecord_create ? (
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
            case: 'EXPENSE'
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
          expenseResponse={expenseResponse}
          changeStatusExpense={changeStatusExpense}
          getExpenses={getExpenses}
        />
      </div>
    );
  }
}

ExpensesRecord.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  expenseResponse: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  countries: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,

  personTypes: state.getIn(['personType']).personTypes,
  personTypeResponse: state.getIn(['personType']).personTypeResponse,

  voucherTypes: state.getIn(['voucherType']).voucherTypes,
  voucherTypeResponse: state.getIn(['voucherType']).voucherTypeResponse,

  staffExpensesTypes: state.getIn(['staffExpenseType']).staffExpensesTypes,
  staffExpenseTypeResponse: state.getIn(['staffExpenseType']).staffExpenseTypeResponse,

  currencyTypes: state.getIn(['currencyType']).currencyTypes,
  currencyTypeResponse: state.getIn(['currencyType']).currencyTypeResponse,

  currencyData: state.getIn(['currency']).currencyData,
  currencyResponse: state.getIn(['currency']).currencyResponse,

  expenses: state.getIn(['expense']).expenses,
  expenseResponse: state.getIn(['expense']).expenseResponse,
  isLoading: state.getIn(['expense']).isLoading,
  errors: state.getIn(['expense']).errors,

  staff: state.getIn(['staffs']).staff,
  staffResponse: state.getIn(['staffs']).staffResponse,
  expensesStatus: state.getIn(['expenseStatus']).expensesStatus,
  expenseStatusResponse: state.getIn(['expenseStatus']).expenseStatusResponse,
  isLoadingExpenseStatus: state.getIn(['expenseStatus']).isLoading,
  errorsExpenseStatus: state.getIn(['expenseStatus']).errors,


  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getAllCountry,
  getStaffExpensesTypes,
  getAllPersonTypes,
  getAllVoucherTypes,
  getExpenses,
  changeStatusExpense,
  saveExpense,
  saveExpenseWithFile,
  exportExpenses,
  downloadDocumentOfExpense,
  getCurrencyTypes,
  getDataByCurrencyType,
  getDataAssociatedWithCurrencyTypes,
  getStaffByCompanyEmail,
  getAllExpenseStatus,
}, dispatch);

const ExpensesRecordMapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(ExpensesRecord));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <ExpensesRecordMapped changeTheme={changeTheme} classes={classes} />;
};

// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(injectIntl(ExpensesRecord)));
