import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
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
import PublishIcon from '@material-ui/icons/Publish';
import Tooltip from '@material-ui/core/Tooltip';
import ExternalSuppliersService from '../../../Services/ExternalSuppliersService';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import SuppliersPaymentService from '../../../Services/SuppliersPaymentService';
import { ThemeContext } from '../../../App/ThemeWrapper';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import ClientService from '../../../Services/ClientService';
import ContractService from '../../../Services/ContractService';
import PurchaseOrderService from '../../../Services/PurchaseOrderService';
import CurrencyService from '../../../Services/CurrencyService';
import notification from '../../../../components/Notification/Notification';
import TypeOfCurrencylService from '../../../Services/TypeOfCurrencylService';
import Transition from '../../../../components/Transition/transition';
import excelIcon from '../../../../api/images/wordIcone.png';
import styles from '../../AbsenceRequest/absenceRequest-jss';
import contactByOperationReducer from '../../../../redux/contactByOperation/reducer';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const useStyles = makeStyles(styles);
const inputSupplierPaymentsDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'docx'];
class SuppliersPaymentBlock extends React.Component {
  constructor(props) {
    super(props);
    // eslint-disable-next-line react/destructuring-assignment,react/prop-types
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      openPopUpDelete: false,
      supplierPaymentToDeleteId: '',
      suppliersPaymentSelected: {},
      supplierPaymentDoc: {},
      supplierPaymentDocExtension: '',
      numPagesSupplier: null,
      pageNumberSupplier: null,
      isOpenSuppliersPaymentDocument: false,
      externalSupplierId: '',
      codeContract: '',
      codeSupplier: '',
      clients: [],
      clientId: '',
      contracts: [],
      contractsClient: [],
      contractId: '',
      purchaseOrders: [],
      purchaseOrdersClient: [],
      purchaseOrderId: '',
      currencies: [],
      currencyId: '',
      changeFactor: 0,
      contractTradeVolume: 0,
      contractTradeVolumeEuro: 0,
      supplierBill: '',
      paymentDate: new Date(),
      reelPaymentDate: new Date(),
      companies: [],
      externalSuppliers: [],
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
          label: 'supplierPaymentId ',
          name: 'supplierPaymentId',
          options: {
            display: false,
            filter: false
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
          name: 'purchaseOrder.purchaseNumber',
          options: {
            filter: true,
            customBodyRender: (purchaseNumber) => (
              <React.Fragment>
                {
                  purchaseNumber || '---'
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
          label: 'Payment Date ',
          name: 'paymentDate',
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
            customBodyRender: (value) => (
              <React.Fragment>
                {
                  value ? value.toString().slice(0, 10) : ''
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Reel Payment Date',
          name: 'reelPaymentDate',
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
            customBodyRender: (value) => (
              <React.Fragment>
                {
                  value ? value.toString().slice(0, 10) : ''
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Supplier Bill Doc',
          name: 'supplierPaymentDoc',
          options: {
            filter: true,
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenContractDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_suppliersPayments_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_suppliersPayments_delete ? (
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
    SuppliersPaymentService.getSuppliersPayment().then(result => {
      this.setState({ datas: result.data });
    });
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
      // eslint-disable-next-line array-callback-return
      this.setState({ contracts: result.data, contractsClient: result.data });
    });
    PurchaseOrderService.getPurchaseOrder().then(result => {
      this.setState({ purchaseOrders: result.data, purchaseOrdersClient: result.data });
    });
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

  base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

 handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  }
    // eslint-disable-next-line react/sort-comp
    handleDetails = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
            + tableMeta.rowIndex;
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.datas[index].supplierPaymentId;
      SuppliersPaymentService.getSuppliersPaymentById(id).then(result => {
      //  console.log(new File([this.base64ToArrayBuffer(result.data.supplierPaymentDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(result.data.supplierPaymentDocExtension), lastModified: new Date() }));
        this.setState({
          supplierPaymentId: id,
          codeSupplier: result.data.codeSupplier,
          supplierBill: result.data.supplierBill,
          currencyId: result.data.currency._id,
          changeFactor: result.data.changeFactor,
          contractTradeVolume: result.data.contractTradeVolume,
          contractTradeVolumeEuro: result.data.contractTradeVolumeEuro,
          paymentDate: result.data.paymentDate ? result.data.paymentDate.toString().slice(0, 10) : '---',
          reelPaymentDate: result.data.reelPaymentDate ? result.data.reelPaymentDate.toString().slice(0, 10) : '---',
          externalSupplierId: result.data.type === 'external' ? result.data.externalSupplier._id : '',
          financialCompanyId: result.data.type === 'internal' ? result.data.financialCompany._id : '',
          type: result.data.type,
          typeClient: result.data.typeClient,
          clientId: result.data.client._id,
          contractId: (result.data.typeClient === 'contract' && result.data.financialContract !== null) ? result.data.financialContract._id : '',
          purchaseOrderId: (result.data.typeClient === 'po' && result.data.purchaseOrder !== null) ? result.data.purchaseOrder._id : '',
          haveExternal: result.data.type === 'external',
          haveInternal: result.data.type === 'internal',
          poClient: result.data.typeClient === 'po',
          contractClient: result.data.typeClient === 'contract',
          openPopUp: true,
          supplierPaymentDoc: (typeof result.data.supplierPaymentDoc !== 'undefined' && result.data.supplierPaymentDoc !== null) ? new File([this.base64ToArrayBuffer(result.data.supplierPaymentDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(result.data.supplierPaymentDocExtension), lastModified: new Date() }) : {},
          supplierPaymentDocExtension: typeof result.data.supplierPaymentDocExtension !== 'undefined' ? result.data.supplierPaymentDocExtension : '',
        });
      });
    }

    handleDelete = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
            + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.datas[index].supplierPaymentId;
      // eslint-disable-next-line array-callback-return,react/destructuring-assignment
      this.setState({ openPopUpDelete: true });
      this.setState({ supplierPaymentIdDelete: id });

    };
    deleteConfirmeSupplierPayment= () => {
      const { supplierPaymentIdDelete } = this.state;
      this.setState({ openPopUpDelete: false });
      // notification('danger', 'this company is used in other modules !');
      SuppliersPaymentService.deleteSuppliersPayment(supplierPaymentIdDelete ).then(result => {
        if (result.status === 200) {
          notification('success', 'Supplier payment deleted');
        } else {
          notification('danger', 'Supplier payment not deleted');
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
          this.setState({ supplierBill: ev.target.result });
        }.bind(this);
        reader.readAsDataURL(e.target.files[0]);
      }
    }

    handleChangeLogo = e => {
      this.readURI(e);
    };

  handleOpenContractDocumentListDialog = tableMeta => {
    const { datas } = this.state;
    const suppliersPaymentSelected = datas.filter(
      suppliersPayment => suppliersPayment.supplierPaymentId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenSuppliersPaymentDocument: true,
      suppliersPaymentSelected
    });
  };

    handleSave = () => {
      const {
        supplierPaymentId, codeSupplier, supplierBill, type, typeClient,
        clientId, reelPaymentDate, paymentDate,
        currencyId, contractTradeVolume, contractTradeVolumeEuro, changeFactor, haveExternal, haveInternal,
        supplierPaymentDocExtension, supplierPaymentDoc
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
      const supplierPaymentUpdateRequest = {
        supplierPaymentId,
        codeSupplier,
        currency,
        supplierBill,
        externalSupplier,
        financialCompany,
        type,
        typeClient,
        changeFactor,
        contractTradeVolume,
        contractTradeVolumeEuro,
        client,
        purchaseOrder,
        financialContract,
        paymentDate: new Date(paymentDate),
        reelPaymentDate: new Date(reelPaymentDate),
        clientId,
        currencyId,
        financialCompanyId,
        externalSupplierId,
        purchaseOrderId,
        contractId,
        supplierPaymentDocExtension
      };
      const formData = new FormData();
      /* console.log(supplierPaymentDoc);
      let blob = {};
      if ((supplierPaymentDocExtension != null || supplierPaymentDocExtension !== '')) {
        blob = new Blob([supplierPaymentDoc], { type: this.handleFileDataType(supplierPaymentDocExtension) });
      } */
      // const f = new File([supplierPaymentDoc], 'testdeclaration.pdf', { type: this.handleFileDataType(supplierPaymentDocExtension), lastModified: new Date() });
      // console.log(f);
      if (supplierPaymentDoc.constructor === File) {
        formData.append('supplierPaymentDoc', supplierPaymentDoc);
      } else {
        formData.append(
          'supplierPaymentDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
      }
      Object.keys(supplierPaymentUpdateRequest).forEach(e => formData.append(e, supplierPaymentUpdateRequest[e]));
      SuppliersPaymentService.updateSuppliersPayment(formData).then(result => {
        if (result.status === 200) {
          notification('success', 'Suppliers payment currency updated');
          SuppliersPaymentService.getSuppliersPayment().then(result2 => {
            this.setState({ datas: result2.data, openPopUp: false });
          });
        }
      })
        .catch(err => notification('danger', err.response.data.errors));
    };

    handleChange = (ev) => {
      const {
        changeFactor, contractTradeVolume, currencies, externalSuppliers, companies, purchaseOrders, contracts
      } = this.state;

      if (ev.target.name === 'currencyId') {
        const tradeValue = contractTradeVolume;
        currencies.map(currency => {
          if (currency.currencyId === ev.target.value) {
            this.setState({ contractTradeVolumeEuro: tradeValue * changeFactor, changeFactor });
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
        const tab1 = purchaseOrders; const tab2 = contracts;
        const tabClient = tab2.filter((row) => (row.client._id === ev.target.value));
        const tabPurchaseOrder = tab1.filter((row) => (row.client._id === ev.target.value));
        this.setState({ purchaseOrdersClient: tabPurchaseOrder, contractsClient: tabClient });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

  onContractDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPagesSupplier: numPages,
      pageNumberSupplier: 1
    });
  };

  renderContractDocumentFile = () => {
    const { suppliersPaymentSelected } = this.state;
    return `data:${this.handleFileDataType(suppliersPaymentSelected.supplierPaymentDocExtension)};base64,${suppliersPaymentSelected.supplierPaymentDoc}`;
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
      case 'docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
  };

  changePageSupplierPayment = (offset) => {
    const { pageNumberSupplier } = this.state;
    this.setState({
      pageNumberSupplier: pageNumberSupplier + offset
    });
  }

  previousPageSupplierPayment = () => {
    this.changePageSupplierPayment(-1);
  }

  nextPageSupplierPayment = () => {
    this.changePageSupplierPayment(1);
  }

  handleCloseSupplierDocumentDialog = () => {
    this.setState({
      isOpenSuppliersPaymentDocument: false,
      suppliersPaymentSelected: {}
    });
  };

  handleDownloadSupplierPaymentDocument = () => {
    const { suppliersPaymentSelected } = this.state;
    const doc = suppliersPaymentSelected.supplierPaymentDoc;
    const docName = `${suppliersPaymentSelected.codeSupplier}_Supplier payment document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(suppliersPaymentSelected.supplierPaymentDocExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
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

  renderFile = () => {
    const { supplierPaymentDoc, supplierPaymentDocExtension } = this.state;
    return `data:${this.handleFileDataType(supplierPaymentDocExtension)};base64,${
      supplierPaymentDoc
    }`;
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

  handleUploadDocumentClick = () => {
    inputSupplierPaymentsDoc.current.value = '';
    inputSupplierPaymentsDoc.current.click();
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
    const {
      columns, openPopUp, datas,
      codeSupplier, companies, externalSuppliers, type, supplierBill, reelPaymentDate, paymentDate,
      haveExternal, haveInternal, externalSupplierId, financialCompanyId, suppliersPaymentSelected,
      numPagesSupplier, pageNumberSupplier,
      currencyId, contractTradeVolume, contractTradeVolumeEuro, currencies, isOpenSuppliersPaymentDocument,
      contractClient, poClient, typeClient, clients, clientId, contractsClient, contractId, purchaseOrdersClient, purchaseOrderId,
      supplierPaymentDoc, supplierPaymentDocExtension
    } = this.state;
    const {
      // eslint-disable-next-line react/prop-types
      logedUser, classes
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.financialModule_suppliersPayments_export) {
      exportButton = true;
    }

    const excludeAttributes = ['supplierPaymentId','supplierPaymentDoc','supplierPaymentDocExtension','externalSupplier','client','financialContract','currency'];
    const options = {
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      downloadOptions: { filename: 'Suppliers payment.csv' },
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={datas}
          url="/app/gestion-financial/Add Suppliers-Payment"
          tooltip="Add New Supplier Payment"
          fileName="Suppliers payment"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_suppliersPayments_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_suppliersPayments_export}
        />
      )
    };
    return (
      <div>
        <MUIDataTable
          title="The Suppliers Payment List"
          data={datas}
          columns={columns}
          options={options}
        />
        <Dialog
          maxWidth="xl"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenSuppliersPaymentDocument}
        >
          <DialogTitle id="docList">Suppliers payment document</DialogTitle>
          <DialogContent>
            {suppliersPaymentSelected && suppliersPaymentSelected.supplierPaymentDoc && (
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
                  suppliersPaymentSelected !== '' ? (
                    suppliersPaymentSelected.supplierPaymentDocExtension === 'pdf' ? (
                      <>
                        <Document
                          file={this.renderContractDocumentFile()}
                          onLoadSuccess={this.onContractDocumentLoadSuccess}
                          onLoadError={console.error}
                        >
                          <Page pageNumber={pageNumberSupplier} />
                        </Document>
                        <div>
                          <div className="pagec">
                                    Page
                            {' '}
                            {pageNumberSupplier || (numPagesSupplier ? 1 : '--')}
                            {' '}
                                    of
                            {' '}
                            {numPagesSupplier || '--'}
                          </div>
                          <div className="buttonc">
                            <button
                              type="button"
                              disabled={pageNumberSupplier <= 1}
                              onClick={this.previousPageSupplierPayment}
                              className="Pre"

                            >
                                      Previous
                            </button>
                            <button
                              type="button"
                              disabled={pageNumberSupplier >= numPagesSupplier}
                              onClick={this.nextPageSupplierPayment}
                            >
                                      Next
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      (suppliersPaymentSelected.supplierPaymentDocExtension === 'docx') ? (
                        <img src={excelIcon} alt="document" />
                      ) : (
                        <img src={this.renderContractDocumentFile()} alt="document" />
                      )
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
              onClick={this.handleCloseSupplierDocumentDialog}
              color="primary"
            >
                Close
            </Button>
            <Button onClick={this.handleDownloadSupplierPaymentDocument} color="primary">
                Download
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openPopUp}
          keepMounted
          scroll="paper"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth="md"
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
                {/* /////////////////////doc doc///////////////////// */}
                <Grid
                  container
                  spacing={3}
                  alignItems="flex-start"
                  direction="row"
                  justify="center"
                >
                  <Grid xs={6} md={6} sm={6}>
                    {/* <div
                    style={{
                      textAlign: 'center', opacity: '0.7'
                    }}
                  >
                    {supplierPaymentDoc && supplierPaymentDoc && (
                      <div>
                        {
                          supplierPaymentDoc !== '' ? (
                            supplierPaymentDocExtension === 'pdf' ? (
                              <Document
                                file={this.renderFile()}
                                onLoadSuccess={this.onDocumentLoadSuccess}
                                onLoadError={console.error}
                              />
                            ) : (
                              supplierPaymentDocExtension === 'docx' ? (
                                <img
                                  src={excelIcon}
                                  style={{
                                    maxWidth: 160, marginTop: 20
                                  }}
                                  alt="Document"
                                />
                              ) : (
                                <img
                                  src={this.renderFile()}
                                  style={{
                                    maxWidth: 160, marginTop: 20
                                  }}
                                  alt="Document"
                                />
                              )
                            )
                          ) : (
                            <div />
                          )
                        }
                      </div>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 20,
                        marginBottom: 0,
                        width: '100%'
                      }}
                    >
                      <IconButton
                        className={
                          supplierPaymentDoc.constructor === Object
                            ? classes.uploadAvatarEmpty
                            : classes.uploadAvatarDone
                        }
                        onClick={this.handleUploadDocClick}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <input
                            type="file"
                            id="file"
                            accept=".png, .jpg, .jpeg, .pdf, .tiff, .docx"
                            ref={inputSupplierPaymentsDoc}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={this.handleDocChange}
                          />
                          <PublishIcon
                            className={classes.uploadIcon}
                            color="secondary"
                          />
                          <Typography
                            variant="subtitle1"
                            className={classes.uploadText}
                          >
                            supplier payment
                          </Typography>
                        </div>
                      </IconButton>
                    </div>
                    <div
                      style={{
                        marginTop: 2,
                      }}
                    >
                      <Button variant="text" onClick={this.handleUploadDocDelete}>delete</Button>
                    </div>
                  </div> */}
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
                      <IconButton onClick={() => this.handleDeleteDoc()} style={{ marginTop: '13px' }}>
                        <DeleteIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
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
                  open={this.state.openPopUpDelete}
                  keepMounted
                  scroll="body"
                  onClose={this.handleClose}
                  aria-labelledby="alert-dialog-slide-title"
                  aria-describedby="alert-dialog-slide-description"
                  fullWidth
                  maxWidth="md"
                >
                  <DialogTitle id="alert-dialog-slide-title"> Delete supplier payment</DialogTitle>
                  <DialogContent dividers>
                      Are you sure you want to delete this supplier payment ?
                  </DialogContent>
                  <DialogActions>
                    <Button color="secondary" onClick={this.handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.deleteConfirmeSupplierPayment}
                    >
                        Delete
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
const SuppliersPaymentMapped = connect(
  mapStateToProps,
  null
)(SuppliersPaymentBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <SuppliersPaymentMapped changeTheme={changeTheme} classes={classes} />;
};
