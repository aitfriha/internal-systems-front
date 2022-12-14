import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Grid, TextField } from '@material-ui/core';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import history from '../../../../utils/history';
import PurchaseOrderAcceptanceService from '../../../Services/PurchaseOrderAcceptanceService';

import { ThemeContext } from '../../../App/ThemeWrapper';
import notification from '../../../../components/Notification/Notification';

const useStyles = makeStyles();

class AddPurchaseOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      generatedPurchase: '',
      adminAcceptance: '',
      operationalAcceptance: '',
    };
  }

  componentDidMount() {
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
  }

    handleSubmit = () => {
      const {
        generatedPurchase, adminAcceptance, operationalAcceptance
      } = this.state;
      const PurchaseOrderAcceptance = {
        generatedPurchase, adminAcceptance, operationalAcceptance
      };
      PurchaseOrderAcceptanceService.savePurchaseOrderAcceptance(PurchaseOrderAcceptance).then(result => {
        if (result.status === 200) {
          notification('success', 'Purchase order acceptance Added');
        }
        history.push('/app/gestion-financial/Purchase-Order');
      })
        .catch(err => notification('danger', err.response.data.errors));
    }

    handleGoBack = () => {
      history.push('/app/gestion-financial/Purchase-Order');
    }

    handleChange = (ev) => {
      this.setState({ [ev.target.name]: ev.target.value });
    };

    render() {
      const title = brand.name + ' - Add New Purchase Order';
      const { desc } = brand;
      const {
        generatedPurchase, adminAcceptance, operationalAcceptance
      } = this.state;
      return (
        <div>
          <Helmet>
            <title>{title}</title>
            <meta name="description" content={desc} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={desc} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={desc} />
          </Helmet>
          <PapperBlock
            title="New Purchase Order "
            desc="Please, Fill in the fields"
            icon="ios-add-circle"
          >
            <Grid container spacing={1}>
              <Grid item xs={11} />
              <Grid item xs={1}>
                <Tooltip title="Back to List">
                  <IconButton onClick={() => this.handleGoBack()}>
                    <KeyboardBackspaceIcon color="secondary" />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              alignItems="flex-start"
              direction="row"
              justify="center"

            >
              <Grid item xs={12} md={6}>
                <TextField
                  id="generatedPurchase"
                  label="Purchase Order Generated By"
                  variant="outlined"
                  name="generatedPurchase"
                  value={generatedPurchase}
                  required
                  fullWidth
                  onChange={this.handleChange}
                />
                <br />
                <br />
                <TextField
                  id="adminAcceptance"
                  label="Administration Acceptance By"
                  variant="outlined"
                  name="adminAcceptance"
                  value={adminAcceptance}
                  fullWidth
                  onChange={this.handleChange}
                />
                <br />
                <br />
                <TextField
                  id="operationalAcceptance"
                  label="Operational Acceptance By"
                  variant="outlined"
                  name="operationalAcceptance"
                  value={operationalAcceptance}
                  fullWidth
                  onChange={this.handleChange}
                />
              </Grid>
            </Grid>
            <div align="center">
              <br />
              <br />
              <Button size="small" color="inherit" onClick={this.handleGoBack}>Cancel</Button>
              <Button variant="contained" color="primary" type="button" onClick={this.handleSubmit}>
                            Save
              </Button>
            </div>
          </PapperBlock>
        </div>
      );
    }
}

const AddCurrencyMapped = connect()(AddPurchaseOrder);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AddCurrencyMapped changeTheme={changeTheme} classes={classes} />;
};
