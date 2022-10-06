import React from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CurrencyService from '../../../Services/CurrencyService';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import CommercialOperationService from '../../../Services/CommercialOperationService';
import ClientService from '../../../Services/ClientService';
import { getAllCountry } from '../../../../redux/country/actions';
import { getAllStateByCountry } from '../../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../../redux/city/actions';
import IvaService from '../../../Services/IvaService';
import ContractService from '../../../Services/ContractService';
import BillService from '../../../Services/BillService';
import notification from '../../../../components/Notification/Notification';
import history from '../../../../utils/history';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

class EditBill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billId: '',
      code: '',
      invoiceDate: new Date(),
      contractor: '',
      clientId: '',
      clients: [],
      companies: [],
      operations: [],
      commercialOperations: [],
      currencies: [],
      ivaStates: [],
      contracts: [],
      clientContracts: [],
      ivas: [],
      ivasCountries: [],
      financialContractId: '',
      clientContractSigned: '',
      commercialOperationId: '',
      purchaseOrderNumber: '',
      factor: 0,
      totalEuro: 0,
      totalLocal: 0,
      ivaCountry: '',
      ivaState: '',
      ivaStateValue: '',
      valueIVALocal: 0,
      valueIVAEuro: 0,
      totalAmountEuro: 0,
      totalAmountLocal: 0,
      localCurrency: '',
      nbrConcepts: ['1'],
      items: [],
      desc: [],
      descTotalUSD: [],
      paymentDate: '',
      reelPaymentDay: new Date(),
      reelPaymentDays: '',
      registerDate: '',
      delayDate: '',
      paymentDone: false
    };
  }

  componentDidMount() {
    // eslint-disable-next-line no-shadow,react/prop-types
    const { getAllCountry } = this.props;
    getAllCountry();
    // services calls
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    FinancialCompanyService.getCompany().then(result => {
      this.setState({ companies: result.data });
    });
    CommercialOperationService.getCommercialOperation().then(result => {
      this.setState({ operations: result.data.payload, commercialOperations: result.data.payload });
    });
    ClientService.getClients().then(result => {
      this.setState({ clients: result.data.payload });
    });
    IvaService.getIva().then(result => {
      console.log(result.data);
      this.setState({ ivas: result.data });
    });
    IvaService.getIvaCountries().then(result => {
      console.log(result.data);
      this.setState({ ivasCountries: result.data });
    });
    ContractService.getContract().then(result => {
      this.setState({ contracts: result.data, clientContracts: result.data });
    });
  }

  componentWillReceiveProps(props) {
    // eslint-disable-next-line react/prop-types
    const bill = props.Info; console.log(bill);
    if (bill._id) {
      this.setState({
        billId: bill._id,
        code: bill.code,
        invoiceDate: bill.invoiceDate ? bill.invoiceDate.slice(0, 10) : '',
        clientId: bill.client._id,
        commercialOperationId: bill.commercialOperation._id,
        contractor: bill.financialCompany._id,
        financialContractId: bill.financialContract._id,
        clientContractSigned: bill.clientSigned._id,
        localCurrency: bill.currency._id,
        factor: bill.currency.changeFactor,
        purchaseOrderNumber: bill.purchaseOrderNumber,
        totalEuro: bill.totalEuro,
        totalLocal: bill.totalLocal,
        ivaCountry: bill.iva.stateCountry.country.countryName,
        ivaState: bill.iva._id,
        ivaCountryId: bill.iva.stateCountry.country.countryId,
        iva: bill.iva,
        ivaStateValue: (bill.valueIVALocal * 100) / bill.totalLocal,
        valueIVALocal: bill.valueIVALocal,
        valueIVAEuro: bill.valueIVAEuro,
        totalAmountLocal: bill.totalAmountLocal,
        totalAmountEuro: bill.totalAmountEuro,
        nbrConcepts: bill.nbrConcepts,
        desc: bill.desc,
        descTotalUSD: bill.descTotalUSD,
        paymentsBDDay: bill.paymentsBDDay,
        reelPaymentDays: bill.reelPaymentDays ? bill.reelPaymentDays : "",
        reelPaymentDay: bill.reelPaymentDay ? bill.reelPaymentDay.toString().slice(0, 10) : "mm/dd/yyyy",
        paymentDone: bill.paymentDone,
        registerDate: bill.registerDate.toString().slice(0, 10),
        openDoc: true
      });
      IvaService.getIvaStates(bill.iva.stateCountry.country.countryName).then(results => {
        this.setState({ ivaStates: results.data });
      });
    }
  }

  
  handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  }

    handleChange = (ev) => {
      const { ivaStateValue, descTotalUSD } = this.state;
      if (ev.target.name === 'clientId') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const commercialOperations = this.state.operations.filter(row => row.client._id === ev.target.value); const clientContracts = this.state.contracts.filter(row => row.client._id === ev.target.value);
        this.setState({ commercialOperations, clientContracts });
      }
      if (ev.target.name === 'reelPaymentDay') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        this.setState({ paymentDone: true });
      }
      if (ev.target.name === 'ivaState') {
        const id = ev.target.value;
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const local = this.state.totalLocal; const { factor } = this.state;
        let iva = 0;
        // eslint-disable-next-line react/destructuring-assignment,array-callback-return
        this.state.ivas.map(row => {
          if (row.ivaId === id) iva = row.value;
        });
        this.setState({
          ivaStateValue: iva
        });
        this.setState({
          ivaState: id, valueIVALocal: (iva * local) / 100, valueIVAEuro: ((iva * local) / 100) * factor, totalAmountLocal: local + ((iva * local) / 100), totalAmountEuro: (local + ((iva * local) / 100)) * factor
        });
      }
      if (ev.target.name === 'localCurrency') {
        const id = ev.target.value;
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const local = this.state.totalLocal;
        let factor = 0;
        // eslint-disable-next-line react/destructuring-assignment,array-callback-return
        this.state.currencies.map(row => {
          if (row.currencyId === id) factor = row.changeFactor;
        });
        this.setState({ totalEuro: factor * local, factor });
        let totalUSD = 0;
        descTotalUSD.map(row => { totalUSD += Number(row); });
        this.setState({
          valueIVAEuro: ((ivaStateValue * totalUSD) / 100) * factor, totalAmountEuro: (totalUSD + ((ivaStateValue * totalUSD) / 100)) * factor
        });
      }
      if (ev.target.name === 'purchaseOrderNumber') {
        let id;
        // eslint-disable-next-line react/destructuring-assignment,array-callback-return
        this.state.contracts.map(rows => {
          // eslint-disable-next-line array-callback-return
          rows.purchaseOrderNumber.map((row) => {
            if (row === ev.target.value) id = rows.financialContractId;
          });
        });
        this.setState({ financialContractId: id });
      }
      if (ev.target.name === 'ivaCountry') {
        const country = ev.target.value;
        console.log(country);
        IvaService.getIvaStates(country).then(result => {
          this.setState({ ivaStates: result.data });
        });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

    handleConcept = (event, row) => {
      let totalUSD = 0;
      const {
        factor, ivaStateValue, descTotalUSD
      } = this.state;
      if (event.target.name === 'desc') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const tab = this.state.desc;
        tab[0] = 0;
        tab[row] = event.target.value;
        this.setState({ desc: tab });
      }
      if (event.target.name === 'descTotalUSD') {
        const tab = descTotalUSD; tab[0] = 0;
        tab[row] = Number(event.target.value);
        tab.map(row => { totalUSD += Number(row); });
        this.setState({ descTotalUSD: tab, totalLocal: totalUSD });
        this.setState({ totalEuro: factor * totalUSD });
        this.setState({
          valueIVALocal: (ivaStateValue * totalUSD) / 100, valueIVAEuro: ((ivaStateValue * totalUSD) / 100) * factor, totalAmountLocal: totalUSD + ((ivaStateValue * totalUSD) / 100), totalAmountEuro: (totalUSD + ((ivaStateValue * totalUSD) / 100)) * factor
        });
      }
    }

    handleCreate = () => {
      const {
        code, invoiceDate, contractor, financialContractId, reelPaymentDay, nbrConcepts, contracts, billId,
        clientId, commercialOperationId, clientContractSigned, purchaseOrderNumber, paymentDone,
        totalEuro, totalLocal, ivaState, valueIVALocal, valueIVAEuro, totalAmountEuro, totalAmountLocal, localCurrency, desc, descTotalUSD
      } = this.state;
      const id = clientId;
      const client = { _id: id };
      const commercialOperation = { _id: commercialOperationId };
      const financialCompany = { _id: contractor };
      const currency = { _id: localCurrency };
      const iva = { _id: ivaState };
      const financialContract = { _id: financialContractId };
      const clientSigned = { _id: clientContractSigned };
      const delaiDay = 20;
      let paymentsBDDay = 0;
      // eslint-disable-next-line array-callback-return
      contracts.map(contract => {
        if (contract.financialContractId === financialContractId) paymentsBDDay = contract.paymentsBDDays;
      });
      const paymentDate = new Date(invoiceDate);
      paymentDate.setDate(paymentDate.getDate() + paymentsBDDay);
      const reelPaymentDate = new Date(reelPaymentDay);
      const difference = reelPaymentDate.getTime() - paymentDate.getTime();
      const reelPaymentDays = Math.ceil(difference / (1000 * 3600 * 24));
      const delayDate = new Date(paymentDate);
      delayDate.setDate(delayDate.getDate() + delaiDay);
      const registerDate = new Date();
      if (descTotalUSD.length == 1 && descTotalUSD[0] == 0) {
        notification('danger', 'Amount in Currency of item ' + 1 + ' is null');
        this.props.callbackFromParent2();
        return;
      }
      for (let i = 1; i < descTotalUSD.length; i++) {
        if (descTotalUSD[i] == null) {
          notification('danger', 'Amount in Currency of item ' + i + ' is null');
          this.props.callbackFromParent2();
          return;
        }
      }
      const Bill = {
        billId,
        client,
        clientSigned,
        commercialOperation,
        financialCompany,
        currency,
        iva,
        financialContract,
        code,
        invoiceDate,
        purchaseOrderNumber,
        paymentsBDDay,
        paymentDate,
        reelPaymentDay,
        reelPaymentDays,
        registerDate,
        paymentDone,
        delayDate,
        totalEuro,
        totalLocal,
        valueIVALocal,
        valueIVAEuro,
        totalAmountEuro,
        totalAmountLocal,
        nbrConcepts,
        desc,
        descTotalUSD,
        currencyId: localCurrency,
        stateId: ivaState,
        financialCompanyId: contractor,
        clientId,
        clientSignedId: clientContractSigned,
        commercialOperationId
      };
      BillService.updateBill(Bill).then(result => {
        // eslint-disable-next-line react/prop-types,react/destructuring-assignment
        this.props.callbackFromParent(false);
        if (result.status === 200) {
          notification('success', 'Bill updated');
          this.props.callbackFromParent2();
        }
        history.push('/app/gestion-financial/Billing');
      })
        .catch(err => notification('danger', err.response.data.errors));
    }

    handleGoBack = () => {
      // eslint-disable-next-line react/prop-types,react/destructuring-assignment
      this.props.callbackFromParent(false);
    }

    handleOpenConcept = (row) => {
      const { descTotalUSD, nbrConcepts } = this.state;
      descTotalUSD[Number(row) + 1] = null;
      const newElement = nbrConcepts.length + 1;
      nbrConcepts.push(newElement);
      this.setState({ openDoc: true, descTotalUSD });
    }

    handleDeleteConcept = (row) => {
      let totalUSD = 0;
      const {
        factor, nbrConcepts, descTotalUSD, desc, ivaStateValue
      } = this.state;
      if (nbrConcepts.length > 1) {
        const newDocs = nbrConcepts.filter(rows => rows !== row);
        const newDocs2 = desc.filter((e, i) => i !== (row));
        const newDocs3 = descTotalUSD.filter((e, i) => i !== (row));
        for (let i = 0; i < newDocs.length; i++) {
          newDocs[i] = i + 1;
        }
        this.setState({ nbrConcepts: newDocs, desc: newDocs2, descTotalUSD: newDocs3 });
        newDocs3.map(row => { totalUSD += Number(row); });
        this.setState({ totalLocal: totalUSD });
        this.setState({ totalEuro: factor * totalUSD });
        this.setState({
          valueIVALocal: (ivaStateValue * totalUSD) / 100, valueIVAEuro: ((ivaStateValue * totalUSD) / 100) * factor, totalAmountLocal: totalUSD + ((ivaStateValue * totalUSD) / 100), totalAmountEuro: (totalUSD + ((ivaStateValue * totalUSD) / 100)) * factor
        });
      }
    }

    render() {
      console.log(this.state);
      const codeBill = [
        {
          value: '1',
          label: '1',
        },
        {
          value: '2',
          label: '2',
        }];
      const {
        code, invoiceDate, contractor, clients, companies, commercialOperations, currencies, ivasCountries, ivaStates, clientContracts,
        clientId, commercialOperationId, clientContractSigned, purchaseOrderNumber, nbrConcepts, paymentDone, reelPaymentDay,
        totalEuro, totalLocal, ivaCountry, ivaState, valueIVALocal, valueIVAEuro, totalAmountEuro, totalAmountLocal, localCurrency, desc, descTotalUSD
      } = this.state;
      return (
        <div>
          <Typography variant="subtitle2" component="h2" color="primary">
                        Bill Informations
          </Typography>
          <br />
          <div>
            <div align="center">
              <Grid item xs={12} sm={8} md={8} align="center" />
            </div>
            <Grid
              container
              spacing={2}
              alignItems="flex-start"
              direction="row"
              justify="space-around"
            >
              <Grid item xs={12} md={3} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel>Select Code</InputLabel>
                  <Select
                    name="code"
                    value={code}
                    onChange={this.handleChange}
                  >
                    {
                      codeBill.map((clt) => (
                        <MenuItem key={clt.value} value={clt.value}>
                          {clt.label}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} sm={3}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="invoiceDate"
                      name="invoiceDate"
                      label="Invoice Date"
                      value={invoiceDate}
                      onChange={value => this.handleDateValue(value, 'invoiceDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>

              </Grid>
              <Grid item xs={12} md={3} sm={3}>
                <FormControl fullWidth required>
                  <InputLabel>Select Contractor</InputLabel>
                  <Select
                    name="contractor"
                    value={contractor}
                    onChange={this.handleChange}
                  >
                    {
                      companies.map((clt) => (
                        <MenuItem key={clt.financialCompanyId} value={clt.financialCompanyId}>
                          {clt.name}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </div>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Client Informations
          </Typography>
          <br />
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12} md={5} sm={5}>
              <FormControl fullWidth required>
                <InputLabel>Select Client </InputLabel>
                <Select
                  name="clientId"
                  value={clientId}
                  onChange={this.handleChange}
                >
                  {
                    clients.map((type) => (
                      <MenuItem key={type.clientId} value={type.clientId}>
                        {type.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} sm={5}>
              <FormControl fullWidth required>
                <InputLabel>Select Commercial Operation</InputLabel>
                <Select
                  name="commercialOperationId"
                  value={commercialOperationId}
                  onChange={this.handleChange}
                >
                  {
                    commercialOperations.map((type) => (
                      <MenuItem key={type.commercialOperationId} value={type.commercialOperationId}>
                        {type.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} sm={5}>
              <FormControl fullWidth required>
                <InputLabel>Select Contract Signed Client</InputLabel>
                <Select
                  name="clientContractSigned"
                  value={clientContractSigned}
                  onChange={this.handleChange}
                >
                  {
                    clients.map((type) => (
                      <MenuItem key={type.clientId} value={type.clientId}>
                        {type.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={5} sm={5}>
              <FormControl fullWidth required>
                <InputLabel>Select Purchase Order Number</InputLabel>
                <Select
                  name="purchaseOrderNumber"
                  value={purchaseOrderNumber}
                  onChange={this.handleChange}
                >
                  {
                    clientContracts.map((type) => (
                      type.purchaseOrderNumber.filter(rowi => rowi !== '0').map((row) => (
                        <MenuItem key={type.financialContractId} value={row}>
                          {row}
                        </MenuItem>
                      ))
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Concepts Of The Invoice
          </Typography>
          <br />
          {nbrConcepts.map((row) => (
            <Grid
              container
              spacing={4}
              alignItems="flex-start"
              direction="row"
            >
              <Grid item xs={false} />
              <Grid item xs={1} align="center">
                <Typography variant="subtitle2" component="h3" color="primary">
                  <br />
                                    Item
                  {' '}
                  { row }
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="desc"
                  label="Description"
                  name="desc"
                  value={desc[row]}
                  multiline
                  rows={1}
                  onChange={event => this.handleConcept(event, row)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="descTotalUSD"
                  label="Amount in Currency"
                  name="descTotalUSD"
                  value={descTotalUSD[row]}
                  type="number"
                  onChange={event => this.handleConcept(event, row)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid xs={1}>
                <br />
                <IconButton size="medium" color="primary" onClick={() => this.handleOpenConcept(row)}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" color="primary" onClick={() => this.handleDeleteConcept(row)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Economic Value Of The Bill
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item />
            <Grid item xs={12} md={6}>
              <br />
              <Typography variant="subtitle2" component="h2" color="primary">
                                Total Amount Net
              </Typography>
            </Grid>
            <Grid item md={3} />
            <Grid item xs={12} md={4} sm={4}>
              <FormControl fullWidth required>
                <InputLabel>Select Local Currency </InputLabel>
                <Select
                  name="localCurrency"
                  value={localCurrency}
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
            <Grid item xs={12} md={4} sm={4}>
              <TextField
                id="totalLocal"
                label="Total in Local Currency"
                name="totalLocal"
                value={totalLocal}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={4} sm={4}>
              <TextField
                id="totalEuro"
                label="Total in EURO"
                name="totalEuro"
                value={totalEuro}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item md={false} />
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" component="h2" color="primary">
                                I.V.A Taxes
              </Typography>
            </Grid>
            <Grid item md={3} />
            <Grid item xs={12} md={3} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Select I.V.A Country</InputLabel>
                <Select
                  name="ivaCountry"
                  value={ivaCountry}
                  onChange={this.handleChange}
                >
                  {
                    ivasCountries.map((clt) => (
                      <MenuItem key={clt} value={clt}>
                        {clt}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Select State</InputLabel>
                <Select
                  name="ivaState"
                  value={ivaState}
                  onChange={this.handleChange}
                >
                  {
                    ivaStates.map((clt) => (
                      <MenuItem key={clt.ivaId} value={clt.ivaId}>
                        {clt.stateCountry.stateName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <TextField
                id="totalIVALocal"
                label="I.V.A Value in Local Currency"
                name="totalIVALocal"
                value={valueIVALocal}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <TextField
                id="totalIVAEuro"
                label="I.V.A Value in EURO"
                name="totalIVAEuro"
                value={valueIVAEuro}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item md={false} />
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" component="h2" color="primary">
                                Total Amount
              </Typography>
            </Grid>
            <Grid item md={3} />
            <Grid item xs={12} md={5} sm={5}>
              <TextField
                id="totalAmountLocal"
                label="Total Amount in Local Currency"
                name="totalAmountLocal"
                value={totalAmountLocal}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={5} sm={5}>
              <TextField
                id="totalAmountEuro"
                label="Total Amount in EURO"
                name="totalAmountEuro"
                value={totalAmountEuro}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Payment Management
          </Typography>
          <Grid
            container
            spacing={3}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={4}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="reelPaymentDay"
                      name="reelPaymentDay"
                      label="Real Payment Date"
                      value={reelPaymentDay}
                      onChange={value => this.handleDateValue(value, 'reelPaymentDay')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>

            </Grid>
            <br />
            <Grid item xs={3}>
              <FormControlLabel
                id="paymentDone"
                name="paymentDone"
                value={paymentDone}
                control={<Checkbox color="primary" checked={paymentDone} />}
                label="payment Done"
                labelPlacement="end"
              />
            </Grid>
          </Grid>
          <br />
          <br />
          <div align="center">
            <Button size="small" color="inherit" onClick={this.handleGoBack}>Cancel</Button>
            <Button variant="contained" color="primary" type="button" onClick={this.handleCreate}>
                            Save
            </Button>
          </div>
        </div>
      );
    }
}
const mapStateToProps = state => ({
  allCountrys: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,
  isLoading: state.getIn(['countries']).isLoading,
  errors: state.getIn(['countries']).errors,
  // state
  allStateCountrys: state.getIn(['stateCountries']).allStateCountrys,
  stateCountryResponse: state.getIn(['stateCountries']).stateCountryResponse,
  isLoadingState: state.getIn(['stateCountries']).isLoading,
  errorsState: state.getIn(['stateCountries']).errors,
  // city
  allCitys: state.getIn(['cities']).allCitys,
  cityResponse: state.getIn(['cities']).cityResponse,
  isLoadingCity: state.getIn(['cities']).isLoading,
  errorsCity: state.getIn(['cities']).errors,
});
const mapDispatchToProps = dispatch => bindActionCreators({
  getAllCountry,
  getAllStateByCountry,
  getAllCityByState
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBill);
