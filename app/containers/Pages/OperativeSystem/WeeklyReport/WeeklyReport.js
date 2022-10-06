import React, { useContext } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import Edit from '@material-ui/icons/Edit';
import HistoryIcon from '@material-ui/icons/History';
import MaterialTable, { MTableToolbar } from 'material-table';
import VisibilityIcon from '@material-ui/icons/Visibility';

import {
  Grid,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Select,
  Menu,
  IconButton,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Modal,
  Typography,
  Box,
} from '@material-ui/core';

import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
// import withStyles from '@material-ui/core/styles/withStyles';

import { CsvBuilder } from 'filefy';

import jsPDF from 'jspdf';
// import 'jspdf-autotable';

import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import { makeStyles } from '@material-ui/core/styles';
import { TableBody, TableHead } from 'mui-datatables';
import { WeeklyReportDetail } from './WeeklyReportDetail';

import { ThemeContext } from '../../../App/ThemeWrapper';

import {
  saveWeeklyReport,
  getSummarizedWeeklyReport,
  getExtendedWeeklyReport
} from '../../../../redux/weeklyReport/actions';

import {
  getAllCustomerContractsByCompanyEmail,
  getAllOperationsByEmployeeAndCustomer
} from '../../../../redux/staffAssignment/actions';

import {
  getWeeklyReportConfig
} from '../../../../redux/weeklyReportConfig/actions';

import {
  getAllAssignmentTypes
} from '../../../../redux/assignmentType/actions';
import WeeklyReportService from '../../../Services/WeeklyReportService';


let self = null;

const logedUser = localStorage.getItem('logedUser');
const logedUserData = JSON.parse(logedUser);

const ITEM_HEIGHT = 40;

const today = new Date();
const minimunDate = new Date('1990-01-01');

const useStyles = makeStyles((theme) => {

});
const title = brand.name + ' - Weekly Report';
const description = brand.desc;
const style = {
  margin: 'auto',
  backgroundColor: 'white',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1000px',
  padding: '1%',
  borderRadius: '10px',
  overflow: 'scroll',

};
function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
) {
  return {
    name, calories, fat, carbs, protein
  };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];
class WeeklyReport extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    self = this;
    this.state = {
      openPopUp: false,
      extendedWeeklyReport: [],
      searchComplete: true,
      anchorEl: null,
      openMenu: false,
      period: 'month',
      startDate: null,
      endDate: null,
      updatesHistory: [],
      currentWeeklyReport: null,
      oldWeeklyReport: null,
      columns: [
        {
          title: 'Employee Id', // intl.formatMessage({ id: 'connection.id' }),
          field: 'employeeId',
          searchable: false,
          hidden: true,
          export: false
        },
        {
          title: 'Employee Name', // intl.formatMessage({ id: 'connection.id' }),
          field: 'employee',
          searchable: true,
          hidden: true, // SET TO FALSE WHEN THE USER BE A SUPERVISOR
          defaultGroupOrder: -1, // SET TO 0 WHEN THE USER BE A SUPERVISOR,
          export: true
        },
        {
          title: 'Company Email', // intl.formatMessage({ id: 'connection.id' }),
          field: 'companyEmail',
          searchable: false,
          hidden: true,
          export: false
        },
        {
          title: 'Year', // intl.formatMessage({ id: 'connection.id' }),
          field: 'year',
          searchable: false,
          hidden: true
        },
        {
          title: 'Week', // intl.formatMessage({ id: 'connection.id' }),
          field: 'week',
          searchable: false,
          hidden: true
        },
        {
          title: 'Year/Week', // intl.formatMessage({ id: 'connection.id' }),
          field: 'weekOfYear',
          searchable: true,
          defaultGroupOrder: 0, // SET TO 1 WHEN THE USER BE A SUPERVISOR,
          export: true
        },
        {
          title: 'Assigned Cost', // intl.formatMessage({ id: 'connection.name' }),
          field: 'assignedCost',
          searchable: true,
          minWidth: 180,
          width: 180,
          export: true
        },
        {
          title: 'Operation Name/ Absenses / Local Bank Holidays', // intl.formatMessage({ id: 'connection.database' }),
          field: 'concept',
          searchable: true,
          minWidth: 250,
          width: 250,
          export: true
        },
        {
          title: 'Deliverable', // intl.formatMessage({ id: 'connection.engine' }),
          field: 'deliverable',
          searchable: true,
          minWidth: 200,
          width: 200,
          export: true
        },
        {
          title: 'Assignment Type', // intl.formatMessage({ id: 'connection.server' }),
          field: 'assignmentType',
          searchable: true,
          minWidth: 135,
          width: 135,
          maxWidth: 135,
          export: true
        },
        {
          title: 'Days', // intl.formatMessage({ id: 'connection.server' }),
          field: 'days',
          searchable: true,
          minWidth: 90,
          width: 90,
          maxWidth: 90,
          export: true
        },
        {
          title: 'updatesHistory',
          field: 'updatesHistory',
          searchable: false,
          hidden: true
        },
        /* {
          title: 'Register Date',//intl.formatMessage({ id: 'connection.server' }),
          field: 'registerDate',
          searchable: true,
          minWidth: 150,
          export: true,
          render: rowData => {
            return new Date(rowData.registerDate).toLocaleString('es-ES', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
          }
        } */
      ],
      updatesColumns: [
        {
          title: 'Date',
          field: 'date',
          searchable: true,
          export: false
        },
        {
          title: 'Staff First Name',
          field: 'staff.firstName',
          searchable: true,
          export: false
        },
        {
          title: 'Staff Father Family Name',
          field: 'staff.fatherFamilyName',
          searchable: true,
          export: false
        }
      ],
      components: {
        Toolbar: props => (
          <div>
            <MTableToolbar {...props} />
            {thelogedUser.userRoles[0].actionsNames.operativeModule_workParts_create ? (
              <Tooltip title="Add weekly report">
                <span>
                  <Fab size="small" color="primary" aria-label="add" style={{ marginBottom: '15px', marginLeft: '20px' }}>
                    <AddIcon onClick={evt => this.handleWeeklyReport(evt, null)} />
                  </Fab>
                </span>
              </Tooltip>
            ) : null}
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
      openChangesDialog: false,
      openDialog: false,
      dataDialog: null
    };

    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleOpenChangesDialog = this.handleOpenChangesDialog.bind(this);
    this.handleCloseChangesDialog = this.handleCloseChangesDialog.bind(this);
  }


  validRow = (rowData) => {
    const { weeklyReportConfig } = this.props;

    const objDate = new Date(rowData.registerDate);
    objDate.setDate(objDate.getDate() + weeklyReportConfig.numberOfDays);
    objDate.setHours(0, 0, 0, 0);
    const actualDate = new Date();
    actualDate.setHours(0, 0, 0, 0);

    // const valid = (objDate >= actualDate && companyEmail === rowData.companyEmail) || weeklyReportConfig.employees.includes(companyEmail);
    return true;
  }


  componentDidMount() {
    const { changeTheme } = this.props;
    changeTheme('greenTheme');

    const {
      getSummarizedWeeklyReport, getWeeklyReportConfig, getAllAssignmentTypes, getAllCustomerContractsByCompanyEmail
    } = this.props;

    const companyEmail = logedUserData.userEmail;

    const data = {
      companyEmail,
      period: 'month',
      startDate: null,
      endDate: null
    };
    getSummarizedWeeklyReport(data);
    getWeeklyReportConfig();
    getAllAssignmentTypes();
    getAllCustomerContractsByCompanyEmail(companyEmail);
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
    const { getSummarizedWeeklyReport } = this.props;
    const data = {
      //   employeeId,
      period: this.state.period,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      companyEmail: logedUserData.userEmail
    };
    getSummarizedWeeklyReport(data);
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

  handleWeeklyReport = (e, rowData) => {
    const { getExtendedWeeklyReport, getAllCustomerContractsByCompanyEmail } = this.props;
    const currentDate = new Date();

    const params = {
      companyEmail: rowData ? rowData.companyEmail : logedUserData.userEmail,
      year: rowData ? rowData.year : currentDate.getFullYear(),
      week: rowData ? rowData.week : this.getWeekOfYear(currentDate)
    };
    getAllCustomerContractsByCompanyEmail(params.companyEmail);
    if (rowData != null) {
      WeeklyReportService.getExtendedWeeklyReport(params).then((res) => {
        this.setState({
          extendedWeeklyReport: res.data.payload,
          openDialog: true,
          dataDialog: params
        });
      });
    } else {
      this.setState({
        extendedWeeklyReport: [],
        openDialog: true,
        dataDialog: params
      });
    }
  }


  handleClose(afterSaveAction) {
    self.setState({
      openDialog: false,
      dataDialog: null,
      period: afterSaveAction ? 'month' : self.state.period
    });
  }

  handleSave(evt) {

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
    const { summarizedWeeklyReport } = this.props;

    self.setState({
      anchorEl: null,
      openMenu: false
    });

    const finalColumns = self.state.columns.filter(col => col.field && (!col.hidden || (col.field === 'year' || col.field === 'week')) && col.export);

    summarizedWeeklyReport.sort((a, b) => ((a.year > b.year) ? 1 : (a.year === b.year) ? ((a.week > b.week) ? 1 : -1) : -1));

    const finalData = summarizedWeeklyReport.map(rowData => finalColumns.map(col => (col.field !== 'registerDate' ? rowData[col.field] : new Date(rowData[col.field]).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }))));

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = this.getMonthInLetter(today.getMonth());
    let period = '';
    switch (this.state.period) {
      case 'month': {
        period = currentMonth + ', ' + currentYear;
        break;
      }
      case 'year': {
        period = currentYear;
        break;
      }
      default: {
        if (this.state.startDate == null || this.state.endDate == null) {
          if (this.state.startDate != null) {
            period = `from ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.startDate)}`;
          } else {
            period = `until ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.endDate)}`;
          }
        } else {
          period = `${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.startDate)} to ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.endDate)}`;
        }
        break;
      }
    }
    const builder = new CsvBuilder('Weekly report history - (' + period + ').csv');
    builder
      .setDelimeter(',')
      .setColumns(finalColumns.map(column => column.title))
      .addRows(finalData)
      .exportFile();
  }

  handleExportPDF(event) {
    const { summarizedWeeklyReport } = this.props;

    self.setState({
      anchorEl: null,
      openMenu: false
    });

    const filterColumns = self.state.columns.filter(col => col.field && (!col.hidden || (col.field === 'year' || col.field === 'week')) && col.export);

    const finalColumns = filterColumns.map(col => col.title);

    summarizedWeeklyReport.sort((a, b) => ((a.year > b.year) ? 1 : (a.year === b.year) ? ((a.week > b.week) ? 1 : -1) : -1));

    const finalData = summarizedWeeklyReport.map(rowData => filterColumns.map(col => (col.field !== 'registerDate' ? rowData[col.field] : new Date(rowData[col.field]).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }))));

    const pdf = new jsPDF('portrait', 'pt', 'A4');
    pdf.setDrawColor('#82E0AA');
    pdf.setFillColor(255, 0, 0);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.text('Weekly report history', 250, 25);
    pdf.setFontSize(10);
    pdf.text(fullName, 40, 50);
    pdf.autoTable({
      theme: 'striped',
      headStyles: {
        fillColor: '#82E0AA',
        textColor: '#000000'
      },
      startY: 55,
      head: [finalColumns],
      body: finalData,
    });

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = this.getMonthInLetter(today.getMonth());
    let period = '';
    switch (this.state.period) {
      case 'month': {
        period = currentMonth + ', ' + currentYear;
        break;
      }
      case 'year': {
        period = currentYear;
        break;
      }
      default: {
        if (this.state.startDate == null || this.state.endDate == null) {
          if (this.state.startDate != null) {
            period = `from ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.startDate)}`;
          } else {
            period = `until ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.endDate)}`;
          }
        } else {
          period = `${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.startDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.startDate)} to ${new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { month: 'short' }).format(this.state.endDate)}-${new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.state.endDate)}`;
        }
        break;
      }
    }
    pdf.save('Weekly report history - (' + period + ').pdf');
  }

  handleHistory(evt, rowData) {
    const params = {
      companyEmail: rowData ? rowData.companyEmail : logedUserData.userEmail,
      year: rowData ? rowData.year : currentDate.getFullYear(),
      week: rowData ? rowData.week : this.getWeekOfYear(currentDate)
    };
    if (rowData != null) {
      WeeklyReportService.getExtendedWeeklyReport(params).then((res) => {
        this.setState({
          openPopUp: true,
          updatesHistory: rowData.updatesHistory,
          currentWeeklyReport: res.data.payload
        });
      });
    }
  }

  handleCloseDialog() {
    this.setState({
      openPopUp: false
    });
  }

  handleOpenChangesDialog(rowData) {
    console.log(rowData.oldWeeklyReport);
    this.setState({
      openChangesDialog: true,
      oldWeeklyReport: rowData.oldWeeklyReport
    });
  }

  handleCloseChangesDialog() {
    this.setState({
      openChangesDialog: false
    });
  }
  //-------------------------------------------------------------------------------------------------------

  render() {
    const {
      location, intl, isLoading, errors, summarizedWeeklyReport, customerContracts, extendedWeeklyReport, assignmentTypes, saveWeeklyReport, getSummarizedWeeklyReport, getExtendedWeeklyReport, getAllCustomerContractsByEmployee, weeklyReportResponse, logedUser
    } = this.props;
    const { columns } = this.state;
    const thelogedUser = JSON.parse(logedUser);
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
              data={summarizedWeeklyReport && summarizedWeeklyReport}
              actions={
                [
                  rowData => ({
                    disabled: thelogedUser.userRoles[0].actionsNames.operativeModule_workParts_modify && (!rowData.editable || !this.validRow(rowData)),
                    icon: () => <Edit variant="outlined" color="action" name="edit" />,
                    tooltip: 'Edit', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                    onClick: evt => this.handleWeeklyReport(evt, rowData)
                  }),
                  rowData => ({
                    hidden: thelogedUser.userRoles[0].actionsNames.operativeModule_workParts_modify && (!rowData.editable || !this.validRow(rowData)),
                    icon: () => <HistoryIcon variant="outlined" color="action" name="history" />,
                    tooltip: 'Update History', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                    onClick: evt => this.handleHistory(evt, rowData)
                  }),
                  {
                    icon: 'save_alt',
                    tooltip: 'Export',
                    disabled: thelogedUser.userRoles[0].actionsNames.operativeModule_workParts_modify && (thelogedUser.userRoles[0].actionsNames.operativeModule_workParts_export && (!this.state.searchComplete || !summarizedWeeklyReport.length > 0 || (this.state.period === 'another' && !this.state.startDate && !this.state.endDate))),
                    isFreeAction: true,
                    onClick: (event) => this.handleOpenMenu(event)
                  },
                ]
              }
              // localization={localizationMaterialTable(intl)}
              components={this.state.components}
              options={{
                actionsColumnIndex: -1,
                grouping: true,
                /* actionsCellStyle: {
                  paddingLeft: 5,
                  minWidth: 50,
                  width: 50
                } */
              }}
            />
          )
          : (
            <WeeklyReportDetail
              obj={this.state.dataDialog}
              customerContracts={customerContracts}
              extendedWeeklyReport={this.state.extendedWeeklyReport}
              allAssignmentTypes={assignmentTypes}
              isLoading={isLoading}
              errors={errors}
              weeklyReportResponse={weeklyReportResponse}
              handleClose={this.handleClose}
              saveWeeklyReport={saveWeeklyReport}
              getSummarizedWeeklyReport={getSummarizedWeeklyReport}
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
                <MenuItem key="csv" onClick={(event) => this.handleExportCSV(event)} value="csv">
                  Export as CSV
                </MenuItem>
                <MenuItem key="pdf" onClick={(event) => this.handleExportPDF(event)} value="pdf">
                  Export as PDF
                </MenuItem>
              </Menu>
            </React.Fragment>
          )
          : null
        }
        <Dialog
          open={this.state.openPopUp}
          keepMounted
          onClose={this.handleCloseDialog}
          scroll="body"
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth=""
        >
          <DialogTitle id="alert-dialog-slide-title">Updates History</DialogTitle>
          <DialogContent dividers>
            <MaterialTable
              title=""
              columns={this.state.updatesColumns}
              data={this.state.updatesHistory}
              actions={
                [
                  rowData => ({
                    icon: () => <VisibilityIcon variant="outlined" name="diffrences" />,
                    tooltip: 'changes', // intl.formatMessage({ id: 'table.column.actions.edit' }),
                    onClick: evt => { this.handleOpenChangesDialog(rowData); }
                  }),

                ]
              }
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Modal
          open={this.state.openChangesDialog}
          onClose={this.handleCloseChangesDialog}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box style={style}>
            <div style={{ width: 'max-content' }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
      Changes
              </Typography>
              <table>
                <tr>
                  <th />
                  <th>
        Customer Name
                  </th>
                  <th>
        Operation Name
                  </th>
                  <th>
        Deliverable
                  </th>
                  <th>
        Assignment Type Name
                  </th>
                  <th>
          monday
                  </th>
                  <th>
        tuesday
                  </th>
                  <th>
        wednesday
                  </th>
                  <th>
       thursday
                  </th>
                  <th>
          friday
                  </th>
                </tr>
                <tr>
                  <td>
                    <strong>Before Update</strong>
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.customer.name : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.operation.name : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.deliverable : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.assignmentType.name : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.monday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.tuesday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.wednesday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.thursday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.oldWeeklyReport ? this.state.oldWeeklyReport.friday : null}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>After Update</strong>
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].customerName : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].operationName : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].deliverable : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].assignmentTypeName : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].monday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].tuesday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].wednesday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].thursday : null}
                  </td>
                  <td>
                    {' '}
                    {this.state.currentWeeklyReport ? this.state.currentWeeklyReport.works[0].friday : null}
                  </td>
                </tr>

              </table>


            </div>
          </Box>


        </Modal>
      </div>
    );
  }
}

WeeklyReport.propTypes = {
  // location: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  weeklyReportResponse: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  summarizedWeeklyReport: state.getIn(['weeklyReport']).summarizedWeeklyReport,
  extendedWeeklyReport: state.getIn(['weeklyReport']).extendedWeeklyReport,
  weeklyReportResponse: state.getIn(['weeklyReport']).weeklyReportResponse,
  isLoading: state.getIn(['weeklyReport']).isLoading,
  errors: state.getIn(['weeklyReport']).errors,

  weeklyReportConfig: state.getIn(['weeklyReportConfig']).weeklyReportConfig,
  // weeklyReportConfigResponse: state.getIn(['weeklyReportConfig']).weeklyReportConfigResponse,

  customerContracts: state.getIn(['staffAssignment']).customerContracts,
  operations: state.getIn(['staffAssignment']).operations,
  // staffAssignmentResponse: state.getIn(['staffAssignment']).staffAssignmentResponse,
  assignmentTypes: state.getIn(['assignmentType']).assignmentTypes,
  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators({
  saveWeeklyReport,
  getSummarizedWeeklyReport,
  getExtendedWeeklyReport,
  getWeeklyReportConfig,
  getAllCustomerContractsByCompanyEmail,
  getAllOperationsByEmployeeAndCustomer,
  getAllAssignmentTypes
}, dispatch);


const WeeklyReportMapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(WeeklyReport));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <WeeklyReportMapped changeTheme={changeTheme} classes={classes} />;
};

// export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(injectIntl(WeeklyReport)));
