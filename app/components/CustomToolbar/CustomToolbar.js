import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import GetAppIcon from '@material-ui/icons/GetApp';
import PropTypes from 'prop-types';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { withStyles } from '@material-ui/core/styles';
import styles from './CustomToolbar-jss';
import history from '../../utils/history';
import welcomecommercialpic from "../../containers/Pages/Welcome/welcomeCommercial.png";

class CustomToolbar extends React.Component {
  handleClick = () => {
    const { csvData, fileName, excludeAttributes } = this.props;
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    csvData.forEach(function(v) {
        delete v.actionTypeId;
        delete v.legalCategoryTypeId;
      excludeAttributes.forEach(function(attr) {
        delete v[attr];
      });
      });
   /* for (let i = 0, len = csvData.length; i < len; ++i)
      dup_array[i] = csvData[i];
      dup_array.forEach((v) => {
      delete v.actionTypeId;
      delete v.legalCategoryTypeId;
    //  delete v.contractTypeId;
    });*/

    const ws = XLSX.utils.json_to_sheet(csvData);

    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  handleGoToAddClient = () => {
    const { url } = this.props;
    if (url == '/app/gestion-commercial/sectorsCompany') {
     // history.push(url, { createSector: true });
      history.push({
        pathname: url,
        state: { createSector: true}
      });
    } else {
      history.push(url, {});
    }
  }

  render() {
    const {
      classes, tooltip, hasAddRole, hasExportRole
    } = this.props;
    if (hasAddRole == undefined && hasExportRole == undefined) {
      return (
        <React.Fragment>
          <Tooltip title="export in Excel" className={classes.toolbarBtn}>
            <IconButton onClick={this.handleClick}>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={tooltip} className={classes.toolbarBtn}>
            <IconButton onClick={this.handleGoToAddClient}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {hasExportRole ? (
          <Tooltip title="export in Excel" className={classes.toolbarBtn}>
            <IconButton onClick={this.handleClick}>
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        ) : (null)
        }
        {hasAddRole ? (
          <Tooltip title={tooltip} className={classes.toolbarBtn}>
            <IconButton onClick={this.handleGoToAddClient}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        ) : (null)
        }
      </React.Fragment>
    );
  }
}
CustomToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  csvData: PropTypes.array.isRequired,
  url: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired
};
export default withStyles(styles, { name: 'CustomToolbar' })(CustomToolbar);
