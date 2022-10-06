import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Select,
  MenuItem
} from '@material-ui/core';
import MaterialTable, { MTableToolbar } from 'material-table';
import { green } from '@material-ui/core/colors';
import { isString } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Dropzone from './Dropzone';

import HelmetCustom from '../../../../components/HelmetCustom/HelmetCustom';
import notification from '../../../../components/Notification/Notification';
import {
  approveTravelRequest,
  changeStatusTravelRequest,
  exportTravelRequests,
  getTravelRequests
} from '../../../../redux/travelRequest/actions';
import { getCurrencyTypes } from '../../../../redux/currencyType/actions';
import { getDataAssociatedWithCurrencyTypes, getDataByCurrencyType } from '../../../../redux/currency/actions';
import { ThemeContext } from '../../../App/ThemeWrapper';
import PropTypes from "prop-types";

let self = null;

class TravelRequestDocumentPanel extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolvex = () => { };
    self = this;
    this.state = {
      filesToUpload: [],
      localCurrencyType: '',
      currencyTypes: [],
      euroTotalAmount: (0).toFixed(2),
      columns: [
        {
          title: 'Name', // intl.formatMessage({ id: 'connection.id' }),
          field: 'name',
          editable: 'never'
        },
        {
          title: 'Local Currency Type',
          field: 'currencyName',
          minWidth: 150,
          width: 150,
          maxWidth: 150,
          render: rowData => {
            const index = this.props.allCurrencyData.findIndex(obj => obj.currencyId === rowData.localCurrencyTypeId);
            return index > -1 ? this.props.allCurrencyData[index].typeOfCurrency.currencyName : 'xxx';
          },
          validate: rowData => (this.state.localCurrencyType !== '' ? this.state.localCurrencyType !== 'none' : (rowData.localCurrencyTypeId !== '' && rowData.localCurrencyTypeId !== 'none')),
          editComponent: props => (
            <Select
              id="local-currency-type-select"
              name="localCurrencyType"
              value={this.state.localCurrencyType || props.value || 'none'}
              onChange={(e) => this.changeFileAttributeValue(e)}
              error={this.state.localCurrencyType !== '' ? this.state.localCurrencyType === 'none' : (props.value === '' || props.value === 'none')}
            >
              <MenuItem value="none">
                <em>Empty</em>
              </MenuItem>
              {this.props.allCurrencyData.map(currency => <MenuItem key={currency.currencyId} value={currency.currencyId}>{currency.typeOfCurrency.currencyName}</MenuItem>)}
            </Select>
          )
        },
        {
          title: 'Local Currency Amount',
          field: 'localCurrencyAmount',
          minWidth: 120,
          width: 120,
          maxWidth: 120,
          render: rowData => this.toCommas(parseFloat(rowData.localCurrencyAmount).toFixed(2)),
          validate: rowData => rowData.localCurrencyAmount > 0 && !isNaN(rowData.localCurrencyAmount)
        }
      ],
    };
  }


  componentDidMount() {
  }

  componentWillUnmount() {

  }

  changeFileAttributeValue(evt) {
    this.setState({
      localCurrencyType: evt.target.value
    });
  }

  handleCancel(e) {
    const { closeDrawer } = this.props;
    this.setState({
      filesToUpload: [],
      status: '',
      euroTotalAmount: (0).toFixed(2)
    });
    closeDrawer(e);
  }

  toCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  handleAddFiles(files) {
    const list = this.state.filesToUpload;
    files.forEach(f => {
      if (f.type === 'application/pdf') {
        const index = list.findIndex(obj => obj.name === f.name && obj.type === f.type);
        if (index === -1) {
          list.push({
            name: f.name,
            localCurrencyTypeId: '',
            localCurrencyAmount: (0).toFixed(2),
            type: f.type,
            file: f
          });
        }
      }
    });
    this.setState({
      filesToUpload: list
    });
  }

  updateEuroTotalAmount() {
    const { allCurrencyData } = this.props;
    let total = 0;
    this.state.filesToUpload.forEach(file => {
      const index = allCurrencyData.findIndex(obj => obj.currencyTypeId === file.localCurrencyTypeId);
      if (index > -1) {
        total += (file.localCurrencyAmount * allCurrencyData[index].currencyChangeFactor);
      }
    });
    this.setState({
      euroTotalAmount: this.toCommas(total.toFixed(2))
    });
  }

  validFilesData() {
    let errorCount = 0;
    this.state.filesToUpload.forEach(file => {
      if ((file.localCurrencyTypeId === '' || file.localCurrencyTypeId === 'none') || (file.localCurrencyAmount === '' || file.localCurrencyAmount <= 0)) {
        errorCount++;
      }
    });
    return errorCount === 0;
  }

  handleApprove(evt) {
    const { approveTravelRequest, getTravelRequests, data } = this.props;
    const params = new FormData();
    params.append('travelRequestId', data.rowData.id);
    params.append('status', data.status);
    this.state.filesToUpload.forEach(el => {
      params.append('files', el.file);
      params.append('localCurrencyTypes', el.localCurrencyTypeId);
      params.append('localCurrencyAmounts', String(el.localCurrencyAmount));
    });
    this.handleCancel();
    new Promise((resolve) => {
      approveTravelRequest(params);
      this.editingPromiseResolvex = resolve;
    }).then((result) => {
      const notificationValue = Object.keys(result).length === 0 ? 'travelrequest.approved' : result;
      if (Object.keys(result).length === 0 || isString(result)) {
        const values = {
          period: data.period,
          startDate: data.startDate,
          endDate: data.endDate
        };
        getTravelRequests(values);
        notification('success', notificationValue);
      } else {
        notification('danger', notificationValue);
      }
    });
  }


  render() {
    const { columns, filesToUpload } = this.state;
    const { errors, isLoading, travelRequestResponse } = this.props;
    /*    console.log(travelRequestResponse=="approved");
     console.log(!isLoading && travelRequestResponse=="approved"); */
    (!isLoading && travelRequestResponse == 'approved') && this.editingPromiseResolvex(travelRequestResponse);
    (!isLoading && !travelRequestResponse) && this.editingPromiseResolve(errors);

    const files = [];
    filesToUpload.forEach(file => {
      files.push(file);
    });

    return (
      <Card style={{ width: 600, maxWidth: 600 }}>
        <CardContent>
          <Grid item>
            <Dropzone
              onFilesAdded={(files) => this.handleAddFiles(files)}
            />
          </Grid>
          <Grid item style={{ marginTop: '10px' }}>
            <HelmetCustom location={location} />
            <MaterialTable
              style={{ height: 405, maxHeight: 405, overflow: 'auto' }}
              title="Files to attach to the travel request"
              columns={columns}
              data={files}
              options={{
                search: false,
                paging: false,
                headerStyle: { position: 'sticky', top: 0 },
                maxBodyHeight: 305,
                actionsColumnIndex: -1,
                actionsCellStyle: {
                  paddingLeft: 20,
                  minWidth: 120,
                  width: 120,
                  maxWidth: 120
                }
              }}
              components={{
                Toolbar: props => (
                  <div style={{
                    color: green[500],
                    alignItems: 'center',
                    height: 45
                  }}
                  >
                    <MTableToolbar {...props} />
                  </div>
                )
              }}
              editable={{
                onRowUpdateCancelled: rowData => {
                  this.setState({
                    localCurrencyType: ''
                  });
                },
                onRowUpdate: (newData, oldData) => new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const updateData = newData;
                    const index = oldData.tableData.id;
                    updateData.localCurrencyTypeId = this.state.localCurrencyType ? this.state.localCurrencyType : oldData.localCurrencyTypeId;
                    updateData.file = oldData.file;
                    const updatedFiles = this.state.filesToUpload;
                    updatedFiles[index] = updateData;
                    this.setState({
                      filesToUpload: updatedFiles,
                      localCurrencyType: ''
                    });
                    this.updateEuroTotalAmount();
                    resolve();
                  }, 1000);
                }),
                onRowDelete: (oldData) => new Promise((resolve, reject) => {
                  setTimeout(() => {
                    const newFiles = this.state.filesToUpload;
                    newFiles.splice(oldData.tableData.id, 1);
                    this.setState({
                      filesToUpload: newFiles,
                      localCurrencyType: ''
                    });
                    this.updateEuroTotalAmount();
                    resolve();
                  }, 1000);
                })
              }}
            />
          </Grid>
        </CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardActions style={{ marginLeft: '7px' }}>
              <Button variant="contained" size="small" onClick={(e) => this.handleCancel(e)} color="default">
                Cancel
              </Button>
              <Button variant="contained" size="small" disabled={this.state.filesToUpload.length === 0 || !this.validFilesData()} onClick={(e) => this.handleApprove(e)} color="primary">
                Approve
              </Button>
            </CardActions>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" align="right" gutterBottom style={{ color: green[500], marginTop: '5px', marginRight: '15px' }}>
              {`€ ${this.state.euroTotalAmount}`}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    );
  }
}
TravelRequestDocumentPanel.propTypes = {
  //location: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  travelRequests: state.getIn(['travelRequest']).travelRequests,
  travelRequestResponse: state.getIn(['travelRequest']).travelRequestResponse,
  isLoading: state.getIn(['travelRequest']).isLoading,
  errors: state.getIn(['travelRequest']).errors,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getTravelRequests,
  changeStatusTravelRequest,
  exportTravelRequests,
  approveTravelRequest,
  getCurrencyTypes,
  getDataByCurrencyType,
  getDataAssociatedWithCurrencyTypes
}, dispatch);

const TravelRequestDocumentPanelMapped = connect(mapStateToProps, mapDispatchToProps)(injectIntl(TravelRequestDocumentPanel));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  // const classes = useStyles();
  return <TravelRequestDocumentPanelMapped changeTheme={changeTheme} />;
};
