import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle
} from '@material-ui/core';
import styles from './Contact-jss';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import { getAllClient } from '../../../redux/client/actions';
import { getAllContact } from '../../../redux/contact/actions';
import CountryService from '../../Services/CountryService';
import EditContact from './editContact';
import EditClient from '../Clients/EditClient';
import { getAllStateByCountry } from '../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../redux/city/actions';
import { ThemeContext } from '../../App/ThemeWrapper';
const useStyles = makeStyles();
class ContactBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openPopUp: false,
      data: [],
      selectedContact: {},
      columns: [
        {
          name: 'contactId',
          label: 'contactId',
          options: {
            display: 'excluded'
          }
        },
        {
          name: 'civilityName',
          label: 'Civility title',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          name: 'firstName',
          label: 'First Name',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Father Family Name',
          name: 'fatherFamilyName',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Mother Family Name',
          name: 'motherFamilyName',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Department',
          name: 'department',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Position',
          name: 'position',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Company Fix Phone',
          name: 'companyFixPhone',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Company Mobile Phone',
          name: 'companyMobilePhone',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Company Email',
          name: 'companyEmail',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Personal Mobile Phone',
          name: 'personalMobilePhone',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Personal Email',
          name: 'personalEmail',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            })
          }
        },
        {
          label: 'Skype',
          name: 'skype',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
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
                position: 'sticky',
                left: '0',
                background: 'white',
                zIndex: 100
              }
            }),
            setCellHeaderProps: () => ({
              style: {
                whiteSpace: 'nowrap',
                position: 'sticky',
                left: 0,
                background: 'white',
                zIndex: 101
              }
            }),
            customBodyRender: (value, data) => (
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <IconButton onClick={() => this.handleDetails(data.rowData)}>
                      <EditIcon color="secondary" />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            )
          }
        }
      ]
    };
  }

  handleClose = () => {
    this.setState({ openPopUp: false });
  };

  handleDetails = (data) => {
    /* const { getAllStateByCountry, getAllCityByState } = this.props;
    this.setState({ selectedClient: data });
    getAllStateByCountry(data[21]);
    this.setState({ openPopUp: true });
    getAllCityByState(data[22]); */
    // console.log(data);
    const { allContacts, getAllStateByCountry, getAllCityByState } = this.props;
    for (const key in allContacts) {
      if (allContacts[key].contactId === data[0]) {
        this.setState({ selectedContact: allContacts[key] });
        getAllStateByCountry(allContacts[key].countryId);
        getAllCityByState(allContacts[key].countryStateId);
        break;
      }
    }
    this.setState({ openPopUp: true });
  }

  componentDidMount() {
    const { getAllContact, changeTheme } = this.props;
    changeTheme('redTheme');
    getAllContact();
  }

  render() {
    const {
      allContacts, allStateCountrys, allCitys, logedUser
    } = this.props;
    const { columns, openPopUp, selectedContact } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    const excludeAttributes = ['logo', 'photo', 'contactId', 'companyId', 'countryStateId', 'countryId'];

    const options = {
      fixedHeader: true,
      fixedSelectColumn: false,
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      rowsPerPage: 10,
      downloadOptions: { filename: 'ClientsContacts.csv' },
      download: false,
      customToolbar: () => (
        <CustomToolbar
          // url="/app/gestion-commercial/contact/addContact"
          // tooltip="Add contact"
          excludeAttributes={excludeAttributes}
          fileName="ClientsContacts"
          // hasAddRole={thelogedUser.userRoles[0].actionsNames.commercial_clientContact_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.commercial_clientContact_export}
          csvData={allContacts}
        />
      )
    };

    return (
      <div>
        <MUIDataTable
          title="Contacts"
          data={allContacts}
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
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle id="alert-dialog-slide-title"> Update contact</DialogTitle>
          <DialogContent dividers>
            <EditContact selectedContact={selectedContact} allStateCountrys={allStateCountrys} allCitys={allCitys} handleClose={this.handleClose} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
ContactBlock.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  // contacts
  allContacts: state.getIn(['contacts']).allContacts,
  contactResponse: state.getIn(['contacts']).contactResponse,
  isLoading: state.getIn(['contacts']).isLoading,
  errors: state.getIn(['contacts']).errors,
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
  logedUser: localStorage.getItem('logedUser')
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllContact,
    getAllStateByCountry,
    getAllCityByState
  },
  dispatch
);

const ContactBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <ContactBlockMapped changeTheme={changeTheme} classes={classes} />;
};
