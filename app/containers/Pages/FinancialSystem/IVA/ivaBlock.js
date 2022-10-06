import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { ThemeContext } from '../../../App/ThemeWrapper';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import IvaService from '../../../Services/IvaService';
import { getAllCountry } from '../../../../redux/country/actions';
import { getAllStateByCountry } from '../../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../../redux/city/actions';
import notification from '../../../../components/Notification/Notification';
import StateCountryService from '../../../Services/StateCountryService.js';
import SuppliersContractService from '../../../Services/SuppliersContractService';


class IvaBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      ivaId: '',
      openPopUpDelete: false,
      ivaToDeleteId: '',
      cityId: '',
      ivaCode: '',
      stateCountry: '',
      allStateCountrys: [],
      state: '',
      value: '',
      startingDate: '',
      endingDate: '',
      electronicInvoice: false,
      datas: [],
      keyCountry: {},
      keyState: {},
      keyCity: {},
      openPopUp: false,
      columns: [
        {
          name: 'ivaCode',
          label: 'I.V.A Code',
          options: {
            filter: true
          }
        },
        {
          label: 'Country',
          name: 'stateCountry.country.countryName',
          options: {
            filter: true,
            customBodyRender: (country) => (
              <React.Fragment>
                {
                  country
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'State',
          name: 'stateCountry.stateName',
          options: {
            filter: true,
            customBodyRender: (stateName) => (
              <React.Fragment>
                {
                  stateName
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'I.V.A Value (%)',
          name: 'value',
          options: {
            filter: true
          }
        },
        {
          label: 'Starting Date',
          name: 'startingDate',
          options: {
            filter: true,
            customBodyRender: (value) => (
              <React.Fragment>
                {
                /*  value.toString().slice(0, 10) */
                  (value === '' || value === undefined) ? null : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Ending Date',
          name: 'endingDate',
          options: {
            filter: true,
            customBodyRender: (value) => (
              <React.Fragment>
                {
                  /* value ? value.toString().slice(0, 10) : ' ' */
                  (value === '' || value === undefined || value === null) ? " - - - - - - - - - "  : moment(value).format('DD/MM/YYYY')
                }
              </React.Fragment>
            )
          }
        },
        {
          label: 'Electronic Invoice ',
          name: 'electronicInvoice',
          options: {
            filter: true,
            customBodyRender: (value) => (
              <React.Fragment>
                {
                  value === true ? 'Yes' : 'No'
                }
              </React.Fragment>
            )
          }
        },
        {
          name: 'Actions',
          label: ' Actions',
          options: {
            filter: false,
            sort: false,
            empty: true,
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {thelogedUser.userRoles[0].actionsNames.financialModule_iva_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_iva_delete ? (
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

    editingPromiseResolve4 = () => {};

    componentDidMount() {
      IvaService.getIva().then(result => {
        this.setState({ datas: result.data });
      });
      // eslint-disable-next-line no-shadow,react/prop-types
      const { getAllCountry, changeTheme } = this.props;
      getAllCountry();
      changeTheme('greyTheme');
    }

    // eslint-disable-next-line react/sort-comp
    handleDetails = (tableMeta) => {
      const {
        getAllStateByCountry, allCountrys
      } = this.props;
      let {
        allStateCountrys
      } = this.state;
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const id = this.state.datas[index].ivaId;
      IvaService.getIvaById(id).then(result => {
        const iva = result.data;
        console.log(iva);
        this.setState({
          ivaId: iva._id,
          ivaCode: iva.ivaCode,
          state: iva.stateCountry._id,
          stateName: iva.stateCountry.stateName,
          countryName: iva.stateCountry.country.countryName,
          stateCountry: iva.stateCountry.country.countryId,
          value: iva.value,
          startingDate: iva.startingDate.substr(0, 10),
          endingDate: iva.endingDate !== null ? result.data.endingDate.substr(0, 10) : '',
          electronicInvoice: iva.electronicInvoice,
          openPopUp: true
        });
        if (iva.stateCountry) {
          if (iva.stateCountry.country) {
            for (const key in allCountrys) {
              if (allCountrys[key].countryName === iva.stateCountry.country.countryName) {
                this.setState({ keyCountry: allCountrys[key] });
                break;
              }
            }
          }
          StateCountryService.getStatesByCountry(iva.stateCountry.country.countryId).then(result => {
            if (result.status === 200) {
              allStateCountrys = result.data.payload;
              this.setState({ allStateCountrys: result.data.payload });
              if (iva.stateCountry) {
                for (const key in result.data.payload) {
                  if (result.data.payload[key].stateCountryId === iva.stateCountry._id) {
                    this.setState({ keyState: result.data.payload[key] });
                    break;
                  }
                }
              }
            }
          })
            .catch(err => notification('danger', err.response.data.errors));
          // getAllCityByState(company.address.city.stateCountry._id);
        }
      });
    }

    handleChange = (ev) => {
      this.setState({ [ev.target.name]: ev.target.value });
    };

    handleChangeIVA = (ev) => {
      if (ev.target.value > 100) {
        this.setState({ [ev.target.name]: 100 });
      } else {
        this.setState({ [ev.target.name]: parseInt(ev.target.value, 10) });
      }
    };

    handleSave = () => {
      const {
        state, value, startingDate, endingDate, electronicInvoice, ivaCode, ivaId
      } = this.state;
      const stateCountry = { _id: state };
      const stateCountryId = state;
      const Iva = {
        ivaId, ivaCode, value, startingDate, endingDate, electronicInvoice, stateCountry, stateCountryId
      };
      IvaService.updateIva(Iva).then(result => {
        if (result.status === 200) {
          notification('success', 'iva updated');
          IvaService.getIva().then(result2 => {
            this.setState({ datas: result2.data, openPopUp: false });
          });
        }
      })
        .catch(err => notification('danger', err.response.data.errors));
      this.setState({ openPopUp: false });
    };

    handleDelete = (tableMeta) => {
      const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage + tableMeta.rowIndex;
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      this.setState({ openPopUpDelete: true });
      this.setState({ ivaToDeleteId: this.state.datas[index].ivaId });
      /* IvaService.deleteIva(id).then(result => {
        this.setState({ datas: result.data });
      }); */
    };

    handleChangeCountry = (ev, value) => {
      this.setState({ keyCountry: value });
      StateCountryService.getStatesByCountry(value.countryId).then(result => {
        if (result.status === 200) {
          this.setState({ allStateCountrys: result.data.payload });
          this.setState({ keyState: '', state: null });
        }
      })
        .catch(err => notification('danger', err.response.data.errors));
    };

    handleChangeState = (ev, value) => {
      this.setState({ keyState: value, state: value.stateCountryId });
    };

    handleClose = () => {
      this.setState({ openPopUp: false });
    };

    handleCheck = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const ok = !this.state.electronicInvoice;
      this.setState({ electronicInvoice: ok });
    }

  handleCloseDelete = () => {
    this.setState({ openPopUpDelete: false });
  };

  deleteConfirmeIva= () => {
    const { ivaToDeleteId } = this.state;
    this.setState({ openPopUpDelete: false });
    IvaService.deleteIva(ivaToDeleteId).then(result => {
      notification('success', result.data.payload);
      /* if (result.status === 200) {
        notification('success', 'Iva deleted');
      } else {
        notification('danger', 'Iva not deleted');
      }
      this.setState({ datas: result.data }); */
      IvaService.getIva().then(result1 => {
        this.setState({ datas: result1.data });
      });
    }).catch(err => notification('danger', err.response.data.errors));
  };

  /*
  handleDelete = (tableMeta) => {
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
        + tableMeta.rowIndex;
    this.setState({ openPopUpDelete: true });
    this.setState({ supplierContractToDeleteId: this.state.datas[index].supplierContractId });
  }; */

  render() {
    const {
      // eslint-disable-next-line react/prop-types
      allCountrys, logedUser
    } = this.props;
    const {
      columns, openPopUp, datas, value, startingDate, endingDate, electronicInvoice, ivaCode, keyCountry, keyState, allStateCountrys, openPopUpDelete
    } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.financialModule_iva_export) {
      exportButton = true;
    }

    const excludeAttributes = ['ivaId','stateCountry']
    const options = {
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      downloadOptions: { filename: 'Iva.csv' },
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={datas}
          url="/app/gestion-financial/Add-IVA"
          tooltip="add new I.V.A"
          fileName="Iva"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_iva_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_iva_export}
        />
      )
    };

    return (
      <div>
        <MUIDataTable
          title="I.V.A List"
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
          fullWidth={false}
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-slide-title"> View Details</DialogTitle>
          <DialogContent dividers>
            <div>
              <Grid
                container
                spacing={2}
                alignItems="flex-start"
                direction="row"
                justify="center"
              >
                <Grid item xs={12} md={12} sm={12}>
                  <Typography variant="subtitle2" component="h2" color="primary">
                    I.V.A Information
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2} sm={2}>
                  <TextField
                    id="ivaCode"
                    label="I.V.A Code"
                    variant="outlined"
                    name="ivaCode"
                    value={ivaCode}
                    inputProps={{ maxLength: 10 }}
                    required
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={4}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={allCountrys}
                    getOptionLabel={option => option.countryName || ''}
                    value={allCountrys.find(v => v.countryName === keyCountry.countryName) || ''}
                    onChange={this.handleChangeCountry}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Choose the country"
                        variant="outlined"
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4} sm={4}>
                  <Autocomplete
                    id="combo-box-demo"
                    options={allStateCountrys}
                    getOptionLabel={option => option.stateName || ''}
                    value={allStateCountrys.find(v => v.stateName === keyState.stateName) || ''}
                    onChange={this.handleChangeState}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label="Choose the state"
                        variant="outlined"
                        required
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={2} sm={2}>
                  <TextField
                    id="value"
                    label="I.V.A Value %"
                    variant="outlined"
                    name="value"
                    type="number"
                    value={value}
                    InputProps={{
                      inputProps: {
                        max: 100, min: 10
                      }
                    }}
                    required
                    onChange={this.handleChangeIVA}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    id="electronicInvoice"
                    name="electronicInvoice"
                    value={electronicInvoice}
                    control={<Checkbox color="primary" onChange={this.handleCheck} checked={electronicInvoice} />}
                    label="Electronic Invoice"
                    labelPlacement="end"
                  />
                </Grid>
                <Grid item xs={12} md={12} sm={12}>
                  <br />
                  <Typography variant="subtitle2" component="h2" color="primary">
                    I.V.A Dates
                  </Typography>
                </Grid>

                <Grid item xs={12} md={5}>
                  <TextField
                    id="startingDate"
                    label="Starting Date "
                    type="date"
                    variant="outlined"
                    name="startingDate"
                    value={startingDate}
                    required
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    id="endingDate"
                    label="Ending Date "
                    type="date"
                    variant="outlined"
                    name="endingDate"
                    value={endingDate}
                    disabled
                    InputLabelProps={{
                      shrink: true, readOnly: true
                    }}
                  />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
                            Cancel
            </Button>
            {thelogedUser.userRoles[0].actionsNames.financialModule_iva_modify ? (
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSave}
              >
                            save
              </Button>
            ) : null}
          </DialogActions>
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
          <DialogTitle id="alert-dialog-slide-title"> Delete IVA</DialogTitle>
          <DialogContent dividers>
              Are you sure you want to delete this IVA ?
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleCloseDelete}>
                Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.deleteConfirmeIva}
            >
                Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  allCountrys: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,
  isLoading: state.getIn(['countries']).isLoading,
  errors: state.getIn(['countries']).errors,
  // city
  allCitys: state.getIn(['cities']).allCitys,
  cityResponse: state.getIn(['cities']).cityResponse,
  isLoadingCity: state.getIn(['cities']).isLoading,
  errorsCity: state.getIn(['cities']).errors,
  logedUser: localStorage.getItem('logedUser'),
});
const mapDispatchToProps = dispatch => bindActionCreators({
  getAllCountry,
  getAllStateByCountry,
  getAllCityByState
}, dispatch);
const IvaBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(IvaBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  return <IvaBlockMapped changeTheme={changeTheme} />;
};
