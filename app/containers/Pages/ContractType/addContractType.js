import React, { useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles, FormControl, InputLabel, Select, MenuItem, IconButton
} from '@material-ui/core';
import { PapperBlock } from 'dan-components';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PublishIcon from '@material-ui/icons/Publish';
import Autocomplete from '@material-ui/lab/Autocomplete';
import AutoComplete from '../../../components/AutoComplete';
import styles from '../AbsenceType/absenceType-jss';
import history from '../../../utils/history';
import '../Configurations/map/app.css';
import { ThemeContext } from '../../App/ThemeWrapper';
import CountryService from '../../Services/CountryService';
import StateCountryService from '../../Services/StateCountryService';
import {
  getAllContractType,
  getAllContractTypeByState,
  saveContractType
} from '../../../redux/contractType/actions';
import notification from '../../../components/Notification/Notification';

const useStyles = makeStyles(styles);
const inputDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff', 'docx'];
class AddContractType extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {};
    this.state = {
      code: '',
      name: '',
      description: '',
      country: null,
      state: null,
      countries: [],
      states: [],
      doc: {},
      docExtension: '',
      contractModel: {
        value: 'full-time',
        label: 'full-time',
      },
    };
  }

  componentDidMount() {
    const { changeTheme } = this.props;
    changeTheme('blueCyanTheme');
    CountryService.getCountries().then(({ data }) => {
      this.setState({ countries: data });
    });
  }

  handleUploadDocDelete= () => {
    inputDoc.current.value = '';
    this.setState({
      doc: {},
      docExtension: ''
    });
  };

  handleDocChange = () => {
    const lastDot = inputDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        doc: inputDoc.current.files[0],
        docExtension: ext
      });
    }
  };

  handleUploadDocDelete= () => {
    inputDoc.current.value = '';
    this.setState({
      doc: {},
      docExtension: ''
    });
  };

  handleUploadDocClick = () => {
    inputDoc.current.value = '';
    inputDoc.current.click();
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  handleChangeContractModel = (ev, value) => {
    this.setState({ contractModel: value });
  };

  handleSubmitContractType = () => {
    const { saveContractType, getAllContractType } = this.props;
    const {
      code, name, description, state, contractModel, docExtension, doc
    } = this.state;
    const contractType = {
      code,
      name,
      description,
      docExtension,
      contractModel: contractModel.value,
      stateId: state.stateCountryId
    };
    const formData = new FormData();
    if (doc.constructor === File) {
      formData.append('doc', doc);
    } else {
      formData.append(
        'doc',
        new Blob([JSON.stringify({})], {
          type: 'application/json'
        })
      );
    }
    Object.keys(contractType).forEach(e => formData.append(e, contractType[e]));

    const promise = new Promise(resolve => {
      saveContractType(formData);
      this.editingPromiseResolve = resolve;
    });
    promise.then(result => {
      if (isString(result)) {
        notification('success', result);
        getAllContractType();
        history.push('/app/hh-rr/contractType');
      } else {
        notification('danger', result);
      }
    });
  };

  handleChangeCountry = (ev, value) => {
    StateCountryService.getStatesByCountry(value.countryId).then(({ data }) => {
      this.setState({
        country: value,
        states: data.payload,
        state: null
      });
    });
  };

  handleChangeState = (ev, value) => {
    const { getAllContractTypeByState } = this.props;
    this.setState({ state: value });
    getAllContractTypeByState(value.stateCountryId);
  };

  handleValueChange = (value, type) => {
    this.setState({ [type]: value });
  };

  render() {
    const contractModels = [
      {
        value: 'full-time',
        label: 'full-time',
      },
      {
        value: 'part-time',
        label: 'part-time',
      },
      {
        value: 'internship',
        label: 'internship',
      }];
    const {
      classes,
      isLoadingContractType,
      contractTypeResponse,
      errorContractType,
      allContractTypeByState
    } = this.props;
    const {
      code,
      name,
      description,
      countries,
      states,
      country,
      state,
      contractModel, doc,
    } = this.state;
    !isLoadingContractType
      && contractTypeResponse
      && this.editingPromiseResolve(contractTypeResponse);
    !isLoadingContractType
      && !contractTypeResponse
      && this.editingPromiseResolve(errorContractType);
    return (
      <div>
        <PapperBlock
          title="Add contract type"
          icon="ios-paper-outline"
          noMargin
          whiteBg
          desc=""
        >
          <Grid
            container
            spacing={2}
            direction="row"
            justify="center"
            alignItems="center"
          >
            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 0
              }}
            >
              <Autocomplete
                id="combo-box-demo-country"
                value={country}
                options={countries}
                getOptionLabel={option => option.countryName}
                onChange={this.handleChangeCountry}
                style={{ width: '40%', marginTop: 0 }}
                clearOnEscape
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Country"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                id="combo-box-demo-state"
                value={state}
                options={states}
                getOptionLabel={option => option.stateName}
                onChange={this.handleChangeState}
                style={{ width: '40%', marginTop: 0 }}
                clearOnEscape
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="State"
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 0
              }}
            >
              <div
                style={
                  Object.keys(states).length === 0
                    ? { pointerEvents: 'none', opacity: '0.7', width: '40%' }
                    : { width: '40%' }
                }
              >
                <AutoComplete
                  value={this.handleValueChange}
                  placeholder="Code"
                  data={allContractTypeByState}
                  type="code"
                  attribute="code"
                  lenghtCode="10"
                />
              </div>
              <div
                style={
                  Object.keys(states).length === 0
                    ? { pointerEvents: 'none', opacity: '0.7', width: '40%' }
                    : { width: '40%' }
                }
              >
                <AutoComplete
                  value={this.handleValueChange}
                  placeholder="Name"
                  data={allContractTypeByState}
                  type="name"
                  attribute="name"
                  disabled={Object.keys(states).length === 0}
                />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 0
              }}
            >
              <Autocomplete
                id="combo-box-demo"
                name="contractModel"
                value={contractModel}
                options={contractModels}
                defaultValue={contractModels[0]}
                getOptionLabel={option => option.label || ''}
                onChange={this.handleChangeContractModel}
                style={{ width: '40%', marginTop: 13 }}
                clearOnEscape
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Contract Model"
                    variant="outlined"
                  />
                )}
              />
              <div
                style={{
                  textAlign: 'center', opacity: '0.7', width: '40%'
                }}
              >
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
                      doc.constructor === Object
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
                        ref={inputDoc}
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
                        model contract
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
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 0
              }}
            >
              <TextField
                id="outlined-basic"
                label="Description"
                variant="outlined"
                name="description"
                value={description}
                style={{ width: '100%' }}
                className={classes.textField}
                onChange={this.handleChange}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={7}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 0
              }}
            >
              <Button
                color="primary"
                variant="contained"
                size="medium"
                onClick={this.handleSubmitContractType}
                disabled={!code || !name}
              >
                Save Type
              </Button>
            </Grid>
          </Grid>
        </PapperBlock>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allContractType: state.getIn(['contractTypes']).allContractType,
  allContractTypeByState: state.getIn(['contractTypes']).allContractTypeByState,
  contractTypeResponse: state.getIn(['contractTypes']).contractTypeResponse,
  isLoadingContractType: state.getIn(['contractTypes']).isLoading,
  errorContractType: state.getIn(['contractTypes']).errors
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    saveContractType,
    getAllContractType,
    getAllContractTypeByState
  },
  dispatch
);

const AddContractTypeMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddContractType);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AddContractTypeMapped changeTheme={changeTheme} classes={classes} />;
};
