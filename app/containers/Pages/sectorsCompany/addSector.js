import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  TextField,
  Button,
  Typography, DialogContent
} from '@material-ui/core';
import PropTypes from 'prop-types';
import styles from './sectors-jss';
import SectorConfigService from '../../Services/SectorConfigService';
import '../Configurations/map/app.css';
import AutoComplete from '../../../components/AutoComplete';
import SectorService from '../../Services/SectorService';
import { bindActionCreators } from 'redux';
import { addSectorConfig } from '../../../redux/actions/sectorConfigActions';
import { connect } from 'react-redux';
import { PapperBlock } from 'dan-components';
import Autocomplete from '@material-ui/lab/Autocomplete/Autocomplete';
import {
  addSectorCompany, deleteConfirmationSectorCompany, deleteSectorCompany,
  getAllChildSectorCompany,
  getAllPrimarySectorCompany,
  getAllSectorCompany
} from '../../../redux/sectorsCompany/actions';
import { ThemeContext } from '../../App/ThemeWrapper';
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import history from '../../../utils/history';
import { isString } from 'lodash';
import notification from '../../../components/Notification/Notification';
class AddSector extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {
    };
    this.state = {
      name: '',
      isDisabled: true,
      description1: '',
      description2: '',
      description3: '',
      thirdSectorName: '',
      keySectorPrimary: {},
      keySectorSecond: {},
      type: '',
      parent: '',
      sector1: '',
      sector2: '',
      sector3: '',
      sectors1: [],
      sectors2: [],
      sectors3: [],
    };
  }

  componentDidMount() {
    const {
      getAllSectorCompany, allSectorComapnys, allSectorPimaryComapnys, getAllPrimarySectorCompany, changeTheme
    } = this.props;
    changeTheme('redTheme');
    getAllSectorCompany();
    getAllPrimarySectorCompany();
  }

  handleGoBack = () => {
    history.push('/app/gestion-commercial/sectorsCompany');
  }

  handleValueChange1 = (ev, value) => {
    const { getAllChildSectorCompany } = this.props;
    this.setState({ description1: 'description sector1' });
    this.setState({ firstSectorName: value.firstSectorName });
    this.setState({ isDisabled: false });
    getAllChildSectorCompany(value.firstSectorName);
  };

  handleinputChange1 = (ev, value) => {
    this.setState({ firstSectorName: value });
    this.setState({ isDisabled: false });
  };


  handleValueChange2 = (ev, value) => {
    this.setState({ secondSectorName: value.secondSectorName });
  };

  handleinputChange2 = (ev, value) => {
    this.setState({ secondSectorName: value });
  };

  handleValueChange3 = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  }

  /*  handleChange = ev => {
    if (ev.target.name === 'sector1') {
      SectorConfigService.getConfigSectorsPrimary(ev.target.value.name).then(
        ({ data }) => {
          const datas = [];
          data.forEach(da => {
            const dat = da;
            const newSect = {
              sectorConfigId: dat.sectorConfigId,
              choose: false,
              primarySector: dat.primarySector,
              secondarySector: dat.secondarySector,
              thirdSector: dat.thirdSector,
              leader: dat.leader.name
            };
            datas.push(newSect);
          });
          this.setState({ sectorConfig: datas });
        }
      );
    }
    this.setState({ [ev.target.name]: ev.target.value });
  }; */

  handleSubmitSector = () => {
    const { addSectorCompany } = this.props;
    const {
      firstSectorName, secondSectorName, thirdSectorName, description1, description2, description3
    } = this.state;
    const sect = {
      firstSectorName,
      firstSectorDescription: description1,
      secondSectorName,
      secondSectorDescription: description2,
      thirdSectorName,
      thirdSectorDescription: description3
    };
    const promise = new Promise((resolve) => {
      addSectorCompany(sect);
      this.editingPromiseResolve = resolve;
    });
    promise.then((result) => {
      if (isString(result)) {
        notification('success', result);
        getAllSectorCompany();
        getAllPrimarySectorCompany();
      } else {
        notification('danger', result);
      }
      history.push('/app/gestion-commercial/sectorsCompany');
    });
    /* const { sector1, sector2, sector3 } = this.state;
    const { addNew, newAdd } = this.props;
    if (sector1 && sector3 && sector2) {
      const sect = {
        primarySector: sector1,
        secondarySector: sector2,
        thirdSector: sector3,
        leader: {
          name: '-'
        }
      };
      addNew(sect);
      newAdd();
    } */
  };

  handleCheck = (ev, id) => {
    const { sectorConfig } = this.state;
    const newSectorConfig = sectorConfig;
    newSectorConfig.forEach(config => {
      if (config.sectorConfigId === id) {
        config.choose = ev.target.checked;
      }
    });
    this.setState({ sectorConfig: newSectorConfig });
  };

  handleValueChange = (value, type) => {
    console.log(value, type);
    this.setState({ [type]: value });
  };

  render() {
    const {
      classes, sectorsConfig, allSectorPimaryComapnys, allSectorChildComapnys
    } = this.props;
    const {
      errors, isLoading, sectorComapnyResponse
    } = this.props;
    const {
      description1, sectors1, sectors2, sectors3,
      sector1,
      sector2,
      sector3,
      description2,
      description3,
      thirdSectorName,
      isDisabled,
      keySectorPrimary,
      keySectorSecond,
      secondSectorName
    } = this.state;
    (!isLoading && sectorComapnyResponse) && this.editingPromiseResolve(sectorComapnyResponse);
    (!isLoading && !sectorComapnyResponse) && this.editingPromiseResolve(errors);
    return (
      <PapperBlock title="Create new sector " desc="" icon="ios-add-circle">
        <div>
          <Grid container spacing={1}>
            <Grid item xs={11} />
            <Grid item xs={1}>
              <Tooltip title="Back to List">
                <IconButton onClick={() => this.handleGoBack()}>
                  <KeyboardBackspaceIcon color="primary" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={6}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              md={7}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {/*    <Typography variant="subtitle2" color="primary" style={{ width: '12%' }}>First Sector</Typography> */}
              { allSectorPimaryComapnys !== undefined ? (
                <div style={{ width: '35%' }}>
                  {/*  <AutoComplete value={this.handleValueChange} placeholder="First Sector Name" data={sectors1} type="sector1" /> */}
                  <Autocomplete
                    id="combo-box-demo"
                    name="firstSector"
                    freeSolo
                    options={allSectorPimaryComapnys}
                    getOptionLabel={option => option.firstSectorName || ''}
                    value={allSectorPimaryComapnys.find(v => v.firstSectorName === keySectorPrimary.firstSectorName) || ''}
                    onChange={this.handleValueChange1}
                    onInputChange={this.handleinputChange1}
                    style={{ marginTop: 0 }}
                    renderInput={params => (
                      <TextField
                        fullWidth
                        required
                        {...params}
                        label="First Sector"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              ) : ''}
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description1"
                value={description1}
                style={{ width: '48%' }}
                /* className={classes.textField} */
                onChange={this.handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              {/* <Typography variant="subtitle2" color="primary" style={{ width: '12%' }}>Second Sector</Typography> */}
              { allSectorChildComapnys !== undefined ? (
                <div style={{ width: '35%' }}>
                  <Autocomplete
                    id="combo-box-demo"
                    freeSolo
                    name="secondSector"
                    disabled={isDisabled}
                    options={allSectorChildComapnys && allSectorChildComapnys}
                    getOptionLabel={option => option.secondSectorName || ''}
                    value={allSectorChildComapnys.find(v => v.secondSectorName === keySectorSecond.secondSectorName) || ''}
                    onChange={this.handleValueChange2}
                    onInputChange={this.handleinputChange2}
                    style={{ marginTop: 0 }}
                    renderInput={params => (
                      <TextField
                        fullWidth
                        {...params}
                        label="Second Sector"
                        variant="outlined"
                      />
                    )}
                  />
                </div>
              ) : (

                <TextField
                  style={{ width: '35%' }}
                  id="outlined-basic"
                  label="Second Sector"
                  variant="outlined"
                  name="secondSectorName"
                  value={secondSectorName}
                  /* className={classes.textField} */
                  onChange={this.handleChange}
                />

              )}
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description2"
                value={description2}
                style={{ width: '48%' }}
                /* className={classes.textField} */
                onChange={this.handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{ display: 'flex', justifyContent: 'space-between' }}

            >
              {/* <Typography variant="subtitle2" color="primary" style={{ width: '12%' }}>Third Sector</Typography> */}
              <div style={{ width: '35%' }}>
                <TextField
                  id="outlined-basic"
                  label="Third Secor"
                  variant="outlined"
                  name="thirdSectorName"
                  value={thirdSectorName}
                  style={{ width: '100%' }}
                  /*  className={classes.textField} */
                  onChange={this.handleValueChange3}
                />
              </div>
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description3"
                value={description3}
                style={{ width: '48%' }}
                /*  className={classes.textField} */
                onChange={this.handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}
            >
              <Button
                color="secondary"
                variant="contained"
                size="medium"
                onClick={this.cancel}
                /*   disabled={!sector2 || !sector1 || !sector3} */
              >
              Cancel
              </Button>
            &nbsp;&nbsp;
              <Button
                color="primary"
                variant="contained"
                size="medium"
                onClick={this.handleSubmitSector}
                /*   disabled={!sector2 || !sector1 || !sector3} */
              >
                  Save Sectors
              </Button>
            </Grid>
          </Grid>
        </div>
      </PapperBlock>
    );
  }
}

AddSector.propTypes = {
  getAllSectorCompany: PropTypes.func.isRequired,
  allSectorComapnys: PropTypes.array.isRequired,
  sectorComapnyResponse: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  addSectorCompany: PropTypes.func.isRequired,

  getAllPrimarySectorCompany: PropTypes.func.isRequired,
  allSectorPimaryComapnys: PropTypes.array.isRequired,
  allSectorChildComapnys: PropTypes.array.isRequired,
};
const mapStateToProps = state => ({
  allSectorComapnys: state.getIn(['sectorCompany']).allSectorComapnys,
  allSectorChildComapnys: state.getIn(['sectorCompany']).allSectorChildComapnys,
  sectorComapnyResponse: state.getIn(['sectorCompany']).sectorComapnyResponse,
  sectorChildComapnyResponse: state.getIn(['sectorCompany']).sectorChildComapnyResponse,
  isLoading: state.getIn(['sectorCompany']).isLoading,
  isLoadingAllSectorChildComapnys: state.getIn(['sectorCompany']).isLoadingAllSectorChildComapnys,
  errors: state.getIn(['sectorCompany']).errors,

  allSectorPimaryComapnys: state.getIn(['sectorCompany']).allSectorPimaryComapnys,
  logedUser: localStorage.getItem('logedUser')
});
const mapDispatchToProps = dispatch => bindActionCreators({
  addSectorCompany,
  getAllSectorCompany,
  getAllChildSectorCompany,
  getAllPrimarySectorCompany,
  deleteSectorCompany,
  deleteConfirmationSectorCompany
}, dispatch);

const AddSectorMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddSector);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  return <AddSectorMapped changeTheme={changeTheme} />;
};
