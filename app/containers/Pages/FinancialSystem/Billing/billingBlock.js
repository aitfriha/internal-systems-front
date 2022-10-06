import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import {
  Dialog, DialogContent, DialogTitle,
  CircularProgress, Typography, DialogActions, Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import BillService from '../../../Services/BillService';
import EditBill from './editBill';
import { ThemeContext } from '../../../App/ThemeWrapper';

class BillingBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      openPopUpDelete: false,
      billToDeleteId: '',
      openPopUp: false,
      datas: [],
      bill: {},
      columns: [
        {
          label: ' ',
          name: 'state',
          options: {
            customBodyRender: (value) => (
              <React.Fragment>
                <IconButton>
                  <RadioButtonUncheckedIcon style={{
                    backgroundColor: value === 'Yes' ? 'green' : (value === 'Zombie' ? 'orange' : 'red'),
                    color: value === 'Yes' ? 'green' : (value === 'Zombie' ? 'orange' : 'red'),
                    borderRadius: '100%'
                  }}
                  />
                </IconButton>
              </React.Fragment>
            )
          },
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
        },
        {
          name: 'code',
          label: 'Code',
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
          name: 'invoiceNumber',
          label: 'invoice Number',
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
          name: 'invoiceDate',
          label: 'Invoice Date',
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
          name: 'registerDate',
          label: 'Registration date',
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
                  /* value ? value.toString().slice(0, 10) : '' */
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'paymentsBDDay',
          label: 'Payment Days',
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
          name: 'paymentDate',
          label: 'Payment Date',
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
                  /* value ? value.toString().slice(0, 10) : '' */
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'delayDays',
          label: 'Delay days',
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
                /*  value ? value.toString().slice(0, 10) : '' */
                  (value === '' || value === undefined) ? null : value
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'reelPaymentDay',
          label: 'Real Payment Date',
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
          name: 'reelPaymentDays',
          label: 'Real Payment Days',
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
                /*  value === 0 ? '' : value */
                  (value === '' || value === undefined) ? null : value
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'paymentDone',
          label: 'Payment Done ?',
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
                  value ? 'Yes' : 'No'
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Contractor',
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
            customBodyRender: (financialCompany) => (
              <React.Fragment>
                {
                  financialCompany
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Client',
          name: 'client.name',
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
            customBodyRender: (name) => (
              <React.Fragment>
                {
                  name || ''
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Operation',
          name: 'commercialOperation.name',
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
            customBodyRender: (name) => (
              <React.Fragment>
                {
                  name
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Client Signed',
          name: 'clientSigned.name',
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
            customBodyRender: (name) => (
              <React.Fragment>
                {
                  name
                }
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
            })
          }
        },
        {
          name: 'totalLocal',
          label: 'Amount (Without IVA)',
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
          name: 'currency.typeOfCurrency.currencyCode',
          label: 'Currency',
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
            customBodyRender: (currency) => (
              <React.Fragment>
                {
                  currency
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'totalEuro',
          label: 'Amount € (Without IVA)',
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
          name: 'iva.value',
          label: 'IVA %',
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
            customBodyRender: (iva) => (
              <React.Fragment>
                {
                  iva || ''
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'valueIVAEuro',
          label: 'Total IVA (€)',
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
          name: 'valueIVALocal',
          label: 'Total IVA (L)',
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
          name: 'totalAmountLocal',
          label: 'Total Amount (L)',
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
          name: 'totalAmountEuro',
          label: 'Total Amount (€)',
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_billingManagement_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_billingManagement_delete ? (
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
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
    BillService.getBill().then(result => {
      const today = new Date();
      // eslint-disable-next-line array-callback-return
      result.data.map(row => {
        if (row.paymentDone) row.state = 'Yes';
        if (today.getTime() < (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'Zombie';
        if (today.getTime() > (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'No';
      });
      this.setState({ datas: result.data });
    });
  }

  // eslint-disable-next-line react/sort-comp
  handleDetails = (tableMeta) => {
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const id = this.state.datas[index].billId;
    BillService.getBillById(id).then(result => {
      const bill = result.data;
      this.setState({ openPopUp: true, bill });
    });
  }

  handleDelete = (tableMeta) => {
    const { datas } = this.state;
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
        + tableMeta.rowIndex;
    this.setState({ openPopUpDelete: true });
    this.setState({ billToDeleteId: datas[index].billId });
    /* BillService.deleteBill(id).then(result => {
      const today = new Date();
      result.data.map(row => {
        if (row.paymentDone) row.state = 'Yes';
        if (today.getTime() < (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'Zombie';
        if (today.getTime() > (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'No';
      });
      this.setState({ datas: result.data });
    }); */
  };

  deleteConfirmeContract= () => {
    const { billToDeleteId } = this.state;
    BillService.deleteBill(billToDeleteId).then(result => {
      const today = new Date();
      result.data.map(row => {
        if (row.paymentDone) row.state = 'Yes';
        if (today.getTime() < (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'Zombie';
        if (today.getTime() > (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'No';
      });
      this.setState({ datas: result.data });
    });
    this.setState({ openPopUpDelete: false });
  };

    handleClose = () => {
      this.setState({ openPopUp: false });
    };

  myCallback = (dataFromChild) => {
    BillService.getBill().then(result => {
      const today = new Date();
      // eslint-disable-next-line array-callback-return
      result.data.map(row => {
        if (row.paymentDone) row.state = 'Yes';
        if (today.getTime() < (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'Zombie';
        if (today.getTime() > (new Date(row.paymentDate).getTime()) && !row.paymentDone) row.state = 'No';
      });
      this.setState({ datas: result.data, openPopUp: dataFromChild });
    });
  };

  myCallback2 = () => {
    this.setState({ openPopUp: false });
  };

  handleCloseDelete = () => {
    this.setState({ openPopUpDelete: false });
  };

  render() {
    const {
      datas, columns, openPopUp, bill, openPopUpDelete
    } = this.state;
    const {
      logedUser
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.financialModule_billingManagement_export) {
      exportButton = true;
    }
    const comops = JSON.parse(JSON.stringify(datas));
    comops.forEach((v) => {
      v.invoiceDate = v.invoiceDate === '' ? '' : v.invoiceDate.toString().slice(0, 10);
      v.registerDate = v.registerDate === '' ? '' : v.registerDate.toString().slice(0, 10);
      v.paymentDate = v.paymentDate === '' ? '' : v.paymentDate.toString().slice(0, 10);
      v.delayDays = v.delayDays === '' ? '' : v.delayDays;
      v.reelPaymentDay = (v.reelPaymentDay === '' || v.reelPaymentDay === undefined) ? '' : v.reelPaymentDay.toString().slice(0, 10);
      v.iva = v.iva.value === '' ? '' : v.iva.value;
      v.currency = (v.currency.typeOfCurrency === '' || v.currency.typeOfCurrency === undefined) ? '' : v.currency.typeOfCurrency.currencyCode;
      v.client = (v.client === '' || v.client === undefined) ? '' : v.client.name;
      v.clientSigned = (v.clientSigned === '' || v.clientSigned === undefined) ? '' : v.clientSigned.name;
      v.commercialOperation = (v.commercialOperation === '' || v.commercialOperation === undefined) ? '' : v.commercialOperation.name;
      v.financialCompany = (v.financialCompany === '' || v.financialCompany === undefined) ? '' : v.financialCompany.name;
      delete v.nbrConcepts;
    });

    const excludeAttributes = ['billId','desc','descTotalUSD','financialContract'];
    const options = {
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      downloadOptions: { filename: 'Billing.csv' },
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={comops}
          url="/app/gestion-financial/Add-Bill"
          tooltip="Add New Bill"
          fileName="Invoice list"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_billingManagement_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_billingManagement_export}
        />
      ),
      textLabels: {
        noMatch: <CircularProgress size={24} style={{ marginLeft: 15, position: 'relative', top: 4 }} />,
      },
      noMatchTypographyComponent: 'div',
    };

    return (
      <div>
        <MUIDataTable
          title="Invoice list"
          data={datas}
          columns={columns}
          options={options}
        />
        <Dialog
          open={openPopUp}
          keepMounted
          scroll="body"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={this.true}
          maxWidth="lg"
        >
          <DialogTitle id="alert-dialog-slide-title"> View Details</DialogTitle>
          <DialogContent dividers>
            <EditBill Info={bill} callbackFromParent={this.myCallback} callbackFromParent2={this.myCallback2} />
          </DialogContent>
        </Dialog>
        <Dialog
          open={openPopUpDelete}
          keepMounted
          scroll="body"
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth=""
          maxWidth=""
        >
          <DialogTitle id="alert-dialog-slide-title"> Delete bill</DialogTitle>
          <DialogContent dividers>
            Are you sure you want to delete this bill ?
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


const mapStateToProps = () => ({
  logedUser: localStorage.getItem('logedUser'),
});
const BillingBlockMapped = connect(
  mapStateToProps,
  null
)(BillingBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  return <BillingBlockMapped changeTheme={changeTheme} />;
};
