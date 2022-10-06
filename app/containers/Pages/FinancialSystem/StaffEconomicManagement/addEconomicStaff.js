import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import {
  Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography
} from '@material-ui/core';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { bindActionCreators } from 'redux';
import Tooltip from '@material-ui/core/Tooltip';
import history from '../../../../utils/history';
import EconomicStaffService from '../../../Services/EconomicStaffService';
import { ThemeContext } from '../../../App/ThemeWrapper';
import { getAllStaff } from '../../../../redux/staff/actions';
import CurrencyService from '../../../Services/CurrencyService';

const useStyles = makeStyles();

class AddEconomicStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      staffs: this.props.allStaff,
      staffId: '',
      companyId: '',
      changeFactor: '',
      company: '',
      employeeNumber: '',
      name: '',
      fatherName: '',
      motherName: '',
      highDate: '',
      lowDate: '',
      grosSalary: 0,
      netSalary: 0,
      contributionSalary: 0,
      companyCost: 0,
      grosSalaryEuro: 0,
      netSalaryEuro: 0,
      contributionSalaryEuro: 0,
      companyCostEuro: 0,
      open: false,
      currencies: [],
      currencyId: '',
      currencyCode: ''
    };
  }

  // eslint-disable-next-line react/sort-comp
  editingPromiseResolve = () => {};

  componentDidMount() {
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
    // eslint-disable-next-line no-shadow,react/prop-types
    const { getAllStaff } = this.props;
    const promise = new Promise(resolve => {
      // get client information
      getAllStaff();
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      const staffs = [];
      console.log('result');
      console.log(result);
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      console.log(this.props.allStaff);
      // eslint-disable-next-line react/destructuring-assignment,react/prop-types
      this.props.allStaff.forEach(staff => {
        staffs.push(staff);
      });
      this.setState({ staffs });
    });
  }

    handleSubmit = () => {
      const {
        staffId, highDate, lowDate, changeFactor, employeeNumber, name, fatherName, motherName, companyId, currencyId,
        grosSalary, netSalary, contributionSalary, companyCost, grosSalaryEuro, netSalaryEuro, contributionSalaryEuro, companyCostEuro,
      } = this.state;
      const staff = { staffId };
      const financialCompany = { _id: companyId };
      const currency = { _id: currencyId };
      const EconomicStaff = {
        staff,
        currency,
        financialCompany,
        changeFactor,
        employeeNumber,
        name,
        fatherName,
        motherName,
        highDate,
        lowDate,
        grosSalary,
        netSalary,
        contributionSalary,
        companyCost,
        grosSalaryEuro,
        netSalaryEuro,
        contributionSalaryEuro,
        companyCostEuro
      };
      console.log(EconomicStaff);
      EconomicStaffService.saveEconomicStaff(EconomicStaff).then(result => {
        console.log(result);
        history.push('/app/gestion-financial/Staff Economic Management');
      });
    }

    handleChange = (ev) => {
      // eslint-disable-next-line react/destructuring-assignment
      let { changeFactor } = this.state;
      if (ev.target.name === 'name') {
        const id = ev.target.value;
        // eslint-disable-next-line array-callback-return,react/destructuring-assignment
        this.state.staffs.map(staff => {
          if (staff.staffId === id) {
            this.setState({
              name: staff.firstName,
              staffId: staff.staffId,
              changeFactor: staff.changeFactor,
              fatherName: staff.fatherFamilyName,
              motherName: staff.motherFamilyName,
              highDate: staff.highDate,
              lowDate: staff.lowDate,
              companyId: staff.companyId,
              company: staff.companyName,
              employeeNumber: staff.personalNumber,
              grosSalary: staff.contractSalary,
              grosSalaryEuro: staff.contractSalary * staff.changeFactor,
              companyCost: staff.totalCompanyCost,
              companyCostEuro: staff.totalCompanyCost * staff.changeFactor,
              currencyId: staff.currencyId,
              currencyCode: staff.currencyCode
            });
          }
        });
      }
      if (ev.target.name === 'currencyId') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const {
          netSalary, contributionSalary, grosSalary, companyCost
        } = this.state;
        let currencyCode;
        // eslint-disable-next-line react/destructuring-assignment,array-callback-return
        this.state.currencies.map(currency => {
          if (currency.currencyId === ev.target.value) {
            // eslint-disable-next-line prefer-destructuring
            changeFactor = currency.changeFactor; currencyCode = currency.typeOfCurrency.currencyCode;
          }
        });
        this.setState({
          companyCostEuro: companyCost * changeFactor, grosSalaryEuro: grosSalary * changeFactor, netSalaryEuro: netSalary * changeFactor, contributionSalaryEuro: contributionSalary * changeFactor, changeFactor, currencyCode
        });
      }
      if (ev.target.name === 'netSalary') {
        this.setState({ netSalaryEuro: ev.target.value * changeFactor });
      }
      if (ev.target.name === 'contributionSalary') {
        this.setState({ contributionSalaryEuro: ev.target.value * changeFactor });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

    handleGoBack = () => {
      history.push('/app/gestion-financial/Staff Economic Management');
    }

    render() {
      console.log(this.state);
      const title = brand.name + ' - Add Commercial Staff';
      const { desc } = brand;
      // eslint-disable-next-line react/prop-types
      const {
        name, fatherName, motherName, highDate, lowDate, company, employeeNumber,
        grosSalary, netSalary, contributionSalary, companyCost, staffs,
        grosSalaryEuro, netSalaryEuro, contributionSalaryEuro, companyCostEuro,
        currencies, currencyId, currencyCode
      } = this.state;
      const {
        allStaff,
        classes,
        isLoadingStaff,
        staffResponse,
        errorStaff
      } = this.props;

      !isLoadingStaff
      && staffResponse
      && this.editingPromiseResolve(staffResponse);
      !isLoadingStaff && !staffResponse && this.editingPromiseResolve(errorStaff);

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
          <PapperBlock
            title="New Commercial Staff"
            desc="Please, Fill in the all field"
            icon="ios-add-circle"
          >
            <Grid container spacing={1}>
              <Grid item xs={11} />
              <Grid item xs={1}>
                <Tooltip title="Back to List">
                  <IconButton onClick={() => this.handleGoBack()}>
                    <KeyboardBackspaceIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Typography variant="subtitle2" component="h2" color="primary">
              General Staff Informations
            </Typography>
            <br />
            <Grid
              container
              spacing={3}
              alignItems="flex-start"
              direction="row"
            >
              <Grid item xs={12} md={3}>
                <FormControl fullWidth required>
                  <InputLabel>Select Employee </InputLabel>
                  <Select
                    name="name"
                    value={name}
                    onChange={this.handleChange}
                  >
                    {
                      staffs.map((clt) => (
                        <MenuItem key={clt.staffId} value={clt.staffId}>
                          {clt.firstName}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  id="fatherName"
                  label="Father Name  "
                  name="fatherName"
                  value={fatherName}
                  onChange={this.handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  id="motherName"
                  label="Mother Name"
                  name="motherName"
                  value={motherName}
                  onChange={this.handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  id="employeeNumber"
                  label="Employee Number"
                  name="employeeNumber"
                  value={employeeNumber}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id="company"
                  label="Company"
                  name="company"
                  value={company}
                  onChange={this.handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id="highDate"
                  label="Hiring Date"
                  name="highDate"
                  value={highDate}
                  onChange={this.handleChange}
                  fullWidth
                  required
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  id="lowDate"
                  label="Low Date"
                  name="lowDate"
                  value={lowDate}
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Typography variant="subtitle2" component="h2" color="primary">
              Economic Management
            </Typography>
            <br />
            <Grid
              container
              spacing={4}
              alignItems="flex-start"
              direction="row"
            >
              <Grid item xs={12} md={3} />
              <Grid item xs={6} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Select Currency</InputLabel>
                  <Select
                    name="currencyId"
                    value={currencyId}
                    required
                    onChange={this.handleChange}
                  >
                    {
                      currencies.map((clt) => (
                        <MenuItem key={clt.currencyId} value={clt.currencyId}>
                          {clt.typeOfCurrency.currencyName}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  id="currencyCode"
                  label="Currency Code"
                  name="currencyCode"
                  value={currencyCode}
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3} />
              <Grid item xs={12} md={1} />
              <Grid item xs={12} md={5}>
                <TextField
                  id="grosSalary"
                  label="Gross Salary"
                  name="grosSalary"
                  value={grosSalary}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  required
                  disabled="true"
                />
              </Grid>
              <Grid item xs={10} md={5}>
                <TextField
                  id="grosSalaryEuro"
                  label="Gross Salary (€)"
                  name="grosSalaryEuro"
                  value={grosSalaryEuro}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  required
                  disabled="true"
                />
              </Grid>
              <Grid item xs={12} md={1} />
              <Grid item xs={12} md={1} />
              <Grid item xs={10} md={5}>
                <TextField
                  id="netSalary"
                  label="Net Salary"
                  name="netSalary"
                  value={netSalary}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={10} md={5}>
                <TextField
                  id="netSalaryEuro"
                  label="Net Salary (€)"
                  name="netSalaryEuro"
                  value={netSalaryEuro}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={1} />
              <Grid item xs={12} md={1} />
              <Grid item xs={10} md={5}>
                <TextField
                  id="contributionSalary"
                  label="Contribution Salary"
                  name="contributionSalary"
                  value={contributionSalary}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={10} md={5}>
                <TextField
                  id="contributionSalaryEuro"
                  label="Contribution Salary (€)"
                  name="contributionSalaryEuro"
                  value={contributionSalaryEuro}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={1} />
              <Grid item xs={12} md={1} />
              <Grid item xs={10} md={5}>
                <TextField
                  id="companyCost"
                  label="Company Cost"
                  name="companyCost"
                  value={companyCost}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  disabled="true"
                />
              </Grid>
              <Grid item xs={10} md={5}>
                <TextField
                  id="companyCostEuro"
                  label="Company Cost (€)"
                  name="companyCostEuro"
                  value={companyCostEuro}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  disabled="true"
                />
              </Grid>
            </Grid>
            <div align="center">
              <br />
              <br />
              <Button size="small" color="inherit" onClick={this.handleGoBack}>Cancel</Button>
              <Button variant="contained" color="primary" type="button" onClick={this.handleSubmit}>
                      Save
              </Button>
            </div>
          </PapperBlock>
        </div>
      );
    }
}
AddEconomicStaff.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  staff: state.getIn(['staffs']).selectedStaff,
  allStaff: state.getIn(['staffs']).allStaff,
  staffResponse: state.getIn(['staffs']).staffResponse,
  isLoadingStaff: state.getIn(['staffs']).isLoading,
  errorStaff: state.getIn(['staffs']).errors
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllStaff
  },
  dispatch
);

const AddEconomicStaffMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEconomicStaff);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AddEconomicStaffMapped changeTheme={changeTheme} classes={classes} />;
};
