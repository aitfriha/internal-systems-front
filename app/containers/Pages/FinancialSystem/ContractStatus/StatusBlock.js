import React, { useContext } from 'react';
import MUIDataTable from 'mui-datatables';
import IconButton from '@material-ui/core/IconButton';
import DetailsIcon from '@material-ui/icons/Details';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { isString } from 'lodash';
import CustomToolbar from '../../../../components/CustomToolbar/CustomToolbar';
import ContractStatusService from '../../../Services/ContractStatusService';
import { ThemeContext } from '../../../App/ThemeWrapper';
import notification from '../../../../components/Notification/Notification';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import history from '../../../../utils/history';
import ContractService from '../../../Services/ContractService';

const useStyles = makeStyles();

class StatusBlock extends React.Component {
  constructor(props) {
    super(props);
    const thelogedUser = JSON.parse(this.props.logedUser);
    this.state = {
      contractStatusId: '',
      datas: [],
      openPopUp: false,
      openPopUpDelete: false,
      message: 'Are you sure you want to delete this contract status ?',
      tableMetaToDelete: {},
      statusCode: '',
      statusName: '',
      description: '',
      row: [],
      columns: [
        {
          name: 'statusCode',
          label: 'Status Code',
          options: {
            filter: true
          }
        },
        {
          label: 'Status Name',
          name: 'statusName',
          options: {
            filter: true
          }
        },
        {
          label: 'Description',
          name: 'description',
          options: {
            filter: true,
            setCellProps: () => ({
              style: {
                position: 'sticky',
                left: '0',
                zIndex: 100,
                width: '30%',
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
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_access ? (
                  <IconButton onClick={() => this.handleDetails(tableMeta)}>
                    <DetailsIcon color="secondary" />
                  </IconButton>
                ) : null}
                {thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_delete ? (
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
    ContractStatusService.getContractStatus().then(result => {
      this.setState({ datas: result.data });
    });
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

  // eslint-disable-next-line react/sort-comp
  handleDetails = (tableMeta) => {
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
        + tableMeta.rowIndex;
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const id = this.state.datas[index].contractStatusId;
    ContractStatusService.getContractStatusById(id).then(result => {
      this.setState({
        contractStatusId: id, statusCode: result.data.statusCode, statusName: result.data.statusName, description: result.data.description, openPopUp: true
      });
    });
  }

  // code 10 a ne pas supprimer
  handleDelete = (tableMeta) => {
    this.setState({ openPopUpDelete: true, tableMetaToDelete: tableMeta });
    const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
        + tableMeta.rowIndex;
    this.setState({ contractStatusToDelete: true, tableMetaToDelete: tableMeta });
    /* const id = this.state.datas[index].contractStatusId;

     const { statusName } = this.state.datas[index];
     ContractService.checkContractStatus(id).then(result => {
       if (result.data.length > 0) {
         this.setState({ message: 'contract status ' + statusName + ' is already used in other contract', disbaleDelete: true });
       } else {
         this.setState({ message: 'Are you sure you want to delete this contract status', disbaleDelete: false });
       }
     }); */
    /*   const index = tableMeta.tableState.page * tableMeta.tableState.rowsPerPage
        + tableMeta.rowIndex;
    const id = this.state.datas[index].contractStatusId;
    const code = this.state.datas[index].statusCode;
    if (code !== 10) {
      ContractStatusService.deleteContractStatusById(id).then(result => {
        this.setState({ datas: result.data });
      });
    } */
  };

  deleteConfirme = () => {
    const { tableMetaToDelete } = this.state;
    const index = tableMetaToDelete.tableState.page * tableMetaToDelete.tableState.rowsPerPage
        + tableMetaToDelete.rowIndex;
    const id = this.state.datas[index].contractStatusId;
    const code = this.state.datas[index].statusCode;
    if (code !== 10) {
      ContractStatusService.deleteContractStatusById(id).then(result => {
        /* this.setState({ datas: result.data });
      }); */
        if (result.status === 200) {
          notification('success', 'contract status deleted');
          ContractStatusService.getContractStatus().then(result1 => {
            this.setState({ datas: result1.data });
          });
        }
      })
        .catch(err => notification('danger', err.response.data.errors));
    } else {
      notification('danger', 'you cant delete contract status with code = 10');
    }
    this.setState({ openPopUpDelete: false });
  }

  handleCloseDelete = () => {
    this.setState({ openPopUpDelete: false, tableMetaToDelete: {} });
  };

  handleClose = () => {
    this.setState({ openPopUp: false });
  };

  handleSave = () => {
    const {
      statusCode, statusName, description, contractStatusId, datas
    } = this.state;
    let exist = false;
    const ContractStatus = {
      statusCode, statusName, description, contractStatusId
    };
    datas.map(row => {
      if (row.statusCode === 10) exist = true;
    });
    if (statusCode !== '10' || !exist) {
      if (statusName.toUpperCase() !== 'FINISHED') {
        ContractStatusService.updateContractStatus(ContractStatus).then(result => {
          if (result.status === 200) {
            notification('success', 'Contract status updated');
            ContractStatusService.getContractStatus().then(result2 => {
              this.setState({ datas: result2.data, openPopUp: false });
            });
          }
        })
          .catch(err => notification('danger', err.response.data.errors));
        this.setState({ openPopUp: false });
      }
    }
  };

  handleChange = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  render() {
    const {
      columns, openPopUp, datas, statusCode, statusName, description, openPopUpDelete, message
    } = this.state;
    const {
      logedUser
    } = this.props;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_export) {
      exportButton = true;
    }

    const excludeAttributes = ['contractStatusId']

    const options = {
      filter: true,
      selectableRows: false,
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      downloadOptions: { filename: 'Contract status.csv' },
      print: exportButton,
      rowsPerPage: 10,
      customToolbar: () => (
        <CustomToolbar
          csvData={datas}
          url="/app/gestion-financial/Contract-Status/Add-Status"
          tooltip="add new Status"
          fileName="Contract status"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_export}
        />
      )
    };

    return (
      <div>
        <MUIDataTable
          title="The Status List"
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
          fullWidth="md"
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
                <Grid item xs={12} md={8}>
                  <TextField
                    id="outlined-basic"
                    label="Status Code"
                    variant="outlined"
                    name="statusCode"
                    value={statusCode}
                    inputProps={{ maxLength: 10 }}
                    required
                    fullWidth
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="outlined-basic"
                    label="Status Name"
                    variant="outlined"
                    name="statusName"
                    value={statusName}
                    required
                    fullWidth
                    onChange={this.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField
                    id="outlined-basic"
                    label="Description "
                    variant="outlined"
                    name="description"
                    value={description}
                    fullWidth
                    onChange={this.handleChange}
                  />
                  <br />
                  <br />
                </Grid>
              </Grid>
            </div>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            {thelogedUser.userRoles[0].actionsNames.financialModule_contractStatus_modify ? (
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
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          fullWidth={false}
          maxWidth="md"
        >
          <DialogTitle id="alert-dialog-slide-title"> Delete contract status </DialogTitle>
          <DialogContent dividers>
            <Typography
              style={{
                color: 'red',
                marginRight: 20,
                width: '100%'
              }}
            >
              {message}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={this.handleCloseDelete}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.deleteConfirme}
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
const StatusBlockMapped = connect(
  mapStateToProps,
  null
)(StatusBlock);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <StatusBlockMapped changeTheme={changeTheme} classes={classes} />;
};
