import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import { ThemeContext } from '../../../App/ThemeWrapper';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import EconomicStaffYearService from '../../../Services/EconomicStaffYearService';
import EconomicStaffMonthService from '../../../Services/EconomicStaffMonthService';
import EconomicStaffExtraService from '../../../Services/EconomicStaffExtraService';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import notification from '../../../../components/Notification/Notification';

const useStyles = makeStyles();

class EconomicStaffPaymentBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      economicStaffsYear: [],
      economicStaffsMonth: [],
      economicStaffsExtra: [],
      openPopUpDelete: false,
      paymentToDeleteId: '',
      paymentType: '',
      openPopUp: false,
      columnsYear: [
        {
          label: 'First Name',
          name: 'economicStaff.staff.firstName',
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
            customBodyRender: (firstName) => (
              <React.Fragment>
                {
                  firstName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Father Name',
          name: 'economicStaff.staff.fatherFamilyName',
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
            customBodyRender: (fatherFamilyName) => (
              <React.Fragment>
                {
                  fatherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Mother Name',
          name: 'economicStaff.staff.motherFamilyName',
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
            customBodyRender: (motherFamilyName) => (
              <React.Fragment>
                {
                  motherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Employee Number',
          name: 'economicStaff.employeeNumber',
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
            customBodyRender: (employeeNumber) => (
              <React.Fragment>
                {
                  employeeNumber
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Payment Date',
          name: 'yearPayment',
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
            customBodyRender: (currencyCode) => (
              <React.Fragment>
                {
                  currencyCode
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Gross Salary',
          name: 'grosSalaryYear',
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
          label: 'Gross Salary (€)',
          name: 'grosSalaryEuroYear',
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
          name: 'netSalaryYear',
          label: 'Net Salary',
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
          name: 'netSalaryEuroYear',
          label: 'Net Salary (€)',
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
          label: 'Contribution Salary',
          name: 'contributionSalaryYear',
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
          label: 'Contribution Salary (€)',
          name: 'contributionSalaryEuroYear',
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
          label: 'Company Cost',
          name: 'companyCostYear',
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
          label: 'Company Cost (€)',
          name: 'companyCostEuroYear',
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)} />
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_delete ? (
                  <IconButton onClick={() => this.handleDeleteYear(tableMeta)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                ) : null}
              </React.Fragment>
            )
          }
        }
      ],
      columnsMonth: [
        {
          label: 'First Name',
          name: 'economicStaff.staff.firstName',
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
            customBodyRender: (firstName) => (
              <React.Fragment>
                {
                  firstName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Father Name',
          name: 'economicStaff.staff.fatherFamilyName',
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
            customBodyRender: (fatherFamilyName) => (
              <React.Fragment>
                {
                  fatherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Mother Name',
          name: 'economicStaff.staff.motherFamilyName',
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
            customBodyRender: (motherFamilyName) => (
              <React.Fragment>
                {
                  motherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Employee Number',
          name: 'economicStaff.employeeNumber',
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
            customBodyRender: (employeeNumber) => (
              <React.Fragment>
                {
                  employeeNumber
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Payment Date',
          name: 'monthPayment',
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
            customBodyRender: (currencyCode) => (
              <React.Fragment>
                {
                  currencyCode
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Gross Salary',
          name: 'grosSalaryMonth',
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
          label: 'Gross Salary (€)',
          name: 'grosSalaryEuroMonth',
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
          name: 'netSalaryMonth',
          label: 'Net Salary',
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
          name: 'netSalaryEuroMonth',
          label: 'Net Salary (€)',
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
          label: 'Contribution Salary',
          name: 'contributionSalaryMonth',
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
          label: 'Contribution Salary (€)',
          name: 'contributionSalaryEuroMonth',
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
          label: 'Company Cost',
          name: 'companyCostMonth',
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
          label: 'Company Cost (€)',
          name: 'companyCostEuroMonth',
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_access ? (
                  <IconButton onClick={() => this.handleDetailsMonth(tableMeta)} />
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_delete ? (
                  <IconButton onClick={() => this.handleDeleteMonth(tableMeta)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                ) : null}
              </React.Fragment>
            )
          }
        }
      ],
      columnsExtra: [
        {
          label: 'First Name',
          name: 'economicStaff.staff.firstName',
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
            customBodyRender: (firstName) => (
              <React.Fragment>
                {
                  firstName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Father Name',
          name: 'economicStaff.staff.fatherFamilyName',
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
            customBodyRender: (fatherFamilyName) => (
              <React.Fragment>
                {
                  fatherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Mother Name',
          name: 'economicStaff.staff.motherFamilyName',
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
            customBodyRender: (motherFamilyName) => (
              <React.Fragment>
                {
                  motherFamilyName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Employee Number',
          name: 'economicStaff.employeeNumber',
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
            customBodyRender: (employeeNumber) => (
              <React.Fragment>
                {
                  employeeNumber
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Payment Date',
          name: 'extraordinaryDate',
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
            customBodyRender: (currencyCode) => (
              <React.Fragment>
                {
                  currencyCode
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Extraordinary Expenses',
          name: 'extraordinaryExpenses',
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
          label: 'Extraordinary Expenses (€)',
          name: 'extraordinaryExpensesEuro',
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
          name: 'extraordinaryObjectives',
          label: 'Extraordinary Objectives',
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
          name: 'extraordinaryObjectivesEuro',
          label: 'Extraordinary Objectives (€)',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',

                left: '0',

                zIndex: 80
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',

                left: 0,

                zIndex: 80
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
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_access ? (
                  <IconButton onClick={() => this.handleDetailsExtra(tableMeta)} />
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_delete ? (
                  <IconButton onClick={() => this.handleDeleteExtra(tableMeta)}>
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
    EconomicStaffYearService.getEconomicStaffYear().then(result => {
      console.log(result.data);
      this.setState({ economicStaffsYear: result.data });
    });
    EconomicStaffMonthService.getEconomicStaffMonth().then(result => {
      console.log(result.data);
      this.setState({ economicStaffsMonth: result.data });
    });
    EconomicStaffExtraService.getEconomicStaffExtra().then(result => {
      console.log(result.data);
      this.setState({ economicStaffsExtra: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

    // eslint-disable-next-line react/sort-comp
    handleDetails = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsYear[index].economicStaffYearId;
      console.log(id);
    }

    // eslint-disable-next-line react/sort-comp
    handleDetailsMonth = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsMonth[index].economicStaffMonthId;
      console.log(id);
    }

    // eslint-disable-next-line react/sort-comp
    handleDetailsExtra = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsExtra[index].economicStaffExtraId;
      console.log(id);
    }

    handleChange = (ev) => {
      this.setState({ [ev.target.name]: ev.target.value });
    };

    handleSave = () => {
    };

    handleDeleteYear = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsYear[index].economicStaffYearId;
      this.setState({ openPopUpDelete: true });
      this.setState({ paymentToDeleteId: id });
      this.setState({ paymentType: 'year' });
    };

    handleDeleteMonth = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsMonth[index].economicStaffMonthId;
      this.setState({ openPopUpDelete: true });
      this.setState({ paymentToDeleteId: id });
      this.setState({ paymentType: 'month' });
    };

    handleDeleteExtra = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
          + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.economicStaffsExtra[index].economicStaffExtraId;
      this.setState({ openPopUpDelete: true });
      this.setState({ paymentToDeleteId: id });
      this.setState({ paymentType: 'extra' });
     
    };
    deleteConfirmePayment= () => {
      const { paymentToDeleteId } = this.state;
      this.setState({ openPopUpDelete: false });
      // notification('danger', 'this company is used in other modules !');
      switch (this.state.paymentType) {
        case 'year':
      EconomicStaffYearService.deleteEconomicStaffYear(paymentToDeleteId).then(result => {
        if (result.status === 200) {
          notification('success', 'Year payment deleted');
        } else {
          notification('danger', 'Year payment not deleted');
        }
        this.setState({ economicStaffsYear: result.data });
      });
          break;
        case 'month':
          EconomicStaffMonthService.deleteEconomicStaffMonth(paymentToDeleteId).then(result => {
            if (result.status === 200) {
              notification('success', 'Month payment deleted');
            } else {
              notification('danger', 'Month payment not deleted');
            }
            this.setState({ economicStaffsMonth: result.data });
          });
          break;
        case 'extra':
          EconomicStaffExtraService.deleteEconomicStaffExtra(paymentToDeleteId).then(result => {
            if (result.status === 200) {
              notification('success', 'Extra payment deleted');
            } else {
              notification('danger', 'Extra payment not deleted');
            }
            this.setState({ economicStaffsExtra: result.data });
          });     
        default:
          break;
      } 
    }
    handleCloseDelete = () => {
      this.setState({ openPopUpDelete: false });
    }


    render() {
      console.log(this.state);
      const {
        economicStaffsYear, economicStaffsMonth, economicStaffsExtra, columnsYear, columnsMonth, columnsExtra
      } = this.state;
      const {
        logedUser
      } = this.props;
      const thelogedUser = JSON.parse(logedUser);
      let exportButton = false;
      if (thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_export) {
        exportButton = true;
      }
      const excludeAttributesYear = ['economicStaffYearId', 'economicStaff', 'currency'];
      const options = {
        filter: true,
        selectableRows: false,
        filterType: 'dropdown',
        responsive: 'stacked',
        download: exportButton,
        downloadOptions: { filename: 'Staff economic payment year.csv' },
        print: exportButton,
        rowsPerPage: 10,
        customToolbar: () => (
          <CustomToolbar
            csvData={economicStaffsYear}
            hasAddRole={false}
            fileName="Staff economic payment year"
            excludeAttributes={excludeAttributesYear}
            hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_export}
          />
        )
      };
      const excludeAttributesMonth = ['economicStaffMonthId', 'economicStaff', 'currency'];

      const options2 = {
        filter: true,
        selectableRows: false,
        filterType: 'dropdown',
        responsive: 'stacked',
        download: exportButton,
        downloadOptions: { filename: 'Staff economic payment month.csv' },
        print: exportButton,
        rowsPerPage: 10,
        customToolbar: () => (
          <CustomToolbar
            csvData={economicStaffsMonth}
            hasAddRole={false}
            fileName="Staff economic payment month"
            excludeAttributes={excludeAttributesMonth}
            hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_export}
          />
        )
      };

      const excludeAttributesExtra = ['economicStaffExtraId', 'economicStaff', 'currency'];

      const options3 = {
        filter: true,
        selectableRows: false,
        filterType: 'dropdown',
        responsive: 'stacked',
        download: exportButton,
        downloadOptions: { filename: 'Staff economic payment extraordinary.csv' },
        print: exportButton,
        rowsPerPage: 10,
        customToolbar: () => (
          <CustomToolbar
            csvData={economicStaffsExtra}
            hasAddRole={false}
            fileName="Staff economic payment extraordinary"
            excludeAttributes={excludeAttributesExtra}
            hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_staffEconomicPayments_export}
          />
        )
      };

      return (
        <div>
          <MUIDataTable
            title="Year Payment"
            data={economicStaffsYear}
            columns={columnsYear}
            options={options}
          />
          <br />
          <MUIDataTable
            title="Month Payment"
            data={economicStaffsMonth}
            columns={columnsMonth}
            options={options2}
          />
          <br />
          <MUIDataTable
            title="Extraordinary Payment"
            data={economicStaffsExtra}
            columns={columnsExtra}
            options={options3}
          />
          <div>
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
                  <DialogTitle id="alert-dialog-slide-title"> Delete {this.state.paymentType} payment</DialogTitle>
                  <DialogContent dividers>
                      Are you sure you want to delete this {this.state.paymentType} payment ?
                  </DialogContent>
                  <DialogActions>
                    <Button color="secondary" onClick={this.handleCloseDelete}>
                        Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.deleteConfirmePayment}
                    >
                        Delete
                    </Button>
                  </DialogActions>
                </Dialog>  

          </div>
        </div>
      );
    }
}

const mapStateToProps = () => ({
  logedUser: localStorage.getItem('logedUser'),
});
const SupliersPaymentBlockMapped = connect(
  mapStateToProps,
  null
)(EconomicStaffPaymentBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <SupliersPaymentBlockMapped changeTheme={changeTheme} classes={classes} />;
};
