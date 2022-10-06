import React from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import styles from './sector-jss';
import SectorConfigService from '../../Services/SectorConfigService';
import SectorService from '../../Services/SectorService';
import { getAllPrimarySectorCompany, getAllSubChildSectorCompany } from '../../../redux/sectorsCompany/actions';

class SectorBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sectors: [],
      countryName: '',
      selectedValue: '',
      sector1: { firstSectorId: '', firstSectorName: '', firstSectorDescription: '' },
      sectorConfig: [],
      idSector: ''
    };
  }

  componentDidMount() {
    const { getAllPrimarySectorCompany } = this.props;
    SectorService.getSectorsType('primary').then(({ data }) => {
      this.setState({ sectors: data, open: true });
      //   this.setState({ selectedValue: this.props.allSubSectorChildComapnys });
    });
    getAllPrimarySectorCompany();
    const { getAllSubChildSectorCompany } = this.props;
    getAllSubChildSectorCompany('empty');
  }

  handleChange = (ev) => {
    const { getAllSubChildSectorCompany } = this.props;
    getAllSubChildSectorCompany((ev.target.value).firstSectorName);
    this.setState({ [ev.target.name]: ev.target.value,    selectedValue: '', });
  };

  handleCheck = (ev, selctedrow, index) => {
    this.setState({ selectedValue: index });
    const { sectorsConfig } = this.props;
    if (selctedrow.thirdSectorId !== '') {
      sectorsConfig(selctedrow);
    } else if (selctedrow) {
      sectorsConfig(selctedrow.secondSectorId);
    } else {
      sectorsConfig(selctedrow);
    }
  };

  render() {
    const {
      classes, allSectorComapnys, allSubSectorChildComapnysAdd, sectorSelctedName
    } = this.props;
    const {
      sectors, sector1, sectorConfig, selectedValue
    } = this.state;

    return (
      <div>
        <Typography variant="subtitle2" component="h2">
          Please, choose the primary sector
        </Typography>
        <FormControl className={classes.textField} fullWidth required>
          <InputLabel>Primary Sector</InputLabel>
          <Select
            id="select"
            name="sector1"
            value={sector1}
            onChange={this.handleChange}
            onOpen={this.handleOpen}
          >
            {
              allSectorComapnys && allSectorComapnys.map((sect) => (
                <MenuItem key={sect.firstSectorId} value={sect}>
                  {sect.firstSectorName}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Primary Sector</TableCell>
                <TableCell align="right">Secondary Sector</TableCell>
                <TableCell align="right">Third Sector</TableCell>
                {/* <TableCell align="right">Sector Leader</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {allSubSectorChildComapnysAdd && allSubSectorChildComapnysAdd.map((currElement, index) => (
                <TableRow key={index}>
                  <TableCell padding="checkbox">
                    <Radio
                      checked={selectedValue === index}
                      color="primary"
                      onChange={event => this.handleCheck(event, currElement, index)
                      }
                      name="radio-button-demo"
                      value={index}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {currElement.firstSectorName}
                  </TableCell>
                  <TableCell align="right">{currElement.secondSectorName}</TableCell>
                  <TableCell align="right">{currElement.thirdSectorName}</TableCell>
                  {/* <TableCell align="right">***</TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  // primarySectors
  allSectorComapnys: state.getIn(['sectorCompany']).allSectorPimaryComapnys,
  sectorComapnyResponse: state.getIn(['sectorCompany']).sectorComapnyResponse,
  isLoading: state.getIn(['sectorCompany']).isLoading,
  errors: state.getIn(['sectorCompany']).errors,
  // allsubsectorof selected parent sector
  allSubSectorChildComapnysAdd: state.getIn(['sectorCompany']).allSubSectorChildComapnys,
  subsectorComapnyResponse: state.getIn(['sectorCompany']).subsectorComapnyResponse,
  isLoadingSubSector: state.getIn(['sectorCompany']).isLoading,
  errorsSubSector: state.getIn(['sectorCompany']).errors,

});
const mapDispatchToProps = dispatch => bindActionCreators({
  getAllPrimarySectorCompany,
  getAllSubChildSectorCompany
}, dispatch);

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(SectorBlock));
