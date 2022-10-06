import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import {
  FormControl,
  Grid, InputLabel, MenuItem, Select, TextField, Typography
} from '@material-ui/core';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { connect } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import { Image } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import history from '../../../../utils/history';
import { ThemeContext } from '../../../App/ThemeWrapper';
import SuppliersPaymentService from '../../../Services/SuppliersPaymentService';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import ExternalSuppliersService from '../../../Services/ExternalSuppliersService';
import ClientService from '../../../Services/ClientService';
import ContractService from '../../../Services/ContractService';
import PurchaseOrderService from '../../../Services/PurchaseOrderService';
import CurrencyService from '../../../Services/CurrencyService';
import notification from '../../../../components/Notification/Notification';
import styles from '../../AbsenceRequest/absenceRequest-jss';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles(styles);
const inputSupplierPaymentsDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];

class AddSuppliersPayment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierPaymentDoc: {},
      supplierPaymentDocExtension: '',
      codeContract: '',
      codeSupplier: '',
      clients: [],
      clientId: '',
      contracts: [],
      contractsClient: [],
      currencies: [],
      currencyId: '',
      changeFactor: 0,
      contractTradeVolume: 0,
      contractTradeVolumeEuro: 0,
      contractId: '',
      purchaseOrders: [],
      purchaseOrdersClient: [],
      purchaseOrderId: '',
      supplierBill: '',
      paymentDate: new Date(),
      reelPaymentDate: new Date(),
      companies: [],
      externalSuppliers: [],
      externalSupplierId: '',
      financialCompanyId: '',
      type: 'external',
      typeClient: 'contract',
      poClient: false,
      contractClient: true,
      haveExternal: true,
      haveInternal: false
    };
  }

  componentDidMount() {
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
    FinancialCompanyService.getCompany().then(result => {
      this.setState({ companies: result.data });
    });
    ExternalSuppliersService.getExternalSuppliers().then(result => {
      this.setState({ externalSuppliers: result.data });
    });
    ClientService.getClients().then(result => {
      this.setState({ clients: result.data.payload });
    });
    ContractService.getContract().then(result => {
      this.setState({ contracts: result.data, contractsClient: result.data });
    });
    PurchaseOrderService.getPurchaseOrder().then(result => {
      this.setState({ purchaseOrders: result.data, purchaseOrdersClient: result.data });
    });
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
  }


  // eslint-disable-next-line react/sort-comp
  readURI(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      console.log(e.target.files);
      reader.onload = function (ev) {
        this.setState({ supplierBill: ev.target.result });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }
  handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  }

    handleChangeLogo = e => {
      this.readURI(e);
    };

    handleSubmit = () => {
      const {
        codeSupplier, supplierBill, type, typeClient,
        clientId, reelPaymentDate, paymentDate,
        currencyId, contractTradeVolume, contractTradeVolumeEuro, changeFactor, haveExternal,
        haveInternal, supplierPaymentDocExtension, supplierPaymentDoc
      } = this.state;
      let {
        externalSupplierId, financialCompanyId, purchaseOrderId, contractId
      } = this.state;
      const client = { _id: clientId };
      const currency = { _id: currencyId };
      let financialCompany = { _id: '' };
      let externalSupplier = { _id: '' };
      let purchaseOrder = { _id: '' };
      let financialContract = { _id: '' };
      if (financialCompanyId !== '') financialCompany = { _id: financialCompanyId };
      if (externalSupplierId !== '') externalSupplier = { _id: externalSupplierId };
      if (typeClient === 'contract') financialContract = { _id: contractId };
      if (typeClient === 'po') purchaseOrder = { _id: purchaseOrderId };
      if (haveInternal === true) {
        externalSupplierId = 'empty';
      }
      if (haveExternal === true) {
        financialCompanyId = 'empty';
      }
      if (typeClient === 'contract') {
        purchaseOrderId = 'empty';
      }
      if (typeClient === 'po') {
        contractId = 'empty';
      }
      const supplierPaymentAddrequest = {
        codeSupplier,
        supplierBill,
        externalSupplier,
        financialCompany,
        currency,
        type,
        typeClient,
        changeFactor,
        contractTradeVolume,
        contractTradeVolumeEuro,
        paymentDate: new Date(paymentDate),
        reelPaymentDate: new Date(reelPaymentDate),
        client,
        purchaseOrder,
        financialContract,
        clientId,
        currencyId,
        financialCompanyId,
        externalSupplierId,
        purchaseOrderId,
        contractId,
        supplierPaymentDocExtension
      };
      const formData = new FormData();
      if (supplierPaymentDoc.constructor === File) {
        formData.append('supplierPaymentDoc', supplierPaymentDoc);
      } else {
        formData.append(
          'supplierPaymentDoc',
          new Blob([JSON.stringify({})], {
            type: 'application/json'
          })
        );
      }
      Object.keys(supplierPaymentAddrequest).forEach(e => formData.append(e, supplierPaymentAddrequest[e]));
      SuppliersPaymentService.saveSuppliersPayment(formData).then(result => {
        if (result.status === 200) {
          notification('success', 'Suppliers payment status Added');
        }
        history.push('/app/gestion-financial/Suppliers Payment');
      })
        .catch(err => notification('danger', err.response.data.errors));
    }

    handleGoBack = () => {
      history.push('/app/gestion-financial/Suppliers Payment');
    }

    handleChange = (ev) => {
      const {
        changeFactor, contractTradeVolume, currencies, externalSuppliers, companies, purchaseOrders
      } = this.state;
      if (ev.target.name === 'currencyId') {
        const tradeValue = contractTradeVolume;
        currencies.map(currency => {
          if (currency.currencyId === ev.target.value) {
            this.setState({ contractTradeVolumeEuro: tradeValue * currency.changeFactor, changeFactor: currency.changeFactor });
          }
          return null;
        });
      }
      if (ev.target.name === 'contractTradeVolume') {
        this.setState({ contractTradeVolumeEuro: ev.target.value * changeFactor, changeFactor });
      }
      if (ev.target.name === 'type') {
        if (ev.target.value === 'external') this.setState({ haveExternal: true, haveInternal: false });
        else this.setState({ haveInternal: true, haveExternal: false });
      }
      if (ev.target.name === 'externalSupplierId') {
        externalSuppliers.map(row => {
          if (row.externalSupplierId === ev.target.value) {
            this.setState({ codeSupplier: row.code, financialCompanyId: '' });
          }
          return null;
        });
      }
      if (ev.target.name === 'financialCompanyId') {
        companies.map(row => {
          if (row.financialCompanyId === ev.target.value) {
            this.setState({ codeSupplier: row.code, codeContract: row.code, externalSupplierId: '' });
          }
          return null;
        });
      }
      if (ev.target.name === 'typeClient') {
        if (ev.target.value === 'contract') this.setState({ contractClient: true, poClient: false });
        else this.setState({ poClient: true, contractClient: false });
      }
      if (ev.target.name === 'clientId') {
        const tab1 = purchaseOrders; const tab2 = this.state.contracts;
        const tabClient = tab2.filter((row) => (row.client._id === ev.target.value));
        const tabPurchaseOrder = tab1.filter((row) => (row.client._id === ev.target.value));
        this.setState({ purchaseOrdersClient: tabPurchaseOrder, contractsClient: tabClient });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

  handleUploadDocumentClick = () => {
    inputSupplierPaymentsDoc.current.value = '';
    inputSupplierPaymentsDoc.current.click();
  };

  handleSupplierPaymentDocChange = () => {
    const lastDot = inputSupplierPaymentsDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputSupplierPaymentsDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        supplierPaymentDoc: inputSupplierPaymentsDoc.current.files[0],
        supplierPaymentDocExtension: ext
      });
    }
  };

  handleDeleteDoc= () => {
    inputSupplierPaymentsDoc.current.value = '';
    this.setState({
      supplierPaymentDoc: {},
      supplierPaymentDocExtension: ''
      //   contractTypeSelected: {}
    });
  };

  render() {
    const { classes } = this.props;
    const title = brand.name + ' - Add New Supplier Payment';
    const { desc } = brand;
    const {
      codeSupplier, companies, externalSuppliers, type, supplierBill, reelPaymentDate, paymentDate,
      haveExternal, haveInternal, externalSupplierId, financialCompanyId, supplierPaymentDoc,
      currencyId, contractTradeVolume, contractTradeVolumeEuro, currencies,
      contractClient, poClient, typeClient, clients, clientId, contractsClient, contractId, purchaseOrdersClient, purchaseOrderId
    } = this.state;
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
          title="Supplier Payment"
          desc="Please, Fill in the fields"
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
          <br />
          <Typography variant="subtitle2" component="h2" color="primary" align="center" />
          <br />
          <Grid
            container
            spacing={6}
            alignItems="flex-start"
            direction="row"
            justify="center"
          >
            <Grid item xs={12} md={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend"> ● Supplier Type</FormLabel>
                <RadioGroup row aria-label="position" name="type" value={type} onChange={this.handleChange}>
                  <FormControlLabel
                    value="external"
                    control={<Radio color="primary" />}
                    label="External"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="internal"
                    control={<Radio color="primary" />}
                    label="Internal"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              {haveExternal ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
                >
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select External Supplier</InputLabel>
                      <Select
                        name="externalSupplierId"
                        value={externalSupplierId}
                        variant="outlined"
                        fullWidth
                        onChange={this.handleChange}
                      >
                        {
                          externalSuppliers.map((clt) => (
                            <MenuItem key={clt.externalSupplierId} value={clt.externalSupplierId}>
                              {clt.companyName}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="codeSupplier"
                      label="Supplier Code"
                      variant="outlined"
                      name="codeSupplier"
                      value={codeSupplier}
                      required
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              ) : (<div />)}
              {haveInternal ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
                >
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select Internal Company</InputLabel>
                      <Select
                        name="financialCompanyId"
                        value={financialCompanyId}
                        variant="outlined"
                        onChange={this.handleChange}
                        fullWidth
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
                  <Grid item xs={12} md={6}>
                    <TextField
                      id="codeSupplier"
                      label="Supplier Code"
                      variant="outlined"
                      name="codeSupplier"
                      value={codeSupplier}
                      required
                      fullWidth
                      disabled
                    />
                  </Grid>
                </Grid>
              ) : (<div />)}
              <br />
              <FormControl component="fieldset">
                <FormLabel component="legend"> ● Client Type</FormLabel>
                <RadioGroup row aria-label="position" name="typeClient" value={typeClient} onChange={this.handleChange}>
                  <FormControlLabel
                    value="contract"
                    control={<Radio color="primary" />}
                    label="Contract Client"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="po"
                    control={<Radio color="primary" />}
                    label="Purchase Order Client"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
              <br />
              {contractClient ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
                >
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select the client</InputLabel>
                      <Select
                        name="clientId"
                        value={clientId}
                        onChange={this.handleChange}
                      >
                        {
                          clients.map((clt) => (
                            <MenuItem key={clt.clientId} value={clt.clientId}>
                              {clt.name}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select the Contract</InputLabel>
                      <Select
                        name="contractId"
                        value={contractId}
                        onChange={this.handleChange}
                      >
                        {
                          contractsClient.map((clt) => (
                            <MenuItem key={clt.financialContractId} value={clt.financialContractId}>
                              {clt.contractTitle}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (<div />)}
              {poClient ? (
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
                >
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select the client</InputLabel>
                      <Select
                        name="clientId"
                        value={clientId}
                        onChange={this.handleChange}
                      >
                        {
                          clients.map((clt) => (
                            <MenuItem key={clt.clientId} value={clt.clientId}>
                              {clt.name}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Select the Purchase Order</InputLabel>
                      <Select
                        name="purchaseOrderId"
                        value={purchaseOrderId}
                        onChange={this.handleChange}
                      >
                        {
                          purchaseOrdersClient.map((clt) => (
                            <MenuItem key={clt.purchaseOrderId} value={clt.purchaseOrderId}>
                              {clt.purchaseNumber}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : (<div />)}
              <br />
              <br />
              <Grid
                container
                spacing={2}
                alignItems="flex-start"
                direction="row"
              >
                <Grid item xs={12} md={4}>
                  <TextField
                    id="Contract Trade Volume"
                    label="Contract Trade Volume"
                    type="number"
                    InputProps={{ inputProps: { min: 0 } }}
                    name="contractTradeVolume"
                    value={contractTradeVolume}
                    onChange={this.handleChange}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <FormControl fullWidth required>
                    <InputLabel>Select Currency</InputLabel>
                    <Select
                      name="currencyId"
                      value={currencyId}
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
                <Grid item xs={12} md={3}>
                  <TextField
                    id="contractTradeVolumeEuro"
                    label="Trade Value (Euro)"
                    type="number"
                    name="contractTradeVolumeEuro"
                    value={contractTradeVolumeEuro}
                    onChange={this.handleChange}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
              </Grid>
              <br />
              <br />
              <Grid
                container
                spacing={3}
                alignItems="flex-start"
                direction="row"
                justify="center"
              >
                <Grid item xs={12} md={6}>
                 
                   <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="paymentDate"
                      name="paymentDate"
                      label="Payment Date"
                      value={paymentDate}
                      onChange={value => this.handleDateValue(value, 'paymentDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>

                </Grid>
                <Grid item xs={12} md={6}> 
                     <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="reelPaymentDate"
                      name="reelPaymentDate"
                      label="Reel Payment Date"
                      value={reelPaymentDate}
                      onChange={value => this.handleDateValue(value, 'reelPaymentDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
              <Grid
                  container
                  spacing={3}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
              >
              <Grid xs={5} md={5} sm={5}>
                <Button
                  style={{ marginTop: '22px' }}
                  fullWidth
                  variant="outlined"
                  component="span"
                  startIcon={<Image color="primary" />}
                  className={
                    supplierPaymentDoc.constructor === Object
                      ? classes.uploadAvatarEmptyContract
                      : classes.uploadAvatarDoneContract
                  }
                  onClick={this.handleUploadDocumentClick}
                >
                  supplier Payment
                </Button>
                <input
                  type="file"
                  id="file"
                  accept=".png, .jpg, .jpeg, .pdf, .docx"
                  ref={inputSupplierPaymentsDoc}
                  multiple={false}
                  style={{ display: 'none' }}
                  onChange={this.handleSupplierPaymentDocChange}
                />
              </Grid>
                <Grid xs={6} md={6} sm={6}>
                  <Tooltip title="Delete">
                  <IconButton onClick={() => this.handleDeleteDoc()}  style={{ marginTop: '13px' }}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
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


const AddSuppliersContractMapped = connect(
)(AddSuppliersPayment);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AddSuppliersContractMapped changeTheme={changeTheme} classes={classes} />;
};
