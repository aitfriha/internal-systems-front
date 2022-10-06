import React from 'react';
import MUIDataTable from 'mui-datatables';
import { withStyles } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';

import {
  Tooltip,
  Typography,
  Select,
  MenuItem,
  FormControl, Tabs, Dialog, DialogTitle, DialogContent, Grid, DialogActions, Button
} from '@material-ui/core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { showSpinner } from 'dan-redux/actions/uiActions';
// eslint-disable-next-line import/no-duplicates
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';
import axios from 'axios';
import CustomToolbar from '../../../components/CustomToolbar/CustomToolbar';
import styles from './staff-jss';

import { setStaff, getAllStaff, getStaffsPagination } from '../../../redux/staff/actions';
import Transition from '../../../components/Transition/transition';
import StaffService from '../../Services/StaffService';
import ENDPOINTS from '../../../api/endpoints';

class StaffBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: null,
      countPagination: 100,
      dispatchLoading: false,
      rowsPerPagePagination: 5,
      pagePagination: 0,
      numPages: null,
      pageNumber: null,
      staffs: [],
      isOpenDocumentsList: false,
      isOpenDocument: false,
      isOpenCvDocument: false,
      columnsType: 'generalInformation',
      generalInformationColumns: [
        {
          name: 'staffId',
          label: 'Staff Id',
          options: {
            viewColumns: false,
            display: false,
            filter: false,
          }
        },
        {
          label: 'Photo',
          name: 'photo',
          options: {
            print: false,
            viewColumns: false,
            filter: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: value => (
              <React.Fragment>
                <Avatar alt="User Name" src={value} />
              </React.Fragment>
            )
          }
        },
        {
          name: 'firstName',
          label: 'First Name',
          options: this.columnOptions
        },
        {
          name: 'fatherFamilyName',
          label: 'Father Family Name',
          options: this.columnOptions
        },

        {
          name: 'motherFamilyName',
          label: 'Mother Family Name',
          options: this.columnOptions
        },
        {
          name: 'studiesListName',
          label: 'Studies',
          options: {
            print: false,
            filter: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          name: 'cvDoc',
          label: 'curriculum vitae',
          options: {
            filter: false,
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                {value && value[0] ? (
                  <IconButton
                    onClick={() => this.handleOpenCvDocumentListDialog(tableMeta)}
                  >
                    <VisibilityIcon color="secondary" />
                  </IconButton>
                ) : (
                  <div>-</div>
                )}
              </React.Fragment>
            )
          }
        },
        {
          label: 'Company',
          name: 'companyName',
          options: this.columnOptions
        },
        {
          name: 'personalPhone',
          label: 'Phone',
          options: this.columnOptions
        },
        {
          name: 'companyPhone',
          label: 'Company phone',
          options: this.columnOptions
        },
        {
          name: 'companyMobilePhone',
          label: 'Company mobile phone',
          options: this.columnOptions
        },
        {
          name: 'companyEmail',
          label: 'Company email',
          options: this.columnOptions
        },
        {
          label: 'Residence country',
          name: 'countryName',
          options: this.columnOptions
        },
        {
          name: 'functionalStructureLevelName',
          label: 'Functional level',
          options: {
            filter: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            /* customBodyRender: value => (
              <React.Fragment>{value[0] ? value[0].name : ''}</React.Fragment>
            ) */
          }
        },

        {
          name: 'Actions',
          options: {
            print: false,
            viewColumns: false,
            filter: false,
            sort: false,
            empty: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                <Tooltip title="View Staff">
                  <IconButton
                    onClick={() => this.viewStaffProfile(value, tableMeta)}
                  >
                    <Visibility color="secondary" />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          }
        }
      ],
      contractInformationColumns: [
        {
          name: 'staffId',
          label: 'Staff Id',
          options: {
            display: false,
            viewColumns: false,
          }
        },
        {
          label: 'Photo',
          name: 'photo',
          options: {
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: value => (
              <React.Fragment>
                <Avatar alt="User Name" src={value} />
              </React.Fragment>
            )
          }
        },
        {
          name: 'associateOffice',
          label: 'Associate Office',
          options: this.columnOptions
        },

        {
          name: 'hiringCountry',
          label: 'Hiring Country',
          options: this.columnOptions
        },

        {
          name: 'townContract',
          label: 'Town Contract',
          options: this.columnOptions
        },
        {
          label: 'Personal Number',
          name: 'personalNumber',
          options: this.columnOptions
        },
        {
          name: 'highDate',
          label: 'Hiring Date',
          options: this.columnOptions
        },
        {
          name: 'lowDate',
          label: 'Low Date',
          options: this.columnOptions
        },
        /*        {
          name: 'companyMobilePhone',
          label: 'Company mobile phone',
          options: this.columnOptions
        }, */
        {
          name: 'registrationDate',
          label: 'Registration Date',
          options: this.columnOptions
        },
        {
          label: 'PreContract Date',
          name: 'preContractDate',
          options: this.columnOptions
        },
        {
          name: 'contractTypeName',
          label: 'Contract Type',
          options: this.columnOptions
        },
        {
          name: 'legalCategoryTypeName',
          label: 'Legal Category Type',
          options: this.columnOptions
        },
        {
          name: 'contractModelName',
          label: 'Contract Model',
          options: this.columnOptions
        },
        {
          name: 'Actions',
          options: {
            filter: false,
            sort: false,
            empty: true,
            viewColumns: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                <Tooltip title="View Staff">
                  <IconButton
                    onClick={() => this.viewStaffProfile(value, tableMeta)}
                  >
                    <Visibility color="secondary" />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          }
        }
      ],
      economicInformationColumns: [
        {
          name: 'staffId',
          label: 'Staff Id',
          options: {
            display: false
          }
        },
        {
          label: 'Photo',
          name: 'photo',
          options: {
            print: false,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: value => (
              <React.Fragment>
                <Avatar alt="User Name" src={value} />
              </React.Fragment>
            )
          }
        },
        {
          name: 'currencyName',
          label: 'Local Currency',
          options: this.columnOptions
        },
        {
          name: 'contractSalary',
          label: 'Contract Salary',
          options: this.columnOptions
        },
        {
          name: 'contractSalaryInEuro',
          label: 'Contract Salary (€)',
          options: this.columnOptions
        },
        {
          name: 'contractSalaryDateGoing',
          label: 'Contract Salary Date Going',
          options: this.columnOptions
        },
        {
          name: 'contractSalaryDateOut',
          label: 'Contract Salary Date Out',
          options: this.columnOptions
        },
        {
          name: 'companyContractCost',
          label: 'Company Contract Cost',
          options: this.columnOptions
        },
        {
          name: 'companyContractCostInEuro',
          label: 'Company Contract (€)',
          options: this.columnOptions
        },
        {
          name: 'companyContractCostDateGoing',
          label: 'Company Contract Cost Date Going',
          options: this.columnOptions
        },
        {
          name: 'companyContractCostDateOut',
          label: 'Company Contract Cost Date Out',
          options: this.columnOptions
        },
        {
          name: 'expenses',
          label: 'Expenses',
          options: this.columnOptions
        },
        {
          name: 'expensesInEuro',
          label: 'Expenses (€)',
          options: this.columnOptions
        },
        {
          name: 'expensesDateGoing',
          label: 'Expenses Date Going',
          options: this.columnOptions
        },
        {
          name: 'expensesDateOut',
          label: 'Expenses Date Out',
          options: this.columnOptions
        },
        {
          label: 'Company Expenses Cost',
          name: 'companyExpensesCost',
          options: this.columnOptions
        },
        {
          label: 'Company Expenses Cost (€)',
          name: 'companyExpensesCostInEuro',
          options: this.columnOptions
        },
        {
          label: 'Company Expenses Cost Date Going',
          name: 'companyExpensesCostDateGoing',
          options: this.columnOptions
        },
        {
          label: 'Company Expenses Cost Date Out',
          name: 'companyExpensesCostDateOut',
          options: this.columnOptions
        },
        {
          name: 'objectives',
          label: 'Objectives',
          options: this.columnOptions
        },
        {
          name: 'objectivesInEuro',
          label: 'Objectives (€)',
          options: this.columnOptions
        },
        {
          name: 'objectivesDateGoing',
          label: 'Objectives Date Going',
          options: this.columnOptions
        },
        {
          name: 'objectivesDateOut',
          label: 'Objectives Date Out',
          options: this.columnOptions
        },
        {
          name: 'companyObjectivesCost',
          label: 'Company Objectives Cost',
          options: this.columnOptions
        },
        {
          name: 'companyObjectivesCostInEuro',
          label: 'Company Objectives Cost (€)',
          options: this.columnOptions
        },
        {
          name: 'companyObjectivesCostDateGoing',
          label: 'Company Objectives Cost Date Going',
          options: this.columnOptions
        },
        {
          name: 'companyObjectivesCostDateOut',
          label: 'Company Objectives Cost Date Out',
          options: this.columnOptions
        },
        {
          name: 'totalCompanyCost',
          label: 'Total Company Cost',
          options: this.columnOptions
        },
        {
          name: 'totalCompanyCostInEuro',
          label: 'Total Company Cost (€)',
          options: this.columnOptions
        },
        {
          name: 'totalCompanyCostDateGoing',
          label: 'Total Company Cost Date Going',
          options: this.columnOptions
        },
        {
          name: 'totalCompanyCostDateOut',
          label: 'Total Company Cost Date Out',
          options: this.columnOptions
        },
        {
          name: 'Actions',
          options: {
            filter: false,
            print: false,
            sort: false,
            empty: true,
            setCellProps: () => this.setCellProps(),
            setCellHeaderProps: () => this.setCellHeaderProps(),
            customBodyRender: (value, tableMeta) => (
              <React.Fragment>
                <Tooltip title="View Staff">
                  <IconButton
                    onClick={() => this.viewStaffProfile(value, tableMeta)}
                  >
                    <Visibility color="secondary" />
                  </IconButton>
                </Tooltip>
              </React.Fragment>
            )
          }
        }
      ]
    };
  }

  editingPromiseResolve = () => {};

  columnOptions = {
    filter: true,
    setCellProps: () => this.setCellProps(),
    setCellHeaderProps: () => this.setCellHeaderProps()
  };

  componentDidMount() {
    const { columnsType, searchText } = this.state;
    const { getStaffsPagination } = this.props;
    this.setState({
      dispatchLoading: true
    });
    const promise = new Promise(resolve => {
    //  getStaffsPagination(page, rowsPerPage, columnsType);
      this.handleChangePage(this.state.pagePagination, 5, this.state.columnsType, searchText);
      this.editingPromiseResolve = resolve;
    });
    promise.then(() => {
      const { allStaff } = this.props;
      const staffs = [];
      allStaff.data.forEach(staff => {
        const factor = staff.changeFactor;
        const contractSalaryInEuro = staff.contractSalary * factor;
        const companyContractCostInEuro = staff.companyContractCost * factor;
        const expensesInEuro = staff.expenses * factor;
        const companyExpensesCostInEuro = staff.companyExpensesCost * factor;
        const objectivesInEuro = staff.objectives * factor;
        const companyObjectivesCostInEuro = staff.companyObjectivesCost * factor;
        const totalCompanyCostInEuro = staff.totalCompanyCost * factor;
        const newStaff = {
          ...staff,
          contractSalaryInEuro: contractSalaryInEuro.toFixed(5),
          companyContractCostInEuro: companyContractCostInEuro.toFixed(5),
          expensesInEuro: expensesInEuro.toFixed(5),
          companyExpensesCostInEuro: companyExpensesCostInEuro.toFixed(5),
          objectivesInEuro: objectivesInEuro.toFixed(5),
          companyObjectivesCostInEuro: companyObjectivesCostInEuro.toFixed(5),
          totalCompanyCostInEuro: totalCompanyCostInEuro.toFixed(5)
        };
        staffs.push(newStaff);
      });
      this.setState({
        staffs, dispatchLoading: false, countPagination: allStaff.total
      });
    });
  }

  // get staff by id from the database
  viewStaffProfile = (value, tableMeta) => {
    const { setStaff, allStaff, showSpinner } = this.props;
    const { showProfile } = this.props;
    this.setState({ dispatchLoading: true });
    StaffService.getStaffById(tableMeta.rowData[0]).then(({ data }) => {
      setStaff(data);
      showSpinner(true);
      showProfile(true);
      this.setState({ dispatchLoading: false });
    });
  };

  setCellProps = () => ({
    style: {
      whiteSpace: 'nowrap',
    /*  position: 'sticky',
      left: '0',
      zIndex: 100 */
    }
  });

  setCellHeaderProps = () => ({
    style: {
      whiteSpace: 'nowrap',
    /*  position: 'sticky',
      left: 0,
      zIndex: 101 */
    }
  });

  componentDidUpdate(prevProps, prevState) {
    const { allStaff } = this.props;
    const { columnsType, pagePagination } = this.state;
    if (prevState.columnsType !== columnsType) {
      this.handleChangePage(pagePagination, 5);
      // this.setState({dispatchLoading: false});
    }
  }

  renderColumns = () => {
    const {
      columnsType,
      generalInformationColumns,
      contractInformationColumns,
      economicInformationColumns
    } = this.state;
    // this.setState({dispatchLoading: false});
    if (columnsType === 'generalInformation') {
      return generalInformationColumns;
    }
    if (columnsType === 'contractInformation') {
      return contractInformationColumns;
    }
    if (columnsType === 'economicInformation') {
      return economicInformationColumns;
    }
    return [];
  };

  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
    // this.handleChangePage(0, 5);
    this.setState({ dispatchLoading: true });
  };


  handleOpenDocumentListDialog = tableMeta => {
    const { staffs } = this.state;
    const staffSelectedStudies = staffs.filter(
      absenceRequest => absenceRequest.staffId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenDocumentsList: true,
      staffSelectedStudies
    });
  };

  handleOpenDocumentDialog = index => {
    const { staffSelectedStudies } = this.state;
    this.setState({
      isOpenDocument: true,
      docExtension: staffSelectedStudies.studiesListDocExtension[index],
      docIndex: index
    });
  };

  handleClose = () => {
    this.setState({
      isOpenDocumentsList: false,
    });
  };

  handleFileDataType = ext => {
    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'jpg':
        return 'image/jpeg';
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'tiff':
        return 'image/tiff';
    }
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
      pageNumber: 1
    });
  };

  handleCloseDocumentDialog = () => {
    this.setState({
      isOpenDocument: false,
      docExtension: '',
      docIndex: 0,
      pageNumber: 1
    });
  };

  renderFile = () => {
    const { staffSelectedStudies, docExtension, docIndex } = this.state;
    return `data:${this.handleFileDataType(docExtension)};base64,${
      staffSelectedStudies.studiesListDoc[docIndex]
    }`;
  };

  handleCloseDocumentListDialog = () => {
    this.setState({
      isOpenDocumentsList: false,
      staffSelectedStudies: null
    });
  };

  changePage = (offset) => {
    const { pageNumber } = this.state;
    this.setState({
      pageNumber: pageNumber + offset
    });
  };

  previousPage = () => {
    this.changePage(-1);
  };

  nextPage = () => {
    this.changePage(1);
  }

  handleOpenCvDocumentListDialog = tableMeta => {
    const { staffs } = this.state;
    const staffSelectedStudies = staffs.filter(
      absenceRequest => absenceRequest.staffId === tableMeta.rowData[0]
    )[0];
    this.setState({
      isOpenCvDocument: true,
      staffSelectedStudies
    });
  };

  renderCvDocumentFile = () => {
    const { staffSelectedStudies } = this.state;
    return `data:${this.handleFileDataType(staffSelectedStudies.cvDocExtension)};base64,${staffSelectedStudies.cvDoc}`;
  };

  handleCloseCvDocumentDialog = () => {
    this.setState({
      isOpenCvDocument: false,
      staffSelectedStudies: null
    });
  };

  handleDownload = () => {
    const { staffSelectedStudies, docIndex, docExtension } = this.state;
    const doc = staffSelectedStudies.studiesListDoc[docIndex];
    // const docName = `${absenceRequestSelected.name}_Document`;
    const docName = `${docIndex + 1}_certification document`;
    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(docExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  fileToBase64 = file => {
    const binaryString = window.atob(file);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  };

  handleDownloadCvDocument = () => {
    const { staffSelectedStudies } = this.state;
    const doc = staffSelectedStudies.cvDoc;
    const docName = `${staffSelectedStudies.fatherFamilyName}_cv`;

    const documentBase64 = this.fileToBase64(doc);
    const documentBlob = new Blob([documentBase64], {
      type: this.handleFileDataType(staffSelectedStudies.cvDocExtension)
    });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(documentBlob);
    link.download = docName;
    link.click();
  };

  handleChangePage = (page, rowsPerPage, searchTextx) => {
    const { columnsType, searchText } = this.state;
    const { getStaffsPagination } = this.props;
    const promise = new Promise(resolve => {
      getStaffsPagination(page, rowsPerPage, columnsType, searchText);
      this.editingPromiseResolve = resolve;
    });
    promise.then(() => {
      const { allStaff } = this.props;
      const staffs = [];
      allStaff.data.forEach(staff => {
        const factor = staff.changeFactor;
        const contractSalaryInEuro = staff.contractSalary * factor;
        const companyContractCostInEuro = staff.companyContractCost * factor;
        const expensesInEuro = staff.expenses * factor;
        const companyExpensesCostInEuro = staff.companyExpensesCost * factor;
        const objectivesInEuro = staff.objectives * factor;
        const companyObjectivesCostInEuro = staff.companyObjectivesCost * factor;
        const totalCompanyCostInEuro = staff.totalCompanyCost * factor;
        const newStaff = {
          ...staff,
          contractSalaryInEuro: contractSalaryInEuro.toFixed(5),
          companyContractCostInEuro: companyContractCostInEuro.toFixed(5),
          expensesInEuro: expensesInEuro.toFixed(5),
          companyExpensesCostInEuro: companyExpensesCostInEuro.toFixed(5),
          objectivesInEuro: objectivesInEuro.toFixed(5),
          companyObjectivesCostInEuro: companyObjectivesCostInEuro.toFixed(5),
          totalCompanyCostInEuro: totalCompanyCostInEuro.toFixed(5)
        };
        staffs.push(newStaff);
      });
      this.setState({
        staffs, pagePagination: page, dispatchLoading: false, countPagination: allStaff.total
      });
    });
  }


  handleChangePage2 = (page, rowsPerPage, searchText) => {
    this.setState({
      dispatchLoading: true
    });
    const { columnsType } = this.state;
    StaffService.getListStaffPagination(page, rowsPerPage, columnsType, searchText)
      .then((response) => {
        const staffs = [];
        response.data.payload.data.forEach(staff => {
          const factor = staff.changeFactor;
          const contractSalaryInEuro = staff.contractSalary * factor;
          const companyContractCostInEuro = staff.companyContractCost * factor;
          const expensesInEuro = staff.expenses * factor;
          const companyExpensesCostInEuro = staff.companyExpensesCost * factor;
          const objectivesInEuro = staff.objectives * factor;
          const companyObjectivesCostInEuro = staff.companyObjectivesCost * factor;
          const totalCompanyCostInEuro = staff.totalCompanyCost * factor;
          const newStaff = {
            ...staff,
            contractSalaryInEuro: contractSalaryInEuro.toFixed(5),
            companyContractCostInEuro: companyContractCostInEuro.toFixed(5),
            expensesInEuro: expensesInEuro.toFixed(5),
            companyExpensesCostInEuro: companyExpensesCostInEuro.toFixed(5),
            objectivesInEuro: objectivesInEuro.toFixed(5),
            companyObjectivesCostInEuro: companyObjectivesCostInEuro.toFixed(5),
            totalCompanyCostInEuro: totalCompanyCostInEuro.toFixed(5)
          };
          staffs.push(newStaff);
        });
        this.setState({
          staffs, pagePagination: page, dispatchLoading: false, rowsPerPagePagination: rowsPerPage, countPagination: response.data.payload.total
        });
        // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
      });
  }

  handleSearch2= (page, rowsPerPage, searchText) => {
    if (searchText && searchText.length > 2) {
      this.setState({
        dispatchLoading: true, searchText
      });
      const { columnsType } = this.state;
      StaffService.getListStaffPagination(page, rowsPerPage, columnsType, searchText)
        .then((response) => {
          const staffs = [];
          response.data.payload.data.forEach(staff => {
            const factor = staff.changeFactor;
            const contractSalaryInEuro = staff.contractSalary * factor;
            const companyContractCostInEuro = staff.companyContractCost * factor;
            const expensesInEuro = staff.expenses * factor;
            const companyExpensesCostInEuro = staff.companyExpensesCost * factor;
            const objectivesInEuro = staff.objectives * factor;
            const companyObjectivesCostInEuro = staff.companyObjectivesCost * factor;
            const totalCompanyCostInEuro = staff.totalCompanyCost * factor;
            const newStaff = {
              ...staff,
              contractSalaryInEuro: contractSalaryInEuro.toFixed(5),
              companyContractCostInEuro: companyContractCostInEuro.toFixed(5),
              expensesInEuro: expensesInEuro.toFixed(5),
              companyExpensesCostInEuro: companyExpensesCostInEuro.toFixed(5),
              objectivesInEuro: objectivesInEuro.toFixed(5),
              companyObjectivesCostInEuro: companyObjectivesCostInEuro.toFixed(5),
              totalCompanyCostInEuro: totalCompanyCostInEuro.toFixed(5)
            };
            staffs.push(newStaff);
          });
          this.setState({
            staffs,
            pagePagination: page,
            dispatchLoading: false,
            rowsPerPagePagination: rowsPerPage,
            countPagination: response.data.payload.total
          });
          // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
        });
    }
    if (searchText === null) {
      this.setState({
        dispatchLoading: true, searchText
      });
      const { columnsType } = this.state;
      StaffService.getListStaffPagination(page, rowsPerPage, columnsType, null)
        .then((response) => {
          const staffs = [];
          response.data.payload.data.forEach(staff => {
            const factor = staff.changeFactor;
            const contractSalaryInEuro = staff.contractSalary * factor;
            const companyContractCostInEuro = staff.companyContractCost * factor;
            const expensesInEuro = staff.expenses * factor;
            const companyExpensesCostInEuro = staff.companyExpensesCost * factor;
            const objectivesInEuro = staff.objectives * factor;
            const companyObjectivesCostInEuro = staff.companyObjectivesCost * factor;
            const totalCompanyCostInEuro = staff.totalCompanyCost * factor;
            const newStaff = {
              ...staff,
              contractSalaryInEuro: contractSalaryInEuro.toFixed(5),
              companyContractCostInEuro: companyContractCostInEuro.toFixed(5),
              expensesInEuro: expensesInEuro.toFixed(5),
              companyExpensesCostInEuro: companyExpensesCostInEuro.toFixed(5),
              objectivesInEuro: objectivesInEuro.toFixed(5),
              companyObjectivesCostInEuro: companyObjectivesCostInEuro.toFixed(5),
              totalCompanyCostInEuro: totalCompanyCostInEuro.toFixed(5)
            };
            staffs.push(newStaff);
          });
          this.setState({
            staffs,
            pagePagination: page,
            dispatchLoading: false,
            rowsPerPagePagination: rowsPerPage,
            countPagination: response.data.payload.total
          });
          // response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'));
        });
    }
  }

  handleOnSearchClose= (page, rowsPerPage, searchText) => {
    this.setState({
      searchText: null
    });
    this.handleChangePage2(page, rowsPerPage, null);
  }


  render() {
    const {
      classes,
      isLoadingStaff,
      staffResponse,
      errorStaff,
      logedUser
    } = this.props;
    const {
      columnsType, staffs, isOpenDocumentsList, staffSelectedStudies, isOpenDocument, docExtension, numPages, pageNumber, isOpenCvDocument, pagePagination, dispatchLoading, rowsPerPagePagination,
      countPagination
    } = this.state;
    const thelogedUser = JSON.parse(logedUser);
    let exportButton = false;
    if (thelogedUser.userRoles[0].actionsNames.hh_staff_personalInformationManagement_export) {
      exportButton = true;
    }
    const excludeAttributes = ['staffId', 'photo', 'addressId', 'cityId', 'stateId', 'countryId', 'staffDocuments',
      'staffContractId', 'companyId', 'contractTypeId', 'contractTypeStateId', 'contractTypeCountryId',
      'staffEconomicContractInformationId', 'cvDoc', 'cvDocExtension', 'studiesListName', 'studiesListDoc', 'studiesListDocExtension', 'currencyId', 'functionalStructureLevels', 'administrativeStructureLevels'];
    const options = {
      serverSide: true,
      fixedHeader: true,
      fixedSelectColumn: false,
      filter: true,
      selectableRows: 'none',
      filterType: 'dropdown',
      responsive: 'stacked',
      download: exportButton,
      rowsPerPageOptions: [5, 10, 100],
      print: exportButton,
      rowsPerPage: rowsPerPagePagination,
      page: pagePagination,
      count: countPagination,
      pagination: true,
      // page: pagePagination,
      onTableChange: (action, tableState) => {
        // console.log(action, tableState);
        // a developer could react to change on an action basis or
        // examine the state as a whole and do whatever they want
        console.log(action);
        switch (action) {
          case 'changePage':
            this.handleChangePage2(tableState.page, tableState.rowsPerPage, tableState.searchText);
            break;
          case 'changeRowsPerPage':
            this.handleChangePage2(tableState.page, tableState.rowsPerPage, tableState.searchText);
            break;
          case 'search':
            this.handleSearch2(tableState.page, tableState.rowsPerPage, tableState.searchText);
            break;
          case 'onSearchClose':
            this.handleOnSearchClose(tableState.page, tableState.rowsPerPage);
            break;
        }
      },
      // rowsPerPageOptions: [],
      // count: 100,
      /*   onTableChange: (action, tableState) => {
        console.log(action, tableState);
        switch (action) {
          case 'changePage':
            this.changePage(tableState.page, tableState);
            break;
          default:
            console.log('action not handled.');
        }
      }, */
      /* pagination: {
        next: "Next Page",
        previous: "Previous Page",
        rowsPerPage: "Rows per page:",
        displayRows: "of",
      }, */
      customToolbar: () => (
        <CustomToolbar
          csvData={staffs}
          url="/app/hh-rr/staff/create-staff"
          tooltip="add new staff"
          fileName="staff"
          excludeAttributes={excludeAttributes}
          hasAddRole={thelogedUser.userRoles[0].actionsNames.hh_staff_personalInformationManagement_create}
          hasExportRole={thelogedUser.userRoles[0].actionsNames.hh_staff_personalInformationManagement_export}
        />
      )
    };

    const menuItems = [
      { name: 'General Information', value: 'generalInformation' },
      { name: 'Contract Information', value: 'contractInformation' },
      { name: 'Economic Information', value: 'economicInformation' }
    ];


    !isLoadingStaff
      && staffResponse
      && this.editingPromiseResolve(staffResponse);
    !isLoadingStaff && !staffResponse && this.editingPromiseResolve(errorStaff);

    return (
      <div>
        <div className={classes.divInline}>
          {/*          <Typography
            variant="subtitle1"
            style={{
              color: '#000',
              fontFamily: 'sans-serif , Arial',
              fontSize: '15px',
              fontWeight: 'bold',
              opacity: 0.6,
              marginRight: 20
            }}
          >
            Show :
          </Typography> */}
          <FormControl className={classes.formControl} style={{ width: '50%' }}>
            <Select
              name="columnsType"
              value={columnsType}
              onChange={this.handleChange}
            >
              {menuItems.map(item => {
                if (item.value == 'generalInformation' && thelogedUser.userRoles[0].actionsNames.hh_staff_personalInformationManagement_access) {
                  return (
                    <MenuItem key={item.name} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                }
                if (item.value == 'contractInformation' && thelogedUser.userRoles[0].actionsNames.hh_staff_contractInformationManagement_access) {
                  return (
                    <MenuItem key={item.name} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                }
                if (item.value == 'economicInformation' && thelogedUser.userRoles[0].actionsNames.hh_staff_economicObjectiveManagement_access) {
                  return (
                    <MenuItem key={item.name} value={item.value}>
                      {item.name}
                    </MenuItem>
                  );
                }

                return (
                  <MenuItem key={item.name} value={item.value} disabled>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <MUIDataTable
          title=""
          data={staffs}
          columns={this.renderColumns()}
          options={options}
        />
        <Dialog
          maxWidth="xs"
          TransitionComponent={Transition}
          fullWidth
          aria-labelledby="changeProfilePic"
          open={dispatchLoading}
          classes={{
            paper: classes.paper
          }}
        >
          <CircularProgress className={classes.circularProgress} size={90} thickness={1} color="secondary" />
        </Dialog>
        <Dialog
          maxWidth="xs"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenDocumentsList}
          /*  classes={{
            paper: classes.paper
          }} */
        >
          <DialogTitle id="docList">Studies and certifications</DialogTitle>
          <DialogContent>
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {staffSelectedStudies && staffSelectedStudies.studiesListName && (
                staffSelectedStudies.studiesListName.map((doc, index) => (
                  <Grid
                    container
                    spacing={3}
                    alignItems="flex-start"
                    direction="row"
                  >
                    <Grid item xs={8}>
                      {staffSelectedStudies.studiesListName[index]}
                    </Grid>
                    {staffSelectedStudies.studiesListDoc[index] ? (
                      <Grid item xs={4}>
                        <IconButton
                          style={{ marginTop: '-9px' }}
                          onClick={() => this.handleOpenDocumentDialog(index)}
                        >
                          <VisibilityIcon color="secondary" />
                        </IconButton>
                      </Grid>
                    ) : (
                      <Grid item xs={4}>
                        <IconButton
                          style={{ marginTop: '-9px' }}
                          disabled
                        >
                          <VisibilityIcon color="secondary" />
                        </IconButton>
                      </Grid>
                    )}
                  </Grid>
                ))
              )
              }
            </div>

          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseDocumentListDialog}
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="lg"
          TransitionComponent={Transition}
          fullWidth
          scroll="body"
          aria-labelledby="changeProfilePic"
          open={isOpenDocument}
          /* classes={{
              paper: classes.paper
            }} */
        >
          <DialogTitle id="SaveFormula">Studies document preview</DialogTitle>
          <DialogContent>
            <div
              style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}
            >
              {staffSelectedStudies && docExtension !== '' ? (
                docExtension === 'pdf' ? (
                  <>
                    <Document
                      file={this.renderFile()}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                      onLoadError={console.error}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
                    <div>
                      <div className="pagec">
                            Page
                        {' '}
                        {pageNumber || (numPages ? 1 : '--')}
                        {' '}
                            of
                        {' '}
                        {numPages || '--'}
                      </div>
                      <div className="buttonc">
                        <button
                          type="button"
                          disabled={pageNumber <= 1}
                          onClick={this.previousPage}
                          className="Pre"

                        >
                              Previous
                        </button>
                        <button
                          type="button"
                          disabled={pageNumber >= numPages}
                          onClick={this.nextPage}
                        >
                              Next
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <img src={this.renderFile()} alt="Document" />
                )
              ) : (
                <div />
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseDocumentDialog}
              color="primary"
            >
              Close
            </Button>
            <Button onClick={this.handleDownload} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          maxWidth="lg"
          TransitionComponent={Transition}
          fullWidth
          scroll="paper"
          aria-labelledby="changeProfilePic"
          open={isOpenCvDocument}
          /*       classes={{
              paper: classes.paper
            }} */
        >
          <DialogTitle id="cv">Curriculum vitae</DialogTitle>
          <DialogContent>
            {staffSelectedStudies && staffSelectedStudies.cvDoc && (
              <div
                style={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }}
              >
                {
                  staffSelectedStudies !== '' ? (
                    staffSelectedStudies.cvDocExtension === 'pdf' ? (
                      <>
                        <Document
                          file={this.renderCvDocumentFile()}
                          onLoadSuccess={this.onDocumentLoadSuccess}
                          onLoadError={console.error}
                        >
                          <Page pageNumber={pageNumber} />
                        </Document>
                        <div>
                          <div className="pagec">
                                  Page
                            {' '}
                            {pageNumber || (numPages ? 1 : '--')}
                            {' '}
                                  of
                            {' '}
                            {numPages || '--'}
                          </div>
                          <div className="buttonc">
                            <button
                              type="button"
                              disabled={pageNumber <= 1}
                              onClick={this.previousPage}
                              className="Pre"

                            >
                                    Previous
                            </button>
                            <button
                              type="button"
                              disabled={pageNumber >= numPages}
                              onClick={this.nextPage}
                            >
                                    Next
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <img src={this.renderFile()} alt="Document" />
                    )
                  ) : (
                    <div />
                  )
                }
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={this.handleCloseCvDocumentDialog}
              color="primary"
            >
              Close
            </Button>
            <Button onClick={this.handleDownloadCvDocument} color="primary">
              Download
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
StaffBlock.propTypes = {
  classes: PropTypes.object.isRequired,
  showProfile: PropTypes.func.isRequired,
  setStaff: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  staff: state.getIn(['staffs']).selectedStaff,
  allStaff: state.getIn(['staffs']).allStaff,
  staffResponse: state.getIn(['staffs']).staffResponse,
  isLoadingStaff: state.getIn(['staffs']).isLoading,
  errorStaff: state.getIn(['staffs']).errors,

  logedUser: localStorage.getItem('logedUser')
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    getAllStaff,
    getStaffsPagination,
    setStaff,
    showSpinner
  },
  dispatch
);

const StaffBlockMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffBlock);

export default withStyles(styles)(StaffBlockMapped);
