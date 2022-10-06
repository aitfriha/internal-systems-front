import React, { useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  withStyles,
  makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { PapperBlock } from 'dan-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { isString } from 'lodash';
import AutoComplete from '../../../components/AutoComplete';
import styles from './localBankHoliday-jss';
import { ThemeContext } from '../../App/ThemeWrapper';
import history from '../../../utils/history';
import '../Configurations/map/app.css';
import FinancialCompanyService from '../../Services/FinancialCompanyService';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  getAllLocalBankHoliday,
  getAllLocalBankHolidayByCompany,
  saveLocalBankHoliday
} from '../../../redux/localBankHoliday/actions';
import notification from '../../../components/Notification/Notification';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';

const useStyles = makeStyles(styles);

class AddLocalBankHoliday extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {};
    this.state = {
      name: '',
      code: '',
      type: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      minEndDate: new Date(),
      company: [],
      companies: [],
      isStartDateError: true,
      isEndDateError: true
    };
  }

  componentDidMount() {
    const { changeTheme } = this.props;
    changeTheme('blueCyanTheme');
    FinancialCompanyService.getCompany().then(({ data }) => {
      this.setState({ companies: data });
    });
  }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleChangeCompany = (ev, value) => {
    const { getAllLocalBankHolidayByCompany } = this.props;
    this.setState({
      company: value
    });
    getAllLocalBankHolidayByCompany(value.financialCompanyId);
  };

  handleSubmitLocalBankHoliday = () => {
    const { saveLocalBankHoliday, getAllLocalBankHoliday } = this.props;
    const {
      name,
      code,
      type,
      description,
      startDate,
      endDate,
      company
    } = this.state;
    const localBankHoliday = {
      name,
      code: Math.floor(Math.random() * 10088888859847),
      type,
      description,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      totalDays: this.calculDays(),
      financialCompanyIds: company.map( s => s.financialCompanyId)
    };

    const promise = new Promise(resolve => {
      saveLocalBankHoliday(localBankHoliday);
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllLocalBankHoliday();
        history.push('/app/hh-rr/LocalBankHoliday');
      } else {
        notification('danger', result);
      }
    });
  };

  handleValueChange = (value, type) => {
    this.setState({ [type]: value });
  };

  handleDateValue = (value, name) => {
    const { startDate, endDate } = this.state;
    if (name === 'startDate') {
      this.setState({
        minEndDate: value,
        [name]: value
      });
      if (new Date(value) > new Date(endDate)) {
        this.setState({
          isStartDateError: false,
          isEndDateError: false
        });
      }
      else {
        this.setState({
          isStartDateError: true,
          isEndDateError: true
        });
      }

    } else {
      this.setState({
        [name]: value
      });
      if (new Date(startDate) > new Date(value)) {
        this.setState({
          isStartDateError: false,
          isEndDateError: false
        });
      }
      else {
        this.setState({
          isStartDateError: true,
          isEndDateError: true
        });
      }
    }
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

  render() {
    const {
      classes,
      isLoadingLocalBankHoliday,
      localBankHolidayResponse,
      errorLocalBankHoliday,
      allLocalBankHolidayByCompany,
      allLocalBankHoliday
    } = this.props;
    const {
      name,
      code,
      type,
      description,
      startDate,
      endDate,
      minEndDate,
      company,
      companies,
      isStartDateError,
      isEndDateError
    } = this.state;
    !isLoadingLocalBankHoliday
      && localBankHolidayResponse
      && this.editingPromiseResolve(localBankHolidayResponse);
    !isLoadingLocalBankHoliday
      && !localBankHolidayResponse
      && this.editingPromiseResolve(errorLocalBankHoliday);

    const holidayTypes = ['Country', 'Local'];
    return (
      <div>
        <PapperBlock
          title="Add local bank holiday"
          icon="ios-paper-outline"
          noMargin
          whiteBg
        >
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
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 6
              }}
            >
              <Autocomplete
                id="combo-box-demo"
                multiple
                value={company}
                options={companies}
                getOptionLabel={option => option.name}
                onChange={this.handleChangeCompany}
                style={{ width: '40%', marginTop: 7 }}
                clearOnEscape
                renderInput={params => (
                  <TextField
                    fullWidth
                    required
                    {...params}
                    label="Company"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: 6
              }}
            >
              <div style={{ width: '30%' }}>
                <AutoComplete
                  value={this.handleValueChange}
                  placeholder="Name*"
                  data={allLocalBankHolidayByCompany}
                  required
                  type="name"
                  attribute="name"
                />
              </div>
{/*              <div style={{ width: '30%' }}>
                <AutoComplete
                  value={this.handleValueChange}
                  placeholder="Code"
                  data={allLocalBankHolidayByCompany}
                  lenghtCode="10"
                  type="code"
                  attribute="code"
                />
              </div>*/}
              <FormControl
                className={classes.formControl}
                style={{ width: '30%', marginTop: 1 }}
                required
              >
                <InputLabel>Type of holiday</InputLabel>

                <Select name="type" value={type} onChange={this.handleChange}>
                  {holidayTypes.map(item => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: 6
              }}
            >
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description"
                value={description}
                fullWidth
                multiline
                className={classes.textField}
                onChange={this.handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: 6
              }}
            >
              <div style={{ width: '40%', marginTop: 1 }}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker 
                    autoOk
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    name="startDate"
                    label="Start Date"
                    value={startDate}
                    onChange={value => this.handleDateValue(value, 'startDate')}
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
                    autoOk
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    name="endDate"
                    label="End Date"
                    value={endDate}
                    minDate={minEndDate}
                    onChange={value => this.handleDateValue(value, 'endDate')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date'
                    }}
                    fullWidth
                  />
                </MuiPickersUtilsProvider>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={8}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 12
              }}
            >
              <Button
                color="primary"
                variant="contained"
                size="medium"
                onClick={this.handleSubmitLocalBankHoliday}
                disabled={
                 /* !code
                  ||*/ !name
                  || !company
                  || !isStartDateError
                  || !isEndDateError
                }
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </PapperBlock>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allLocalBankHoliday: state.getIn(['localBankHolidays']).allLocalBankHoliday,
  allLocalBankHolidayByCompany: state.getIn(['localBankHolidays'])
    .allLocalBankHolidayByCompany,
  localBankHolidayResponse: state.getIn(['localBankHolidays'])
    .localBankHolidayResponse,
  isLoadingLocalBankHoliday: state.getIn(['localBankHolidays']).isLoading,
  errorLocalBankHoliday: state.getIn(['localBankHolidays']).errors
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    saveLocalBankHoliday,
    getAllLocalBankHoliday,
    getAllLocalBankHolidayByCompany
  },
  dispatch
);

const AddLocalBankHolidayMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddLocalBankHoliday);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return (
    <AddLocalBankHolidayMapped changeTheme={changeTheme} classes={classes} />
  );
};
