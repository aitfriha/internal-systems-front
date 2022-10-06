import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select, TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FormLabel from '@material-ui/core/FormLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import { Image } from '@material-ui/icons';
import Avatar from '@material-ui/core/Avatar';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import ExternalSuppliersService from '../../../Services/ExternalSuppliersService';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import SuppliersContractService from '../../../Services/SuppliersContractService';
import { ThemeContext } from '../../../App/ThemeWrapper';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import CurrencyService from '../../../Services/CurrencyService';
import ClientService from '../../../Services/ClientService';
import ContractService from '../../../Services/ContractService';
import PurchaseOrderService from '../../../Services/PurchaseOrderService';
import notification from '../../../../components/Notification/Notification';
import ContractStatusService from '../../../Services/ContractStatusService';
import Transition from '../../../../components/Transition/transition';

const useStyles = makeStyles();

class SuppliersContractBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      numPagesContract: null,
      pageNumberContract: null,
      isOpenSupplierContractDocument: false,
      supplierContractSelected: {},
      openPopUpDelete: false,
      supplierContractToDeleteId: '',
      supplierContractId: '',
      name: '',
      codeContract: '',
      codeSupplier: '',
      changeFactor: 1,
      currencies: [],
      clients: [],
      clientId: '',
      contracts: [],
      contractsClient: [],
      contractId: '',
      purchaseOrders: [],
      purchaseOrdersClient: [],
      purchaseOrderId: '',
      currencyId: '',
      contractTradeVolume: 0,
      contractTradeVolumeEuro: 0,
      document: '',
      companies: [],
      externalSuppliers: [],
      externalSupplierId: '',
      financialCompanyId: '',
      type: '',
      typeClient: '',
      poClient: false,
      contractClient: false,
      haveExternal: false,
      haveInternal: false,
      datas: [],
      openPopUp: false,
      row: [],
      columns: [
        {
          label: 'supplierContractId ',
          name: 'supplierContractId',
          options: {
            display: false,
            filter: false
          }
        },
        {
          label: 'Contract Name',
          name: 'name',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Code Contract',
          name: 'codeContract',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Client',
          name: 'client.name',
          options: {
            filter: true,
            customBodyRender: (name) => (
              <React.Fragment>
                {
                  name || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Contract Client',
          name: 'financialContract.contractTitle',
          options: {
            filter: true,
            customBodyRender: (contractTitle) => (
              <React.Fragment>
                {
                  contractTitle || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Purchase Order Client',
          name: 'purchaseOrder',
          options: {
            filter: true,
            customBodyRender: (purchaseOrder) => (
              <React.Fragment>
                {
                  purchaseOrder ? purchaseOrder.purchaseNumber : '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Supplier Type',
          name: 'type',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Supplier Name',
          name: 'externalSupplier.companyName',
          options: {
            filter: true,
            customBodyRender: (companyName) => (
              <React.Fragment>
                {
                  companyName || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Supplier Code',
          name: 'externalSupplier.code',
          options: {
            filter: true,
            customBodyRender: (code) => (
              <React.Fragment>
                {
                  code || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Company Name',
          name: 'financialCompany.name',
          options: {
            filter: true,
            customBodyRender: (name) => (
              <React.Fragment>
                {
                  name || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Company Code',
          name: 'financialCompany.code',
          options: {
            filter: true,
            customBodyRender: (code) => (
              <React.Fragment>
                {
                  code || '---'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Contract Trade Volume',
          name: 'contractTradeVolume',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Currency',
          name: 'currency.typeOfCurrency.currencyCode',
          options: {
            filter: true,
            customBodyRender: (currencyCode) => (
              <React.Fragment>
                {
                  currencyCode || ''
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'contractTradeVolume (€) ',
          name: 'contractTradeVolumeEuro',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          label: 'Signed Contract Doc',
          name: 'document',
          options: {
            filter: true,
            customBodyRender: (document) => (
              <React.Fragment>
                {
                  document ? 'Yes' : 'No'
                }
              </React.Fragment>
            ),
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
          }
        },
        {
          name: 'supplierContractDoc',
          label: 'document',
          options: {
            filter: false,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenSupliersContractDocumentDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>---</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          label: 'Actions',
          name: 'Actions',
          options: {
            filter: false,
            sort: false,
            empty: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: '0',

                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
               
                left: 0,

                zIndex: 101
              }
            }),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {thelogedUser.userRoles[0].actionsNames.financialModule_suppliersContracts_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_suppliersContracts_delete ? (
                  <IconButton onClick={() => this.handleDelete(tableMeta)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                ) : null}
              </React.Fragment>
            )
          }
        }
      ]
    };
  }

  componentDidMount() {
    SuppliersContractService.getSuppliersContract().then(result => {
      this.setState({ datas: result.data });
    });
    FinancialCompanyService.getCompany().then(result => {
      this.setState({ companies: result.data });
    });
    ExternalSuppliersService.getExternalSuppliers().then(result => {
      this.setState({ externalSuppliers: result.data });
    });
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    ClientService.getClients().then(result => {
      this.setState({ clients: result.data.payload });
    });
    ContractService.getContract().then(result => {
      // eslint-disable-next-line array-callback-return
      this.setState({ contracts: result.data, contractsClient: result.data });
    });
    PurchaseOrderService.getPurchaseOrder().then(result => {
      this.setState({ purchaseOrders: result.data, purchaseOrdersClient: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

  handleOpenSupliersContractDocumentDialog = tableMeta => {
    console.log(tableMeta);
    const { datas } = this.state;
    const supplierContractSelected = datas.filter(
      supplierContract => supplierContract.supplierContractId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenSupplierContractDocument: true,
      supplierContractSelected
    });
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

    // eslint-disable-next-line react/sort-comp
    handleDetails = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
            + tableMeta.rowIndex;
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.datas[index].supplierContractId;
      SuppliersContractService.getSuppliersContractById(id).then(result => {
        this.setState({
          supplierContractId: id,
          name: result.data.name,
          codeContract: result.data.codeContract,
          codeSupplier: result.data.codeSupplier,
          changeFactor: result.data.changeFactor,
          currencyId: result.data.currency._id,
          contractTradeVolume: result.data.contractTradeVolume,
          contractTradeVolumeEuro: result.data.contractTradeVolumeEuro,
          document: result.data.document,
          externalSupplierId: result.data.type === 'external' ? result.data.externalSupplier._id : '',
          financialCompanyId: result.data.type === 'internal' ? result.data.financialCompany._id : '',
          type: result.data.type,
          typeClient: result.data.typeClient,
          clientId: result.data.client._id,
          contractId: result.data.typeClient === 'contract' ? result.data.financialContract._id : '',
          purchaseOrderId: result.data.typeClient === 'po' ? result.data.purchaseOrder._id : '',
          haveExternal: result.data.type === 'external',
          haveInternal: result.data.type === 'internal',
          poClient: result.data.typeClient === 'po',
          contractClient: result.data.typeClient === 'contract',
          openPopUp: true
        });
      });
    }

    handleDelete = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
            + tableMeta.rowIndex;
      this.setState({ openPopUpDelete: true });
      this.setState({ supplierContractToDeleteId: this.state.datas[index].supplierContractId });
    };

  deleteConfirmeSupplierContract= () => {
    const { supplierContractToDeleteId } = this.state;
    this.setState({ openPopUpDelete: false });
    // notification('danger', 'this company is used in other modules !');
    SuppliersContractService.deleteSuppliersContract(supplierContractToDeleteId).then(result => {
      if (result.status === 200) {
        notification('success', 'Supplier contract deleted');
      } else {
        notification('danger', 'Supplier contract not deleted');
      }
      this.setState({ datas: result.data });
    });
  };

  handleCloseDelete = () => {
    this.setState({ openPopUpDelete: false });
  };

    handleClose = () => {
      this.setState({ openPopUp: false });
    };

    // eslint-disable-next-line react/sort-comp
    readURI(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (ev) {
          this.setState({ document: ev.target.result });
        }.bind(this);
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    handleChangeLogo = e => {
      this.readURI(e);
    };

    handleSave = () => {
      const {
        supplierContractId, name, codeContract, codeSupplier, document, type, typeClient,
        currencyId, contractTradeVolume, contractTradeVolumeEuro, changeFactor, clientId, haveInternal, haveExternal
      } = this.state;
      let {
        externalSupplierId, financialCompanyId, purchaseOrderId, contractId
      } = this.state;
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
      const currency = { _id: currencyId };
      const client = { _id: clientId };
      let financialCompany = { _id: '' };
      let externalSupplier = { _id: '' };
      let purchaseOrder = { _id: '' };
      let financialContract = { _id: '' };
      if (financialCompanyId !== '') financialCompany = { _id: financialCompanyId };
      if (externalSupplierId !== '') externalSupplier = { _id: externalSupplierId };
      if (typeClient === 'contract') financialContract = { _id: contractId };
      if (typeClient === 'po') purchaseOrder = { _id: purchaseOrderId };
      const SuppliersContract = {
        supplierContractId,
        name,
        codeContract,
        codeSupplier,
        document,
        externalSupplier,
        financialCompany,
        type,
        typeClient,
        currency,
        contractTradeVolume,
        contractTradeVolumeEuro,
        changeFactor,
        client,
        purchaseOrder,
        financialContract,
        clientId,
        currencyId,
        financialCompanyId,
        externalSupplierId,
        purchaseOrderId,
        contractId
      };
      SuppliersContractService.updateSuppliersContract(SuppliersContract).then(result => {
        if (result.status === 200) {
          notification('success', 'supplier contract updated');
          SuppliersContractService.getSuppliersContract().then(result2 => {
            this.setState({ datas: result2.data, openPopUp: false });
          });
        }
      })
        .catch(err => notification('danger', err.response.data.errors));
      this.setState({ openPopUp: false });
    };

    handleChange = (ev) => {
      const {
        contractTradeVolume, currencies, changeFactor, externalSuppliers, companies, purchaseOrders, contracts
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
        if (ev.target.value === 'external') this.setState({ haveExternal: true, haveInternal: false, financialCompanyId: '' });
        else this.setState({ haveInternal: true, haveExternal: false, externalSupplierId: '' });
      }
      if (ev.target.name === 'externalSupplierId') {
        externalSuppliers.map(row => {
          if (row.externalSupplierId === ev.target.value) this.setState({ codeSupplier: row.code, financialCompanyId: '' });
          return null;
        });
      }
      if (ev.target.name === 'financialCompanyId') {
        companies.map(row => {
          if (row.financialCompanyId === ev.target.value) this.setState({ codeSupplier: row.code, externalSupplierId: '' });
          return null;
        });
      }
      if (ev.target.name === 'typeClient') {
        if (ev.target.value === 'contract') this.setState({ contractClient: true, poClient: false });
        else this.setState({ poClient: true, contractClient: false });
      }
      if (ev.target.name === 'clientId') {
        const tab1 = purchaseOrders; const tab2 = contracts;
        const tabClient = tab2.filter((row) => (row.client._id === ev.target.value));
        const tabPurchaseOrder = tab1.filter((row) => (row.client._id === ev.target.value));
        this.setState({ purchaseOrdersClient: tabPurchaseOrder, contractsClient: tabClient });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

  renderContractDocumentFile = () => {
    const { supplierContractSelected } = this.state;
    console.log(supplierContractSelected);
    return `data:${this.handleFileDataType(supplierContractSelected.supplierContractDocExtension)};base64,${supplierContractSelected.supplierContractDoc}`;
  };

  changePageContract = (offset) => {
    const { pageNumberContract } = this.state;
    this.setState({
      pageNumberContract: pageNumberContract + offset
    });
  }

  previousPageContract = () => {
    this.changePageContract(-1);
  }

  nextPageContract = () => {
    this.changePageContract(1);
  }

  onContractDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPagesContract: numPages,
      pageNumberContract: 1
    });
  };

  render() {
    const {
      columns, openPopUp, datas, openPopUpDelete,
      name, codeSupplier, companies, externalSuppliers, type, document,
      currencyId, contractTradeVolume, contractTradeVolumeEuro, currencies,
      haveExternal, haveInternal, externalSupplierId, financialCompanyId,
      contractClient, poClient, typeClient, clients, clientId, contractsClient, contractId, purchaseOrdersClient, purchaseOrderId, isOpenSupplierContractDocument,
      supplierContractSelected, numPagesContract, pageNumberContract
    } = this.state;
    const {
      logedUser
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.financialModule_suppliersContracts_export) {
      exportButton = true;
    }

    const excludeAttributes = ['supplierContractId','document','externalSupplier','currency','client','financialContract','supplierContractDocExtension'];
    const options = {
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      downloadOptions: { filename: 'Suppliers contract.csv' },
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={datas}
          url="/app/gestion-financial/Add-Suppliers-Contract"
          tooltip="Add New Supplier Contract"
          fileName="Suppliers contract"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_suppliersContracts_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_suppliersContracts_export}
        />
      )
    };

    return (
      <div>
        <MUIDataTable
          title="The Suppliers Contract List"
          data={datas}
          columns={columns}
          options={options}
        />
        <Dialog
          open={openPopUp}
          keepMounted
          scroll="paper"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-slide-title"> View Details</DialogTitle>
          <DialogContent dividers>
            <Grid
              container
              spacing={6}
              alignItems="flex-start"
              direction="row"
              justify="center"
            >
              <Grid item xs={12} md={6}>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={name}
                  required
                  fullWidth
                  onChange={this.handleChange}
                />
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
                      name="contractTradeVolume"
                      value={contractTradeVolume}
                      InputProps={{ inputProps: { min: 0 } }}
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
                <FormControl>
                  <input
                    style={{ display: 'none' }}
                    id="outlined-button-file-2"
                    type="file"
                    onChange={this.handleChangeLogo.bind(this)}
                  />
                  <FormLabel htmlFor="outlined-button-file-2">
                    <Button
                      fullWidth
                      variant="outlined"
                      component="span"
                      startIcon={<Image color="primary" />}
                    >
                        Document
                    </Button>
                  </FormLabel>
                </FormControl>
                <br />
                <br />
                {
                  document ? (
                    <Avatar alt="User Name" src={document} />
                  ) : (<div />)
                }
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
                            Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSave}
            >
                            save
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openPopUpDelete}
          keepMounted
          scroll="body"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-slide-title"> Delete supplier contract</DialogTitle>
          <DialogContent dividers>
              Are you sure you want to delete this supplier contract ?
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleCloseDelete}>
                Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.deleteConfirmeSupplierContract}
            >
                Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="xl"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenSupplierContractDocument}
        >
          <DialogTitle id="docList">Contract document</DialogTitle>
          <DialogContent>
            {supplierContractSelected && supplierContractSelected.supplierContractDoc && (
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
                  supplierContractSelected !== '' ? (
                    supplierContractSelected.supplierContractDocExtension === 'pdf' ? (
                      <>
                        <Document
                          file={this.renderContractDocumentFile()}
                          onLoadSuccess={this.onContractDocumentLoadSuccess}
                          onLoadError={console.error}
                        >
                          <Page pageNumber={pageNumberContract} />
                        </Document>
                        <div>
                          <div className="pagec">
                                    Page
                            {' '}
                            {pageNumberContract || (numPagesContract ? 1 : '--')}
                            {' '}
                                    of
                            {' '}
                            {numPagesContract || '--'}
                          </div>
                          <div className="buttonc">
                            <button
                              type="button"
                              disabled={pageNumberContract <= 1}
                              onClick={this.previousPageContract}
                              className="Pre"

                            >
                                      Previous
                            </button>
                            <button
                              type="button"
                              disabled={pageNumberContract >= numPagesContract}
                              onClick={this.nextPageContract}
                            >
                                      Next
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img src={this.renderContractDocumentFile()} alt="Document" />
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
              onClick={this.handleCloseContractDocumentDialog}
              color="primary"
            >
                Close
            </Button>
            <Button onClick={this.handleDownloadContractDocument} color="primary">
                Download
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = () => ({
  logedUser: localStorage.getItem('logedUser'),
});
const PurchaseOrderMapped = connect(
  mapStateToProps,
  null
)(SuppliersContractBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <PurchaseOrderMapped changeTheme={changeTheme} classes={classes} />;
};
