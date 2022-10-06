import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import {
  Button,
  Dialog, DialogActions, DialogContent, DialogTitle, Grid
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { format } from 'date-fns';
import moment from 'moment';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import { Image } from '@material-ui/icons';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import EditContract from './editContract';
import ContractService from '../../../Services/ContractService';
import { ThemeContext } from '../../../App/ThemeWrapper';
// import styles from './contract-jss';
import styles from '../../AbsenceRequest/absenceRequest-jss';
import { getAllStateByCountry } from '../../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../../redux/city/actions';
import Transition from '../../../../components/Transition/transition';
import SuppliersContractService from '../../../Services/SuppliersContractService';
import notification from '../../../../components/Notification/Notification';
const useStyles = makeStyles(styles);

class ContractBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.cityPromiseResolve = () => {
    };
    this.statePromiseResolve = () => {
    };
    this.state = {
      isOpenEconomicalProposalDocument: false,
      numPagesInsure: null,
      pageNumberInsure: null,
      openPopUpDelete: false,
      contractToDeleteId: '',
      numPagesTechnicalProposal: null,
      pageNumberTechnicalProposal: null,

      numPagesEconomicalProposal: null,
      pageNumberEconomicalProposal: null,

      isOpenProposalOneDocument: false,
      isOpenTechnicalProposalDocument: false,
      proposalOneExtension: '',
      isOpenDocumentsList: false,
      isOpenProposalDocument: false,
      numPagesPurchaseOrder: null,
      pageNumberPurchaseOrder: null,
      numPagesContract: null,
      pageNumberContract: null,
      isOpenPurchaseOrderDocument: false,
      isOpenContractDocument: false,
      isOpenDocument: false,
      docExtension: '',
      contractDocExtension: '',
      absenceRequestSelected: {},
      financialContractSelected: {},
      openPopUp: false,
      contract: {},
      datas: [],
      columns: [
        {
          label: 'financialContractId ',
          name: 'financialContractId',
          options: {
            viewColumns: false,
            display: false,
            filter: false
          }
        },
        {
          label: ' ',
          name: 'isActive',
          options: {
            customBodyRender: (value) => (
              <React.Fragment>
                <IconButton>
                  <RadioButtonUncheckedIcon style={{
                    backgroundColor: value === 'Yes' ? 'green' : (value === 'Zombie' ? 'gray' : 'red'),
                    color: value === 'Yes' ? 'green' : (value === 'Zombie' ? 'gray' : 'red'),
                    borderRadius: '100%'
                  }}
                  />
                </IconButton>
              </React.Fragment>
            )
          }
        },
        {
          label: 'Title',
          name: 'contractTitle',
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
            })
          }
        },
        {
          name: 'contractDoc',
          label: 'contract document',
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
                    onClick={() => this.handleOpenContractDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          name: 'client.name',
          label: 'Client',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          name: 'commercialOperation.name',
          label: 'Operation',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Company',
          name: 'financialCompany.name',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Contract status',
          name: 'contractStatus.statusName',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Payments BD per day',
          name: 'paymentsBDDays',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Signed Date',
          name: 'signedDate',
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
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Start Date',
          name: 'startDate',
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
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'endDate',
          label: 'end Date',
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
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'finalReelDate',
          label: 'Real End Date',
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
                  (value === 'null' || value === undefined) ? '***' : moment(new Date(value)).format('DD/MM/YYYY') /* moment(value).format('DD/MM/YYYY') */
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'duration',
          label: 'Duration',
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
            })
          }
        },
        {
          name: 'conceptTotalAmount',
          label: 'Amount ',
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
            })
          }
        },
        {
          label: 'Currency',
          name: 'currency.typeOfCurrency.currencyCode',
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
                { value }
              </React.Fragment>
            )
          }
        },
        {
          name: 'conceptTotalAmountEuro',
          label: 'Amount (€)',
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
            })
          }
        },
        {
          name: 'penaltyValue',
          label: 'penalties',
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
            customBodyRender: (penaltyValue) => (
              <React.Fragment>
                { penaltyValue.length > 1 ? 'Yes' : 'No' }
              </React.Fragment>
            )
          }
        },
        {
          name: 'amountInsured',
          label: 'Insurance',
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
            customBodyRender: (amountInsured) => (
              <React.Fragment>
                { amountInsured > 0 ? 'Yes' : 'No' }
              </React.Fragment>
            )
          }
        },
        {
          name: 'insureDocumentations',
          label: 'Insurance Documentations',
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
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          name: 'purchaseOrderNumber',
          label: 'Purchase Order',
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
            customBodyRender: (purchaseOrderNumber) => (
              <React.Fragment>
                { purchaseOrderNumber.length > 1 ? 'Yes' : 'No' }
              </React.Fragment>
            )
          }
        },
        {
          name: 'purchaseOrderDoc',
          label: 'purchase order Document',
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
                    onClick={() => this.handleOpenPurchaseOrderDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          name: 'proposalOneDoc',
          label: ' proposal document',
          options: {
            filter: false,
            sort: false,
            empty: false,
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
                {typeof value !== 'undefined' || typeof tableMeta.rowData[23] !== 'undefined' || typeof tableMeta.rowData[24] !== 'undefined' ? (
                /*  {value && value[0]  ? ( */
                  <IconButton
                    onClick={() => this.handleOpenProposalDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          name: 'proposalEconomicalDoc',
          label: 'Economical proposal document',
          options: {
            display: false,
          }
        },
        {
          name: 'proposalTechnicalDoc',
          label: 'Technical proposal document',
          options: {
            display: false,
          }
        },
        {
          name: 'Actions',
          label: ' Actions',
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_contracts_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_contracts_delete ? (
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
    ContractService.getContract().then(result => {
      // eslint-disable-next-line array-callback-return
      result.data.map(row => {
        const date1 = new Date(row.finalReelDate);
        const date2 = new Date(row.startDate);
        if (row.finalReelDate === 'null') {
          row.duration = '--';
        } else {
          const durationS = date1.getTime() - date2.getTime();
          const durationM = Math.round(((durationS / 86400000) / 30) + 0.4);
          row.duration = durationM;
        }
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length > 1) row.isActive = 'Yes';
        if (row.purchaseOrderNumber.length <= 1) row.isActive = 'No';
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length === 0) row.isActive = 'Zombie';
      });
      this.setState({ datas: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

  handleDetails = (tableMeta) => {
    const { getAllStateByCountry, getAllCityByState } = this.props;
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const id = this.state.datas[index].financialContractId;
    ContractService.getContractById(id).then(result => {
      const contract = result.data;

      new Promise((resolve1) => {
        getAllStateByCountry(contract.address.city.stateCountry.country.countryId);
        this.statePromiseResolve = resolve1;
      }).then((resultState) => {
        new Promise((resolve2) => {
          getAllCityByState(contract.address.city.stateCountry._id);
          this.cityPromiseResolve = resolve2;
        }).then((resultCity) => {
          this.setState({ openPopUp: true, contract });
        });
      });
    });
  }

  handleDelete = (tableMeta) => {
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
          + tableMeta.rowIndex;
    this.setState({ openPopUpDelete: true });
    this.setState({ contractToDeleteId: this.state.datas[index].financialContractId });
  };

    handleCloseDelete = () => {
      this.setState({ openPopUpDelete: false });
    };

  handleClose = () => {
    this.setState({ openPopUp: false });
  };

  myCallback = (dataFromChild) => {
    ContractService.getContract().then(result => {
      // eslint-disable-next-line array-callback-return
      result.data.map(row => {
        const date1 = new Date(row.finalReelDate);
        const date2 = new Date(row.startDate);
        if (row.finalReelDate === 'null') {
          row.duration = '--';
        } else {
          const durationS = date1.getTime() - date2.getTime();
          const durationM = Math.round(((durationS / 86400000) / 30) + 0.4);
          row.duration = durationM;
        }
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length > 1) row.isActive = 'Yes';
        if (row.purchaseOrderNumber.length <= 1) row.isActive = 'No';
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length === 0) row.isActive = 'Zombie';
      });
      this.setState({ datas: result.data, openPopUp: dataFromChild });
    });
  };

  myCallbackClose = () => {
    this.setState({ openPopUp: false });
  }

  myCallback2 = () => {
    ContractService.getContract().then(result => {
      // eslint-disable-next-line array-callback-return
      result.data.map(row => {
        const date1 = new Date(row.finalReelDate);
        const date2 = new Date(row.startDate);
        if (row.finalReelDate === 'null') {
          row.duration = '--';
        } else {
          const durationS = date1.getTime() - date2.getTime();
          const durationM = Math.round(((durationS / 86400000) / 30) + 0.4);
          row.duration = durationM;
        }
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length > 1) row.isActive = 'Yes';
        if (row.purchaseOrderNumber.length <= 1) row.isActive = 'No';
        if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length === 0) row.isActive = 'Zombie';
      });
      this.setState({ datas: result.data });
    });
  };


  handleOpenDocumentDialog = index => {
    const { absenceRequestSelected } = this.state;
    this.setState({
      isOpenDocument: true,
      docExtension: absenceRequestSelected.docExtensionList[index],
      docIndex: index
    });
  };


  handleOpenProposalDocumentDialog = (proposal) => {
    if (proposal === 'proposalOneDoc') {
      this.setState({
        isOpenProposalOneDocument: true,
      });
    }
    if (proposal === 'proposalTechnicalDoc') {
      this.setState({
        isOpenTechnicalProposalDocument: true,
      });
    }
    if (proposal === 'proposalEconomicalDoc') {
      this.setState({
        isOpenEconomicalProposalDocument: true,
      });
    }
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

  renderFile = () => {
    const { absenceRequestSelected, docExtension, docIndex } = this.state;
    return `data:${this.handleFileDataType(docExtension)};base64,${
      absenceRequestSelected.insureDocumentations[docIndex]
    }`;
  };

  renderProposalOneFile = renderProposalOneFile => {
    const { financialContractSelected } = this.state;
    if (renderProposalOneFile === 'proposalOne') {
      return `data:${this.handleFileDataType(financialContractSelected.proposalOneExtension)};base64,${
        financialContractSelected.proposalOneDoc
      }`;
    }
    if (renderProposalOneFile === 'proposalTechnical') {
      return `data:${this.handleFileDataType(financialContractSelected.proposalTechnicalExtension)};base64,${
        financialContractSelected.proposalTechnicalDoc
      }`;
    }
    if (renderProposalOneFile === 'proposalEconomical') {
      return `data:${this.handleFileDataType(financialContractSelected.proposalEconomicalExtension)};base64,${
        financialContractSelected.proposalEconomicalDoc
      }`;
    }
  };

  renderContractDocumentFile = () => {
    const { financialContractSelected } = this.state;
    return `data:${this.handleFileDataType(financialContractSelected.contractDocExtension)};base64,${financialContractSelected.contractDoc}`;
  };


  renderPurchaseOrderDocumentFile = () => {
    const { financialContractSelected, contractDocExtension } = this.state;
    return `data:${this.handleFileDataType(contractDocExtension)};base64,${
      financialContractSelected.purchaseOrderDoc
    }`;
  };

  handleClose = () => {
    this.setState({
      isOpenDocumentsList: false,
    });
  };


  handleOpenDocumentListDialog = tableMeta => {
    const { datas } = this.state;
    const absenceRequestSelected = datas.filter(
      absenceRequest => absenceRequest.financialContractId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenDocumentsList: true,
      absenceRequestSelected
    });
  };

  handleOpenContractDocumentListDialog = tableMeta => {
    const { datas } = this.state;
    const financialContractSelected = datas.filter(
      financialContract => financialContract.financialContractId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenContractDocument: true,
      financialContractSelected
    });
  };

    handleOpenProposalDocumentListDialog = tableMeta => {
      const { datas } = this.state;
      const financialContractSelected = datas.filter(
        financialContract => financialContract.financialContractId === tableMeta.rowData[0]
      )[0];
      this.setState({
        isOpenProposalDocument: true,
        financialContractSelected
      });
    };

  handleOpenPurchaseOrderDocumentListDialog = tableMeta => {
    const { datas } = this.state;
    const financialContractSelected = datas.filter(
      financialContract => financialContract.financialContractId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenPurchaseOrderDocument: true,
      financialContractSelected
    });
  };


  handleCloseContractDocumentDialog = () => {
    this.setState({
      isOpenContractDocument: false,
      financialContractSelected: {}
    });
  };

  handleCloseProposalDocumentDialog = () => {
    this.setState({
      isOpenProposalDocument: false,
      financialContractSelected: {}
    });
  };

  handleClosePurchaseOrderDocumentDialog = () => {
    this.setState({
      isOpenPurchaseOrderDocument: false,
      financialContractSelected: {}
    });
  };

  onTechnicalProposalDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPagesTechnicalProposal: numPages,
      pageNumberTechnicalProposal: 1,
    });
  };

  onEconomicalProposalDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPagesEconomicalProposal: numPages,
      pageNumberEconomicalProposal: 1,
    });
  };

    onPurchaseOrderDocumentLoadSuccess = ({ numPages }) => {
      this.setState({
        numPagesPurchaseOrder: numPages,
        pageNumberPurchaseOrder: 1
      });
    };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPagesInsure: numPages,
      pageNumberInsure: 1
    });
  };

  changePageInsure = (offset) => {
    const { pageNumberInsure } = this.state;
    this.setState({
      pageNumberInsure: pageNumberInsure + offset
    });
  }

  previousPageInsure = () => {
    this.changePageInsure(-1);
  }

  nextPageInsure = () => {
    this.changePageInsure(1);
  }

    onContractDocumentLoadSuccess = ({ numPages }) => {
      this.setState({
        numPagesContract: numPages,
        pageNumberContract: 1
      });
    };

     changePage = (offset) => {
       const { pageNumberPurchaseOrder } = this.state;
       this.setState({
         pageNumberPurchaseOrder: pageNumberPurchaseOrder + offset
       });
     }

     previousPage = () => {
       this.changePage(-1);
     }

     nextPage = () => {
       this.changePage(1);
     }

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

  changePageProposal = (offset, proposal) => {
    const { pageNumberTechnicalProposal, pageNumberEconomicalProposal } = this.state;
    if (proposal === 'technicalProposal') {
      this.setState({
        pageNumberTechnicalProposal: pageNumberTechnicalProposal + offset
      });
    }
    if (proposal === 'economicalProposal') {
      this.setState({
        pageNumberEconomicalProposal: pageNumberEconomicalProposal + offset
      });
    }
  }

  previousPageProposal = (proposal) => {
    this.changePageProposal(-1, proposal);
  }

  nextPageProposal = (proposal) => {
    this.changePageProposal(1, proposal);
  }

  handleDownloadContractDocument = () => {
    const { financialContractSelected } = this.state;
    const doc = financialContractSelected.contractDoc;
    const docName = `${financialContractSelected.contractTitle}_Contract document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(financialContractSelected.contractDocExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  handleDownloadProposal = (proposal) => {
    const { financialContractSelected } = this.state;
    if (proposal === 'proposalOne') {
      const doc = financialContractSelected.contractDoc;
      const docName = `${financialContractSelected.contractTitle}_economical & technical proposal`;
      const documentBase64 = this.fileToBase64(doc);
      const documentBlob = new Blob([documentBase64], {
        type: this.handleFileDataType(financialContractSelected.contractDocExtension)
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(documentBlob);
      link.download = docName;
      link.click();
    }
    if (proposal === 'proposalTechnical') {
      const doc = financialContractSelected.proposalTechnicalDoc;
      const docName = `${financialContractSelected.contractTitle}_technical proposal`;
      const documentBase64 = this.fileToBase64(doc);
      const documentBlob = new Blob([documentBase64], {
        type: this.handleFileDataType(financialContractSelected.proposalEconomicalExtension)
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(documentBlob);
      link.download = docName;
      link.click();
    }
    if (proposal === 'proposalEconomical') {
      const doc = financialContractSelected.proposalEconomicalDoc;
      const docName = `${financialContractSelected.contractTitle}_economical proposal`;
      const documentBase64 = this.fileToBase64(doc);
      const documentBlob = new Blob([documentBase64], {
        type: this.handleFileDataType(financialContractSelected.contractDocExtension)
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(documentBlob);
      link.download = docName;
      link.click();
    }
  };

  handleDownloadPurchaseOrderDocument = () => {
    const { financialContractSelected } = this.state;
    const doc = financialContractSelected.purchaseOrderDoc;
    const docName = `${financialContractSelected.contractTitle}_Purchase order document`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(financialContractSelected.purchaseOrderDocExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  handleCloseDocumentListDialog = () => {
    this.setState({
      isOpenDocumentsList: false,
      absenceRequestSelected: {}
    });
  };

  handleCloseDocumentDialog = () => {
    this.setState({
      isOpenDocument: false,
      docExtension: '',
      docIndex: 0
    });
  };

  closeProposalOneDocumentDialog = () => {
    this.setState({
      isOpenProposalOneDocument: false,
      isOpenTechnicalProposalDocument: false,
      isOpenEconomicalProposalDocument: false,
    });
  };

  handleDownload = () => {
    const { absenceRequestSelected, docIndex, docExtension } = this.state;
    const doc = absenceRequestSelected.insureDocumentations[docIndex];
    // const docName = `${absenceRequestSelected.name}_Document`;
    const docName = `${docIndex + 1}_amount insured Document`;
    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(docExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

    deleteConfirmeContract= () => {
      const { contractToDeleteId } = this.state;
      ContractService.deleteContract(contractToDeleteId).then(result1 => {
        if (result1.status === 200) {
          notification('success', 'contract deleted');
        } else {
          notification('danger', 'contract not deleted');
        }
        ContractService.getContract().then(result => {
          // eslint-disable-next-line array-callback-return
          result.data.map(row => {
            const date1 = new Date(row.finalReelDate);
            const date2 = new Date(row.startDate);
            if (row.finalReelDate === 'null') {
              row.duration = '--';
            } else {
              const durationS = date1.getTime() - date2.getTime();
              const durationM = Math.round(((durationS / 86400000) / 30) + 0.4);
              row.duration = durationM;
            }
            if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length > 1) row.isActive = 'Yes';
            if (row.purchaseOrderNumber.length <= 1) row.isActive = 'No';
            if (row.purchaseOrderNumber.length > 1 && row.contractDocumentation.length === 0) row.isActive = 'Zombie';
          });
          this.setState({ datas: result.data });
        });
      }).catch(err => notification('danger', err.response.data.errors));
      this.setState({ openPopUpDelete: false });
    };

    render() {
      const {
        openPopUpDelete,
        datas, columns, openPopUp, contract, isOpenDocumentsList, absenceRequestSelected, isOpenDocument, docExtension, isOpenContractDocument, financialContractSelected,
        isOpenPurchaseOrderDocument, numPagesPurchaseOrder, pageNumberPurchaseOrder, numPagesContract, pageNumberContract, isOpenProposalDocument, isOpenProposalOneDocument,
        isOpenTechnicalProposalDocument, isOpenEconomicalProposalDocument, pageNumberTechnicalProposal, numPagesTechnicalProposal,
        numPagesEconomicalProposal, pageNumberEconomicalProposal, numPagesInsure,
        pageNumberInsure
      } = this.state;
      const {
        allStateCountrys, allCitys, logedUser, isLoadingCity, cityResponse, errorsCity, isLoadingState, stateCountryResponse, errorsState, classes
      } = this.props;
      const thelogedUser = JSON.parse(logedUser);
      let exportButton = false;
      if (thelogedUser.userRoles[0].actionsNames.financialModule_contracts_export) {
        exportButton = true;
      }
      (!isLoadingState && stateCountryResponse) && this.statePromiseResolve(stateCountryResponse);
      (!isLoadingState && !stateCountryResponse) && this.statePromiseResolve(errorsState);

      (!isLoadingCity && cityResponse) && this.cityPromiseResolve(cityResponse);
      (!isLoadingCity && !cityResponse) && this.cityPromiseResolve(errorsCity);

      const excludeAttributes = ['financialContractId','contractDocumentation','contractDocDescreption','insureDocumentation','purchaseOrderDocumentation','proposalDocumentation','proposalDocumentationDuo','conceptType','conceptValue','conceptValueEuro','conceptValueLocal','purchaseOrderNumber','penaltyQuantity','penaltyValue','penaltyCost','penaltyPer','penaltiesListe','purchaseOrders','contractDocumentations','nbrConcepts','financialCompany','client','commercialOperation','contractStatus','functionalStructureLevel','address','currency','docExtensionList','insureDocumentations','contractDocExtension','purchaseOrderDocExtension','proposalEconomicalExtension','proposalTechnicalExtension','proposalOneExtension'];

      const options = {
        fixedHeader: true,
        fixedSelectColumn: false,
        filter: true,
        selectableRows: "none",
        filterType: 'dropdown',
        responsive: 'stacked',
        download: exportButton,
        downloadOptions: { filename: 'Contracts.csv' },
        print: exportButton,
        rowsPerPage: 10,
        customToolbar: () => (
          <CustomToolbar
            csvData={datas}
            url="/app/gestion-financial/Add-Contract"
            tooltip="add new Contract"
            fileName="Contracts"
            excludeAttributes={excludeAttributes}
            hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_contracts_create}
            hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_contracts_export}
          />
        )
      };

      return (
        <div>
          <MUIDataTable
            title="Client Contracts List"
            data={datas}
            columns={columns}
            options={options}
          />
          <Dialog
            maxWidth="lg"
            TransitionComponent={Transition}
            fullWidth
            scroll="body"
            aria-labelledby="changeProfilePic"
            open={isOpenEconomicalProposalDocument}
          >
            <DialogTitle id="SaveFormula">Economical Proposal Document</DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {financialContractSelected && financialContractSelected.proposalEconomicalExtension !== '' ? (
                  financialContractSelected.proposalEconomicalExtension === 'pdf' ? (
                    <>
                      <Document
                        file={this.renderProposalOneFile('proposalEconomical')}
                        onLoadSuccess={this.onEconomicalProposalDocumentLoadSuccess}
                        onLoadError={console.error}
                      >
                        <Page pageNumber={pageNumberEconomicalProposal} />
                      </Document>
                      <div>
                        <div className="pagec">
                    Page
                          {' '}
                          {pageNumberEconomicalProposal || (numPagesEconomicalProposal ? 1 : '--')}
                          {' '}
                of
                          {' '}
                          {numPagesEconomicalProposal || '--'}
                        </div>
                        <div className="buttonc">
                          <button
                            type="button"
                            disabled={pageNumberEconomicalProposal <= 1}
                            onClick={() => this.previousPageProposal('economicalProposal')}
                            className="Pre"

                          >
                Previous
                          </button>
                          <button
                            type="button"
                            disabled={pageNumberEconomicalProposal >= numPagesEconomicalProposal}
                            onClick={() => this.nextPageProposal('economicalProposal')}
                          >
                Next
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={this.renderProposalOneFile('proposalEconomical')} alt="Document" />
                  )
                ) : (
                  <div />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.closeProposalOneDocumentDialog}
                color="primary"
              >
              Close
              </Button>
              <Button onClick={() => this.handleDownloadProposal('proposalEconomical')} color="primary">
              Download
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="lg"
            TransitionComponent={Transition}
            fullWidth
            scroll="body"
            aria-labelledby="changeProfilePic"
            open={isOpenTechnicalProposalDocument}
          >
            <DialogTitle id="SaveFormula">Technical proposal document</DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {financialContractSelected && financialContractSelected.proposalTechnicalExtension !== '' ? (
                  financialContractSelected.proposalTechnicalExtension === 'pdf' ? (
                    <>
                      <Document
                        file={this.renderProposalOneFile('proposalTechnical')}
                        onLoadSuccess={this.onTechnicalProposalDocumentLoadSuccess}
                        onLoadError={console.error}
                      >
                        <Page pageNumber={pageNumberTechnicalProposal} />
                      </Document>
                      <div>
                        <div className="pagec">
                    Page
                          {' '}
                          {pageNumberTechnicalProposal || (numPagesTechnicalProposal ? 1 : '--')}
                          {' '}
                of
                          {' '}
                          {numPagesTechnicalProposal || '--'}
                        </div>
                        <div className="buttonc">
                          <button
                            type="button"
                            disabled={pageNumberTechnicalProposal <= 1}
                            onClick={() => this.previousPageProposal('technicalProposal')}
                            className="Pre"

                          >
                Previous
                          </button>
                          <button
                            type="button"
                            disabled={pageNumberTechnicalProposal >= numPagesTechnicalProposal}
                            onClick={() => this.nextPageProposal('technicalProposal')}
                          >
                Next
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={this.renderProposalOneFile('proposalTechnical')} alt="Document" />
                  )
                ) : (
                  <div />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.closeProposalOneDocumentDialog}
                color="primary"
              >
              Close
              </Button>
              <Button onClick={() => this.handleDownloadProposal('proposalTechnical')} color="primary">
              Download
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="lg"
            TransitionComponent={Transition}
            fullWidth
            scroll="body"
            aria-labelledby="changeProfilePic"
            open={isOpenProposalOneDocument}
          >
            <DialogTitle id="SaveFormula">Proposal Document preview</DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {financialContractSelected && financialContractSelected.proposalOneExtension !== '' ? (
                  financialContractSelected.proposalOneExtension === 'pdf' ? (
                    <Document
                      file={this.renderProposalOneFile('proposalOne')}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                      onLoadError={console.error}
                    >
                      <Page pageNumber={1} />
                    </Document>
                  ) : (
                    <img src={this.renderProposalOneFile('proposalOne')} alt="Document" />
                  )
                ) : (
                  <div />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.closeProposalOneDocumentDialog}
                color="primary"
              >
              Close
              </Button>
              <Button onClick={() => this.handleDownloadProposal('proposalOne')} color="primary">
              Download
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="xl"
            TransitionComponent={Transition}
            fullWidth
            scroll="paper"
            aria-labelledby="changeProfilePic"
            open={isOpenPurchaseOrderDocument}
          /*       classes={{
              paper: classes.paper
            }} */
          >
            <DialogTitle id="docList">Purchase order document</DialogTitle>
            <DialogContent>
              {financialContractSelected && financialContractSelected.purchaseOrderDoc && (
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
                    financialContractSelected !== '' ? (
                      financialContractSelected.purchaseOrderDocExtension === 'pdf' ? (
                        <>
                          <Document
                            file={this.renderPurchaseOrderDocumentFile()}
                            onLoadSuccess={this.onPurchaseOrderDocumentLoadSuccess}
                            onLoadError={console.error}
                          >
                            <Page pageNumber={pageNumberPurchaseOrder} />
                          </Document>
                          <div>
                            <div className="pagec">
                             Page
                              {' '}
                              {pageNumberPurchaseOrder || (numPagesPurchaseOrder ? 1 : '--')}
                              {' '}
                              of
                              {' '}
                              {numPagesPurchaseOrder || '--'}
                            </div>
                            <div className="buttonc">
                              <button
                                type="button"
                                disabled={pageNumberPurchaseOrder <= 1}
                                onClick={this.previousPage}
                                className="Pre"

                              >
                           Previous
                              </button>
                              <button
                                type="button"
                                disabled={pageNumberPurchaseOrder >= numPagesPurchaseOrder}
                                onClick={this.nextPage}
                              >
                            Next
                              </button>
                            </div>
                          </div>
                        </>

                      ) : (
                        <img src={this.renderPurchaseOrderDocumentFile()} alt="Document" />
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
                onClick={this.handleClosePurchaseOrderDocumentDialog}
                color="primary"
              >
              Close
              </Button>
              <Button onClick={this.handleDownloadPurchaseOrderDocument} color="primary">
              Download
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="sm"
            TransitionComponent={Transition}
            fullWidth
            scroll="paper"
            aria-labelledby="changeProfilePic"
            open={isOpenProposalDocument}
          /*       classes={{
              paper: classes.paper
            }} */
          >
            <DialogTitle id="docList">Proposal documents preview</DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              />
              <Grid
                container
                spacing={1}
                alignItems="flex-start"
                direction="row"
              >
                { financialContractSelected.hasOwnProperty('proposalOneDoc') && (
                <>
                  <Grid item xs={8}>
                Technical & Economical
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      style={{ marginTop: '-9px' }}
                      onClick={() => this.handleOpenProposalDocumentDialog('proposalOneDoc')}
                    >
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                  </Grid>
                </>
                )}
                {/* ////////////// */}
                { financialContractSelected.hasOwnProperty('proposalTechnicalDoc') && (
                <>
                  <Grid item xs={8}>
                Technical proposal
                    {' '}
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      style={{ marginTop: '-9px' }}
                      onClick={() => this.handleOpenProposalDocumentDialog('proposalTechnicalDoc')}
                    >
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                  </Grid>
                </>
                )}
                {/* ////////////// */}
                {financialContractSelected.hasOwnProperty('proposalEconomicalDoc') && (
                <>
                  <Grid item xs={8}>
                Economical proposal
                    {' '}
                  </Grid>
                  <Grid item xs={4}>
                    <IconButton
                      style={{ marginTop: '-9px' }}
                      onClick={() => this.handleOpenProposalDocumentDialog('proposalEconomicalDoc')}
                    >
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                  </Grid>
                </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleCloseProposalDocumentDialog}
                color="primary"
              >
              Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="xl"
            TransitionComponent={Transition}
            fullWidth
            scroll="paper"
            aria-labelledby="changeProfilePic"
            open={isOpenContractDocument}
          /*       classes={{
            paper: classes.paper
          }} */
          >
            <DialogTitle id="docList">Contract document</DialogTitle>
            <DialogContent>
              {financialContractSelected && financialContractSelected.contractDoc && (
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
                    financialContractSelected !== '' ? (
                      financialContractSelected.contractDocExtension === 'pdf' ? (
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
          <Dialog
            maxWidth="xs"
            TransitionComponent={Transition}
            fullWidth
            scroll="paper"
            aria-labelledby="changeProfilePic"
            open={isOpenDocumentsList}
            /*  classes={{
            paper: classes.paper
          }} */
          >
            <DialogTitle id="docList">Insurance documents</DialogTitle>
            <DialogContent>
              {absenceRequestSelected && absenceRequestSelected.insureDocumentations && (
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                  }}
                >
                  {absenceRequestSelected.insureDocumentations.map((doc, index) => (
                    <Grid
                      container
                      spacing={3}
                      alignItems="flex-start"
                      direction="row"
                    >
                      <Grid item xs={8}>
                     Amount insured doc
                        {' '}
                        {index + 1}
                      </Grid>
                      <Grid item xs={4}>
                        <IconButton
                          style={{ marginTop: '-9px' }}
                          onClick={() => this.handleOpenDocumentDialog(index)}
                        >
                          <VisibilityIcon color="secondary" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleCloseDocumentListDialog}
                color="primary"
              >
              Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            maxWidth="lg"
            TransitionComponent={Transition}
            fullWidth
            scroll="body"
            aria-labelledby="changeProfilePic"
            open={isOpenDocument}
          /* classes={{
            paper: classes.paper
          }} */
          >
            <DialogTitle id="SaveFormula">Insurance preview</DialogTitle>
            <DialogContent>
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {absenceRequestSelected && docExtension !== '' ? (
                  docExtension === 'pdf' ? (
                    <>
                      <Document
                        file={this.renderFile()}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                        onLoadError={console.error}
                      >
                        <Page pageNumber={pageNumberInsure} />
                      </Document>
                      <div>
                        <div className="pagec">
                    Page
                          {' '}
                          {pageNumberInsure || (numPagesInsure ? 1 : '--')}
                          {' '}
                of
                          {' '}
                          {numPagesInsure || '--'}
                        </div>
                        <div className="buttonc">
                          <button
                            type="button"
                            disabled={pageNumberInsure <= 1}
                            onClick={this.previousPageInsure}
                            className="Pre"

                          >
                Previous
                          </button>
                          <button
                            type="button"
                            disabled={pageNumberInsure >= numPagesInsure}
                            onClick={this.nextPageInsure}
                          >
                Next
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <img src={this.renderFile()} alt="Document" />
                  )
                ) : (
                  <div />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                autoFocus
                onClick={this.handleCloseDocumentDialog}
                color="primary"
              >
              Close
              </Button>
              <Button onClick={this.handleDownload} color="primary">
              Download
              </Button>
            </DialogActions>
          </Dialog>


          <Dialog
            open={openPopUp}
            keepMounted
            scroll="body"
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth={false}
            maxWidth={false}
          >
            <DialogTitle id="alert-dialog-slide-title"> View Details</DialogTitle>
            <DialogContent dividers>
              <EditContract
                classes={classes}
                Info={contract}
                allStateCountrys={allStateCountrys}
                allCitys={allCitys}
                callbackFromParent={this.myCallback}
                callbackFromParent2={this.myCallback2}
                callbackFromParentCloseEdit={this.myCallbackClose}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={openPopUpDelete}
            keepMounted
            scroll="body"
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            fullWidth
            maxWidth="xs"
          >
            <DialogTitle id="alert-dialog-slide-title"> Delete contract</DialogTitle>
            <DialogContent dividers>
                  Are you sure you want to delete this contract ?
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={this.handleCloseDelete}>
                      Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={this.deleteConfirmeContract}
              >
                      Delete
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
}

const mapStateToProps = (state) => ({
  // country
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
  logedUser: localStorage.getItem('logedUser'),
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllStateByCountry,
    getAllCityByState
  },
  dispatch
);
const ContractBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps,
  null
)(ContractBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <ContractBlockMapped changeTheme={changeTheme} classes={classes} />;
};
