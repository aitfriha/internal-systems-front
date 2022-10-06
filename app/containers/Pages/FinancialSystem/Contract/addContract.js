import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock } from 'dan-components';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import { Image } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { KeyboardDatePicker } from '@material-ui/pickers';
import history from '../../../../utils/history';
import CurrencyService from '../../../Services/CurrencyService';
import ContractStatusService from '../../../Services/ContractStatusService';
import FinancialCompanyService from '../../../Services/FinancialCompanyService';
import CommercialOperationService from '../../../Services/CommercialOperationService';
import ClientService from '../../../Services/ClientService';
import FunctionalStructureService from '../../../Services/FunctionalStructureService';
import { getAllCountry } from '../../../../redux/country/actions';
import { getAllStateByCountry } from '../../../../redux/stateCountry/actions';
import { getAllCityByState } from '../../../../redux/city/actions';
import { addClientCommercial, getAllClient } from '../../../../redux/client/actions';
import ContractService from '../../../Services/ContractService';
import { ThemeContext } from '../../../App/ThemeWrapper';
import notification from '../../../../components/Notification/Notification';
import styles from '../../AbsenceRequest/absenceRequest-jss';
import {
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles(styles);
const inputContractDoc = React.createRef();
const inputPurchaseOrderDoc = React.createRef();
const inputProposalDoc = React.createRef();
const inputTechnicalProposalDoc = React.createRef();
const inputEconomicalProposalDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];
class AddContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contractDoc: {},
      proposalOneDoc: {},
      proposalEconomicalDoc: {},
      proposalTechnicalDoc: {},
      proposalOneExtension: '',
      proposalEconomicalExtension: '',
      proposalTechnicalExtension: '',
      purchaseOrderDoc: {},
      contractDocExtension: '',
      purchaseOrderDocExtension: '',
      stateValue: '',
      cityValue: '',
      DesableLevel2: true,
      DesableLevel3: true,
      maxValue: [],
      errorEquality: false,
      contractTitle: '',
      client: '',
      clients: [],
      operation: '',
      operations: [],
      commercialOperations: [],
      company: '',
      state: '',
      status: [],
      companies: [],
      taxeIdentityNumber: '',
      currentCity: '',
      level1: '',
      level2: '',
      level3: '',
      functionalStructureLevelId: '',
      levels: [],
      levelChild2: [],
      levelChild3: [],
      signedDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      finalReelDate: new Date(),
      contractTradeVolume: 0,
      contractTradeVolumeEuro: 0,
      currencies: [],
      currencyId: '',
      currency: {},
      currencyCode: '',
      changeFactor: 0,
      paymentsBDDays: 0,
      nbrConcepts: ['1'],
      conceptType: [0, 1],
      conceptValue: [],
      conceptValueLocal: [],
      conceptValueEuro: [],
      conceptTotalAmount: 0,
      conceptTotalAmountEuro: 0,
      penalties: false,
      penaltyQuantity: [],
      penaltyValue: [],
      penaltyCost: [],
      penaltyPer: [],
      penaltyMaxValue: '',
      penaltyMaxType: 1,
      penaltiesListe: [1],
      purchaseOrderDocumentation: '',
      purchaseOrders: [1],
      purchaseOrderNumber: [],
      purchaseOrderReceiveDate: new Date(),
      insure: false,
      firstDayInsured: null,
      lastDayInsured: null,
      amountInsured: '',
      amountInsuredEuro: 0,
      proposalDocumentation: '',
      proposalDocumentationDuo: [],
      proposalDocumentations: ['1'],
      insureDocumentation: [],
      // insureDocumentations: ['1'],
      contractDocumentation: [],
      contractDocumentations: ['1'],
      contractDocDescreption: [],
      radio: 'oneProposal',
      open: false,
      open2: false,
      open3: false,
      open4: false,
      openDoc: true,
      insureDocumentations: [{ inputDoc: React.createRef(), doc: {}, docExtension: '' }]
    };
  }

  componentDidMount() {
    const {
      // eslint-disable-next-line react/prop-types
      changeTheme
    } = this.props;
    changeTheme('greyTheme');
    // eslint-disable-next-line no-shadow,react/prop-types
    const { getAllCountry } = this.props;
    getAllCountry();
    // services calls
    CurrencyService.getFilteredCurrency().then(result => {
      this.setState({ currencies: result.data });
    });
    ContractStatusService.getContractStatus().then(result => {
      this.setState({ status: result.data });
    });
    FinancialCompanyService.getCompany().then(result => {
      this.setState({ companies: result.data });
    });
    CommercialOperationService.getCommercialOperationNotInContracts().then(result => {
      console.log(result.data.payload);
      this.setState({ operations: result.data.payload });
    });
    ClientService.getClients().then(result => {
      this.setState({ clients: result.data.payload });
    });
    FunctionalStructureService.getLevelByType('Level 1').then(result => {
      this.setState({ levels: result.data.payload });
    });
    const {
      penaltyQuantity, penaltyCost, penaltyPer, conceptType
    } = this.state;
    conceptType[0] = 0;

    penaltyQuantity[0] = 0;
    penaltyCost[0] = 0;
    penaltyPer[0] = 0;

    conceptType[1] = 1;

    penaltyQuantity[1] = 1;
    penaltyCost[1] = 1;
    penaltyPer[1] = 1;
    this.setState({
      penaltyQuantity, penaltyCost, penaltyPer, conceptType
    });
  }
  handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  };

  handleChangeCountry = (ev, value) => {
    // eslint-disable-next-line no-shadow,react/prop-types
    const { getAllStateByCountry } = this.props;
    getAllStateByCountry(value.countryId);
    this.setState({ stateValue: '', cityValue: '', currentCity: '' });
  };

  handleChangeState = (ev, value) => {
    // eslint-disable-next-line no-shadow,react/prop-types
    const { getAllCityByState } = this.props;
    getAllCityByState(value.stateCountryId);
    this.setState({ stateValue: value, cityValue: '', currentCity: '' });
  };

  handleChangeCity = (ev, value) => {
    this.setState({ currentCity: value.cityId, cityValue: value });
  };

  handleChangeLevel1 = (ev) => {
    FunctionalStructureService.getLevelChild(ev.target.value).then(result => {
      this.setState({ [ev.target.name]: ev.target.value, functionalStructureLevelId: ev.target.value });
      if (result.status === 200) {
        if ((result.data).length > 0) {
          this.setState({ levelChild2: result.data, levelChild3: [], DesableLevel2: false, });
        } else {
          this.setState({
            levelChild2: [], levelChild3: [], DesableLevel2: true, DesableLevel3: true
          });
        }
      }
    })
      .catch(err => notification('danger', err.response.data.errors));
  }

  handleChangeLevel2 = (ev) => {
    this.setState({
      functionalStructureLevelId: ev.target.value
    });
    FunctionalStructureService.getLevelChild(ev.target.value).then(result => {
      if (result.status === 200) {
        if ((result.data).length > 0) {
          this.setState({ levelChild3: result.data, DesableLevel3: false });
        } else {
          this.setState({
            levelChild3: [], DesableLevel3: true
          });
        }
      }
    })
      .catch(err => notification('danger', err.response.data.errors));
    this.setState({ [ev.target.name]: ev.target.value });
  }

  handleChangeLevel3 = (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
    this.setState({
      functionalStructureLevelId: ev.target.value
    });
  }

  handleChangeDate= (ev) => {
    this.setState({ [ev.target.name]: ev.target.value });
  }

    handleChange = (ev) => {
      const {
        currencies, contractTradeVolume, operations, changeFactor, currency, conceptType, conceptValueEuro, conceptValueLocal, conceptValue, amountInsured
      } = this.state;
      if (ev.target.name === 'client') {
        const commercialOperations = operations.filter(row => row.client._id === ev.target.value);
        this.setState({ commercialOperations });
      }
      if (ev.target.name === 'currencyId') {
        let totalEuro = 0;
        let total = 0;
        currencies.map(currencyo => {
          if (currencyo.currencyId === ev.target.value) {
            this.setState({
              amountInsuredEuro: amountInsured * currencyo.changeFactor,
              contractTradeVolumeEuro: contractTradeVolume * currencyo.changeFactor,
              changeFactor: currencyo.changeFactor,
              currencyCode: currencyo.typeOfCurrency.currencyCode,
              currency: currencyo
            });
            for (let i = 0; i < conceptType.length; i++) {
              if (conceptType[i] === 1) {
                conceptValueEuro[i] = ((contractTradeVolume * conceptValue[i]) / 100) * currencyo.changeFactor;
                conceptValueLocal[i] = (contractTradeVolume * conceptValue[i]) / 100;
              }
              if (conceptType[i] === 2) {
                conceptValueEuro[i] = conceptValue[i] * currencyo.changeFactor;
                conceptValueLocal[i] = conceptValue[i] * 1;
              }
            }
          }
          return null;
        });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += row; });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += row; });
        this.setState({
          conceptValueEuro, conceptTotalAmountEuro: totalEuro, conceptTotalAmount: total
        });
        if (Number(contractTradeVolume) === total) {
          this.setState({
            errorEquality: false
          });
        } else {
          this.setState({
            errorEquality: true
          });
        }
      }
      if (ev.target.name === 'contractTradeVolume') {
        if (ev.target.value < 0) {
          ev.target.value = 0;
        }
        let totalEuro = 0;
        let total = 0;
        this.setState({ contractTradeVolumeEuro: ev.target.value * currency.changeFactor });
        for (let i = 0; i < conceptType.length; i++) {
          if (conceptType[i] === 1) {
            conceptValueEuro[i] = ((ev.target.value * conceptValue[i]) / 100) * changeFactor;
            conceptValueLocal[i] = (ev.target.value * conceptValue[i]) / 100;
          }
          if (conceptType[i] === 2) {
            conceptValueEuro[i] = conceptValue[i] * changeFactor;
            conceptValueLocal[i] = conceptValue[i] * 1;
          }
        }
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += row; });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += row; });
        this.setState({
          conceptValue, conceptValueLocal, conceptValueEuro, conceptTotalAmountEuro: totalEuro, conceptTotalAmount: total
        });
        if (Number(ev.target.value) === total) {
          this.setState({
            errorEquality: false
          });
        } else {
          this.setState({
            errorEquality: true
          });
        }
      }
      if (ev.target.name === 'amountInsured') {
        this.setState({ amountInsuredEuro: ev.target.value * changeFactor });
      }
      this.setState({ [ev.target.name]: ev.target.value });
    };

    handleConcept = (event, row) => {
      let totalEuro = 0;
      let total = 0;
      const {
        conceptType, conceptValue, conceptValueEuro, conceptValueLocal, contractTradeVolume, changeFactor, maxValue, purchaseOrderNumber
      } = this.state;
      if (event.target.name === 'conceptType') {
        conceptType[0] = 0;
        conceptType[row] = event.target.value;
        this.setState({ conceptType });
        if (event.target.value === 1) {
          conceptValueEuro[row] = ((contractTradeVolume * conceptValue[row]) / 100) * changeFactor;
          conceptValueLocal[row] = (contractTradeVolume * conceptValue[row]) / 100;
          maxValue[row] = 100;
          this.setState({ maxValue });
        }
        if (event.target.value === 2) {
          conceptValueEuro[row] = conceptValue[row] * changeFactor;
          conceptValueLocal[row] = conceptValue[row] * 1;
          maxValue[row] = contractTradeVolume;
          this.setState({ maxValue });
        }
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += row; });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += row; });
        this.setState({
          conceptValue, conceptValueLocal, conceptValueEuro, conceptTotalAmountEuro: totalEuro, conceptTotalAmount: total
        });
        if (Number(contractTradeVolume) === total) {
          this.setState({
            errorEquality: false
          });
        } else {
          this.setState({
            errorEquality: true
          });
        }
      }
      if (event.target.name === 'conceptValue') {
        if (event.target.value < 0 || event.target.value == '') {
          event.target.value = 0;
        }
        conceptValue[0] = 0;
        conceptValueEuro[0] = 0;
        conceptValueLocal[0] = 0;
        conceptValue[row] = event.target.value;
        if (conceptType[row] === 1) {
          conceptValueEuro[row] = ((contractTradeVolume * event.target.value) / 100) * changeFactor;
          conceptValueLocal[row] = (contractTradeVolume * event.target.value) / 100;
          maxValue[row] = 100;
          this.setState({ maxValue });
        }
        if (conceptType[row] === 2) {
          conceptValueEuro[row] = event.target.value * changeFactor;
          conceptValueLocal[row] = event.target.value * 1;
          maxValue[row] = contractTradeVolume;
          this.setState({ maxValue });
        }
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += row; });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += row; });
        this.setState({
          conceptValue, conceptValueLocal, conceptValueEuro, conceptTotalAmountEuro: totalEuro, conceptTotalAmount: total
        });
        if (Number(contractTradeVolume) === total) {
          this.setState({
            errorEquality: false
          });
        } else {
          this.setState({
            errorEquality: true
          });
        }
      }
      if (event.target.name === 'purchaseOrderNumber') {
        purchaseOrderNumber[0] = '';
        /*       if (event.target.value == '') {
          purchaseOrderNumber.splice(row, 1);
        } else { */
        purchaseOrderNumber[row] = event.target.value;
        /*   } */
        this.setState({ purchaseOrderNumber });
      }
      if (event.target.name === 'contractDocDescreption') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const tab = this.state.contractDocDescreption;
        tab[0] = 0;
        tab[row] = event.target.value;
        this.setState({ contractDocDescreption: tab });
      }
    }

  handlePenalty = (event, row) => {
    if (event.target.name === 'penaltyQuantity') {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const tab = this.state.penaltyQuantity;
      tab[0] = 0;
      tab[row] = event.target.value;
      this.setState({ penaltyQuantity: tab });
    }
    if (event.target.name === 'penaltyValue') {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const tab = this.state.penaltyValue;
      tab[0] = 0;
      tab[row] = event.target.value;
      this.setState({ penaltyValue: tab });
    }
    if (event.target.name === 'penaltyCost') {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const tab = this.state.penaltyCost;
      tab[0] = 0;
      tab[row] = event.target.value;
      this.setState({ penaltyCost: tab });
    }
    if (event.target.name === 'penaltyPer') {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const tab = this.state.penaltyPer;
      tab[0] = 0;
      tab[row] = event.target.value;
      this.setState({ penaltyPer: tab });
    }
  }

    handleCheck = (event) => {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const ok = !this.state.open;
      this.setState({ open: ok, insure: event.target.checked });
    }

    handleCheck2 = () => {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const ok2 = !this.state.open2;
      this.setState({ open2: ok2 });
    }

  handleCheck3 = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const ok3 = !this.state.open3;
    this.setState({ open3: ok3 });
  }

  handleCheck4 = (event) => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const ok4 = !this.state.open4;
    this.setState({ open4: ok4, penalties: event.target.checked });
  }

  handleOpenDoc3 = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const newElement = this.state.contractDocumentations.length + 1;
    // eslint-disable-next-line react/destructuring-assignment
    this.state.contractDocumentations.push(newElement);
    this.setState({ openDoc: true });
  }

  handleDeleteDoc3 = (row) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.contractDocumentations.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = this.state.contractDocumentations.filter(rows => rows !== row);
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs2 = this.state.contractDocDescreption.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs3 = this.state.contractDocumentation.filter((e, i) => i !== (row - 1));
      this.setState({ contractDocumentations: newDocs, contractDocDescreption: newDocs2, contractDocumentation: newDocs3 });
    }
  }

  handleOpenDoc = () => {
    const { insureDocumentations } = this.state;
    insureDocumentations.push({ inputDoc: React.createRef(), doc: {}, docExtension: '' });
    this.setState({
      insureDocumentations
    });
  }

  handleUploadDocClick = index => {
    const { insureDocumentations } = this.state;
    insureDocumentations[index].inputDoc.current.click();
  };

  handleDocChange = index => {
    const { insureDocumentations } = this.state;
    const lastDot = insureDocumentations[index].inputDoc.current.files[0].name.lastIndexOf(
      '.'
    );
    const ext = insureDocumentations[index].inputDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      insureDocumentations[index].doc = insureDocumentations[index].inputDoc.current.files[0];
      insureDocumentations[index].docExtension = ext;
      this.setState({
        insureDocumentations
      });
    }
  };

  handleDeleteDoc = (row) => {
    const { insureDocumentations } = this.state;
    if (insureDocumentations.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = insureDocumentations.filter((rows, index) => index != row);
      this.setState({ insureDocumentations: newDocs });
    }
  }

  handleOpenConcept = (row) => {
    const { conceptType, nbrConcepts } = this.state;
    const newElement = nbrConcepts.length + 1;
    nbrConcepts.push(newElement);
    conceptType[0] = 0;
    conceptType[Number(row) + 1] = 1;
    this.setState({ openDoc: true, conceptType });
  }

  handleDeleteConcept = (row) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.nbrConcepts.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const totalLocal = this.state.conceptTotalAmount; const localValue = this.state.conceptValueLocal[row]; const totalEuro = this.state.conceptTotalAmountEuro; const localEuro = this.state.conceptValueEuro[row];
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = this.state.nbrConcepts.filter(rows => rows !== row);
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newtypes = this.state.conceptType.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newValues = this.state.conceptValue.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newEuroValues = this.state.conceptValueEuro.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newLocalValues = this.state.conceptValueLocal.filter((e, i) => i !== (row));
      this.setState({
        nbrConcepts: newDocs, conceptType: newtypes, conceptValue: newValues, conceptValueLocal: newLocalValues, conceptValueEuro: newEuroValues, conceptTotalAmount: totalLocal - localValue, conceptTotalAmountEuro: totalEuro - localEuro
      });
    }
  }

  handleAddPenalty = (row) => {
    const {
      penaltyQuantity, penaltyCost, penaltyPer, penaltiesListe
    } = this.state;
    const newElement = penaltiesListe.length + 1;
    // eslint-disable-next-line react/destructuring-assignment
    this.state.penaltiesListe.push(newElement);
    this.setState({ openDoc: true });/* , () => {
      penaltyQuantity[row+1] = 1;
      this.setState({ penaltyQuantity });
    }); */
    penaltyQuantity[row + 1] = 1;
    penaltyCost[row + 1] = 1;
    penaltyPer[row + 1] = 1;
    this.setState({ penaltyQuantity, penaltyCost, penaltyPer });
  }

  handleDeletePenalty = (row) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.penaltiesListe.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = this.state.penaltiesListe.filter(rows => rows !== row);
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs2 = this.state.penaltyQuantity.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs3 = this.state.penaltyCost.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs4 = this.state.penaltyValue.filter((e, i) => i !== (row));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs5 = this.state.penaltyPer.filter((e, i) => i !== (row));
      this.setState({
        penaltiesListe: newDocs, penaltyQuantity: newDocs2, penaltyCost: newDocs3, penaltyValue: newDocs4, penaltyPer: newDocs5
      });
    }
  }

  handleOpenPurchase = (row) => {
    const { purchaseOrders, purchaseOrderNumber } = this.state;
    const newElement = purchaseOrders.length + 1;
    if (row > 1 && purchaseOrders.length == row) {
      if (purchaseOrderNumber[row] !== undefined && purchaseOrderNumber[row - 1] != '' && purchaseOrderNumber[row] != '') {
        purchaseOrders.push(newElement);
        this.setState({ openDoc: true });
      }
    }
    if (purchaseOrders.length == 1) {
      if (purchaseOrderNumber[row] !== undefined && purchaseOrderNumber[row] != '') {
        purchaseOrders.push(newElement);
        this.setState({ openDoc: true });
      }
    }
  }

  handleDeletePurchase = (row) => {
    const { purchaseOrders, purchaseOrderNumber } = this.state;
    if (purchaseOrders.length > 1) {
      const newDocs = purchaseOrders.filter((e, i) => i !== (row - 1));
      const newDocs2 = purchaseOrderNumber.filter((e, i) => i !== (row));
      for (let i = 0; i < newDocs.length; i++) {
        newDocs[i] = i + 1;
      }
      this.setState({ purchaseOrderNumber: newDocs2, purchaseOrders: newDocs });
    }
  }

    handleCreate = () => {
      const {
        contractDocDescreption, contractDocumentation, insureDocumentation, proposalDocumentation, proposalDocumentationDuo, purchaseOrderDocumentation,
        operation, company, state, taxeIdentityNumber, contractTitle,
        conceptType, conceptValue, conceptValueEuro, conceptValueLocal, conceptTotalAmount, conceptTotalAmountEuro,
        signedDate, startDate, endDate, finalReelDate, contractTradeVolume, contractTradeVolumeEuro,
        currencyId, paymentsBDDays, penaltyQuantity, penaltyValue, currentCity,
        penaltyCost, penaltyPer, purchaseOrderNumber, purchaseOrderReceiveDate,
        amountInsuredEuro,
        penaltiesListe, purchaseOrders, insureDocumentations, contractDocumentations, nbrConcepts, functionalStructureLevelId, insure, penalties, contractDoc, contractDocExtension,
        purchaseOrderDocExtension, purchaseOrderDoc, proposalOneDoc, proposalOneExtension, radio,
        proposalEconomicalDoc, proposalTechnicalDoc, proposalEconomicalExtension,
        proposalTechnicalExtension
      } = this.state;
      if (startDate == '') {
        notification('danger', 'start Date can not be empty');
        return;
      }
      if (signedDate == '') {
        notification('danger', 'signed Date date can not be empty');
        return;
      }
      if (endDate == '') {
        notification('danger', 'end Date can not be empty');
        return;
      }
      if (new Date(finalReelDate) < new Date(startDate) && finalReelDate != '') {
        notification('danger', 'Final real date must be more then start date');
        return;
      }

      if (new Date(endDate) < new Date(startDate)) {
        notification('danger', 'End date must be more then start date');
        return;
      }

      let {
        firstDayInsured, lastDayInsured, amountInsured, penaltyMaxValue, penaltyMaxType
      } = this.state;
      let purchaseOrderNumberList = [];
      purchaseOrderNumberList[0] = '';
      for (let index = 1; index < purchaseOrderNumber.length; index++) {
        if (purchaseOrderNumber[index] !== '') {
          purchaseOrderNumberList[index] = purchaseOrderNumber[index];
        }
      }
      if (purchaseOrderNumberList.length == 1) {
        purchaseOrderNumberList = [];
      }

      if (insure === false) {
        firstDayInsured = new Date();
        lastDayInsured = new Date();
        amountInsured = 0;
      }
      if (penalties === false) {
        penaltyMaxValue = 0;
        penaltyMaxType = 0;
      }
      const clientId = this.state.client;
      const financialContractAddrequest = {
        contractTitle,
        contractDocumentation,
        contractDocDescreption,
        taxeIdentityNumber,
        signedDate: signedDate != null ? new Date(signedDate) : null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        // finalReelDate: finalReelDate != '' ? new Date(finalReelDate).toISOString().slice(0, 10) : null,
        finalReelDate: new Date(finalReelDate),
        contractTradeVolume,
        currencyId,
        contractTradeVolumeEuro,
        paymentsBDDays,
        conceptTotalAmount,
        conceptTotalAmountEuro,
        conceptType,
        conceptValue,
        conceptValueEuro,
        conceptValueLocal,
        firstDayInsured: new Date(firstDayInsured),
        lastDayInsured: new Date(lastDayInsured),
        amountInsured,
        amountInsuredEuro,
        insureDocumentation,
        purchaseOrderNumber: purchaseOrderNumberList,
        purchaseOrderReceiveDate: new Date(purchaseOrderReceiveDate),
        purchaseOrderDocumentation,
        proposalDocumentation,
        proposalDocumentationDuo,
        penaltyQuantity,
        penaltyValue,
        penaltyCost,
        penaltyPer,
        penaltyMaxValue,
        penaltyMaxType,
        penaltiesListe,
        purchaseOrders,
        // insureDocumentations,
        contractDocumentations,
        nbrConcepts,
        companyId: company,
        clientId,
        commercialOperationId: operation,
        contractStatusId: state,
        cityId: currentCity,
        functionalStructureLevelId,
        insure,
        penalties,
        contractDocExtension,
        purchaseOrderDocExtension,
        proposalOneExtension,
        proposalEconomicalExtension,
        proposalTechnicalExtension
      };
      const docExtensionList = [];
      const formData = new FormData();
      if (contractDoc.constructor === File) {
        formData.append('contractDoc', contractDoc);
      } else {
        formData.append(
          'contractDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
      }
      if (purchaseOrderDoc.constructor === File) {
        formData.append('purchaseOrderDoc', purchaseOrderDoc);
      } else {
        formData.append(
          'purchaseOrderDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
      }
      if (radio === 'oneProposal') {
        if (proposalOneDoc.constructor === File) {
          formData.append('proposalOneDoc', proposalOneDoc);
        } else {
          formData.append(
            'proposalOneDoc',
            new Blob([], {
              type: 'application/json'
            })
          );
        }
        formData.append(
          'proposalEconomicalDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
        formData.append(
          'proposalTechnicalDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
      } else {
        formData.append(
          'proposalOneDoc',
          new Blob([], {
            type: 'application/json'
          })
        );
        // /////////////////
        if (proposalEconomicalDoc.constructor === File) {
          formData.append('proposalEconomicalDoc', proposalEconomicalDoc);
        } else {
          formData.append(
            'proposalEconomicalDoc',
            new Blob([], {
              type: 'application/json'
            })
          );
        }
        if (proposalTechnicalDoc.constructor === File) {
          formData.append('proposalTechnicalDoc', proposalTechnicalDoc);
        } else {
          formData.append(
            'proposalTechnicalDoc',
            new Blob([], {
              type: 'application/json'
            })
          );
        }
      }

      insureDocumentations.forEach(doc => {
        if (doc.doc.constructor === File) {
          docExtensionList.push(doc.docExtension);
          formData.append('insureDocumentations', doc.doc);
        }
      });
      formData.append('docExtensionList', docExtensionList);
      Object.keys(financialContractAddrequest).forEach(e => formData.append(e, financialContractAddrequest[e])
      );
      if (parseFloat(contractTradeVolume) === conceptTotalAmount) {
        ContractService.saveContract(formData).then(result => {
          if (result.status === 200) {
            notification('success', 'contract Added');
          }
          history.push('/app/gestion-financial/Contracts');
        })
          .catch(err => notification('danger', err.response.data.errors));
      } else {
        notification('danger', 'Trade Volume must be equal to Concept Total Amount in currency');
      }
    }

    handleGoBack = () => {
      history.push('/app/gestion-financial/Contracts');
    }

  handleChangeFile = e => {
    this.readURI(e);
  };

  handleChangeFile1 = e => {
    this.readURI1(e);
  };

  handleChangeFile2 = e => {
    this.readURI2(e);
  };

  handleChangeFile3 = e => {
    this.readURI3(e);
  };

  handleChangeFile4 = e => {
    this.readURI4(e);
  };

  readURI(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const file = this.state.contractDocumentation;
        file.push(ev.target.result);
        this.setState({ contractDocumentation: file });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  readURI1(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const file = this.state.insureDocumentation;
        file.push(ev.target.result);
        this.setState({ insureDocumentation: file });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  readURI2(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        this.setState({ purchaseOrderDocumentation: ev.target.result });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  readURI3(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        this.setState({ proposalDocumentation: ev.target.result });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  readURI4(e) {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const file = this.state.proposalDocumentationDuo;
        file.push(ev.target.result);
        this.setState({ proposalDocumentationDuo: file });
      }.bind(this);
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  handleUploadDocumentClick = (ev, inputNameDocument) => {
    if (inputNameDocument === 'inputPurchaseOrderDoc') {
      inputPurchaseOrderDoc.current.value = '';
      inputPurchaseOrderDoc.current.click();
    }
    if (inputNameDocument === 'inputContractDoc') {
      inputContractDoc.current.value = '';
      inputContractDoc.current.click();
    }
    if (inputNameDocument === 'inputProposalDoc') {
      inputProposalDoc.current.value = '';
      inputProposalDoc.current.click();
    }
    if (inputNameDocument === 'inputTechnicalProposalDoc') {
      inputTechnicalProposalDoc.current.value = '';
      inputTechnicalProposalDoc.current.click();
    }
    if (inputNameDocument === 'inputEconomicalProposalDoc') {
      inputEconomicalProposalDoc.current.value = '';
      inputEconomicalProposalDoc.current.click();
    }
  };

  handleContractDocChange = () => {
    const lastDot = inputContractDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputContractDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        contractDoc: inputContractDoc.current.files[0],
        contractDocExtension: ext
      });
    }
  };

  handleProposalDocChange = () => {
    const lastDot = inputProposalDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputProposalDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        proposalOneDoc: inputProposalDoc.current.files[0],
        proposalOneExtension: ext
      });
    }
  };

  handleEconomicalProposalDocChange = () => {
    const lastDot = inputEconomicalProposalDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputEconomicalProposalDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        proposalEconomicalDoc: inputEconomicalProposalDoc.current.files[0],
        proposalEconomicalExtension: ext
      });
    }
  };

  handleTechnicalProposalDocChange = () => {
    const lastDot = inputTechnicalProposalDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputTechnicalProposalDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        proposalTechnicalDoc: inputTechnicalProposalDoc.current.files[0],
        proposalTechnicalExtension: ext
      });
    }
  };

  handlePurchaseOrderDocChange = () => {
    const lastDot = inputPurchaseOrderDoc.current.files[0].name.lastIndexOf('.');
    const ext = inputPurchaseOrderDoc.current.files[0].name
      .substring(lastDot + 1)
      .toLowerCase();
    if (extList.includes(ext)) {
      this.setState({
        purchaseOrderDoc: inputPurchaseOrderDoc.current.files[0],
        purchaseOrderDocExtension: ext
      });
    }
  };

  render() {
    const {
      // eslint-disable-next-line react/prop-types
      allCountrys, allStateCountrys, allCitys, classes
    } = this.props;
    const conceptTypes = [
      {
        value: 1,
        label: 'Percentage % ',
      },
      {
        value: 2,
        label: 'Amount',
      }];
    const MaxValue = [
      {
        value: 1,
        label: 'Of the Value Of Contract',
      },
      {
        value: 2,
        label: 'Of the Value Of Purchase Order',
      }];
    const Quantities = [
      {
        value: '1',
        label: 'Per cent %',
      },
      {
        value: '2',
        label: 'Per Economic Volume',
      }];
    const penaltiesCost = [
      {
        value: '1',
        label: 'Per All The Volume Of Contract',
      },
      {
        value: '2',
        label: 'Per One Activity',
      }];
    const penaltiesPer = [
      {
        value: '1',
        label: 'Per Hour',
      },
      {
        value: '2',
        label: 'Per Day',
      },
      {
        value: '3',
        label: 'Per Week',
      },
      {
        value: '4',
        label: 'Per Month',
      }];
    const {
      client, operation, company, state, taxeIdentityNumber, nbrConcepts, radio, status, currencies, contractTitle,
      conceptType, conceptValue, conceptValueEuro, conceptValueLocal, conceptTotalAmount, conceptTotalAmountEuro,
      signedDate, startDate, endDate, finalReelDate, contractTradeVolume, companies, commercialOperations, clients, contractTradeVolumeEuro,
      penaltyMaxType, currencyId, currencyCode, paymentsBDDays, penalties, penaltyQuantity, penaltyValue, levels, amountInsuredEuro,
      penaltyCost, penaltyPer, penaltyMaxValue, penaltiesListe, purchaseOrderNumber, purchaseOrderReceiveDate, purchaseOrders,
      insure, firstDayInsured, lastDayInsured, amountInsured, proposal, open, open3, open4, level1, level2, level3, openDoc, contractDocDescreption, errorEquality, maxValue, levelChild2,
      levelChild3, DesableLevel2, DesableLevel3, stateValue, cityValue, insureDocumentations, contractDoc, purchaseOrderDoc,
      proposalOneDoc, proposalEconomicalDoc, proposalTechnicalDoc
    } = this.state;
    const title = brand.name + ' - Blank Page';
    const description = brand.desc;
    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <PapperBlock title="Client Contracts " desc="Create new client contract " icon="ios-add-circle">
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
          <Typography variant="subtitle2" component="h2" color="primary">
                        Contract Information
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12} md={3} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Select the client</InputLabel>
                <Select
                  name="client"
                  value={client}
                  onChange={this.handleChange}
                >
                  {
                    clients.map((clt) => (
                      <MenuItem key={clt.clientId} value={clt.clientId}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3} md={3}>
              <FormControl fullWidth required>
                <InputLabel>Select Operation</InputLabel>
                <Select
                  name="operation"
                  value={operation}
                  onChange={this.handleChange}
                >
                  {
                    commercialOperations.map((clt) => (
                      <MenuItem key={clt.commercialOperationId} value={clt.commercialOperationId}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Select Client Company Name</InputLabel>
                <Select
                  name="company"
                  value={company}
                  onChange={this.handleChange}
                >
                  {
                    companies.map((clt) => (
                      <MenuItem key={clt.financialCompanyId} value={clt.financialCompanyId}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <FormControl fullWidth required>
                <InputLabel>Select contract status</InputLabel>
                <Select
                  name="state"
                  value={state}
                  onChange={this.handleChange}
                >
                  {
                    status.map((clt) => (
                      <MenuItem key={clt.contractStatusId} value={clt.contractStatusId}>
                        {clt.statusName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12} md={3} sm={3}>
              <TextField
                id="contractTitle"
                label="Contract Title"
                name="contractTitle"
                value={contractTitle}
                onChange={this.handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={2} sm={2}>
              <Button
                style={{ marginTop: '22px' }}
                fullWidth
                variant="outlined"
                component="span"
                startIcon={<Image color="primary" />}
                className={
                  contractDoc.constructor === Object
                    ? classes.uploadAvatarEmptyContract
                    : classes.uploadAvatarDoneContract
                }
                onClick={event => this.handleUploadDocumentClick(event, 'inputContractDoc')}
              >
                contract document
              </Button>
              <input
                type="file"
                id="file"
                accept=".png, .jpg, .jpeg, .pdf, .tiff"
                ref={inputContractDoc}
                multiple={false}
                style={{ display: 'none' }}
                onChange={this.handleContractDocChange}
              />
            </Grid>
            <Grid xs={12} md={3} sm={3} item />
            <Grid xs={12} md={3} sm={3} item />
          </Grid>
          <br />
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="h2" color="primary">
                  Functional Structure Assigned
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Select Level 1</InputLabel>
                <Select
                  name="level1"
                  value={level1}
                  onChange={this.handleChangeLevel1}
                >
                  {
                    levels.map((clt) => (
                      <MenuItem key={clt.levelId} value={clt.levelId}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Select Level 2</InputLabel>
                <Select
                  name="level2"
                  value={level2}
                  onChange={this.handleChangeLevel2}
                  disabled={DesableLevel2}
                >
                  {
                    levelChild2.map((clt) => (
                      <MenuItem key={clt._id} value={clt._id}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={4}>
              <FormControl fullWidth required>
                <InputLabel>Select Level 3</InputLabel>
                <Select
                  name="level3"
                  value={level3}
                  onChange={this.handleChangeLevel3}
                  disabled={DesableLevel3}
                >
                  {
                    levelChild3.map((clt) => (
                      <MenuItem key={clt._id} value={clt._id}>
                        {clt.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} />
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12}>
              <Typography variant="subtitle2" component="h2" color="primary">
                  Taxe Identity
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <TextField
                id="taxeIdentityNumber"
                label="Taxe Identity Number"
                name="taxeIdentityNumber"
                value={taxeIdentityNumber}
                onChange={this.handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <Autocomplete
                id="combo-box-demo"
                options={allCountrys}
                getOptionLabel={option => option.countryName || ''}
                onChange={this.handleChangeCountry}
                style={{ marginTop: 15 }}
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Choose the country"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <Autocomplete
                id="combo-box-demo"
                options={allStateCountrys}
                value={stateValue}
                getOptionLabel={option => option.stateName || ''}
                onChange={this.handleChangeState}
                style={{ marginTop: 15 }}
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Choose the state"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3} sm={3}>
              <Autocomplete
                id="combo-box-demo"
                options={allCitys}
                value={cityValue}
                getOptionLabel={option => option.cityName || ''}
                onChange={this.handleChangeCity}
                style={{ marginTop: 15 }}
                renderInput={params => (
                  <TextField
                    fullWidth
                    {...params}
                    label="Choose the city"
                    variant="outlined"
                    required
                  />
                )}
              />
            </Grid>
          </Grid>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Dates Of Contract
          </Typography>
          <br />
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12} sm={7} md={5}>   
               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      name="signedDate"
                      label="Signed Date"
                      value={signedDate}
                      onChange={value => this.handleDateValue(value, 'signedDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={7} md={5}>
      
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="startDate"
                      name="startDate"
                      label="Start Date"
                      value={startDate}
                      onChange={value => this.handleDateValue(value, 'startDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={7} md={5}>

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="endDate"
                      name="endDate"
                      label="End Date"
                      value={endDate}
                      onChange={value => this.handleDateValue(value, 'endDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
            </Grid>
            <Grid item xs={12} sm={7} md={5}>
             
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="finalReelDate"
                      name="finalReelDate"
                      label="Real End Date"
                      value={finalReelDate}
                      onChange={value => this.handleDateValue(value, 'finalReelDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
            </Grid>
          </Grid>
          <br />
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                        Economic Value Of The Contract
          </Typography>
          <br />
          <br />
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={3}>
              <TextField
                id="Contract Trade Volume"
                label="Contract Trade Volume"
                type="number"
                name="contractTradeVolume"
                value={contractTradeVolume}
                onChange={this.handleChange}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth required>
                <InputLabel>Select Currency</InputLabel>
                <Select
                  name="currencyId"
                  value={currencyId}
                  onChange={this.handleChange}
                >
                  {
                    currencies.map((clt) => (
                      <MenuItem key={clt.currencyId} value={clt.currencyId}>
                        {clt.typeOfCurrency.currencyName}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="contractTradeVolumeEuro"
                label="Trade Value (Euro)"
                type="number"
                name="contractTradeVolumeEuro"
                value={contractTradeVolumeEuro}
                onChange={this.handleChange}
                fullWidth
                required
                InputProps={{
                  readOnly: true, inputProps: { min: 0 }
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="paymentsBDDays"
                label="Payments BD per Day"
                type="number"
                name="paymentsBDDays"
                value={paymentsBDDays}
                onChange={this.handleChange}
                InputProps={{ inputProps: { min: 0 } }}
                fullWidth
                required
              />
            </Grid>
          </Grid>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
            Method of Payment
          </Typography>
          <br />
          {nbrConcepts.map((row) => (
            <Grid
              key={row}
              container
              spacing={1}
              alignItems="flex-start"
              direction="row"
            >
              <Grid item xs={1} align="center">
                <Typography variant="subtitle2" component="h3" color="primary">
                  <br />
                  Concept
                  {' '}
                  { row }
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <FormControl fullWidth required>
                  <InputLabel>Select Type</InputLabel>
                  <Select
                    name="conceptType"
                    value={conceptType[row]}
                    onChange={event => this.handleConcept(event, row)}
                    defaultValue="1"
                  >
                    {
                      conceptTypes.map((clt) => (
                        <MenuItem key={clt.value} value={clt.value}>
                          {clt.label}
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="conceptValue"
                  label="Concept Value"
                  type="number"
                  name="conceptValue"
                  value={conceptValue[row]}
                  onChange={event => this.handleConcept(event, row)}
                  InputProps={{ inputProps: { min: 0, max: maxValue[row] } }}
                  fullWidth
                  required
                />
              </Grid>
              {conceptType[row] === 2 ? (
                <Grid item xs={2} />
              ) : (
                <Grid item xs={2}>
                  <TextField
                    id="conceptValueLocal"
                    label="Concept Value in Currency"
                    name="conceptValueLocal"
                    value={conceptValueLocal[row]}
                    type="number"
                    onChange={this.handleChange}
                    fullWidth
                    InputProps={{
                      readOnly: true, inputProps: { min: 0 }
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              )}
              <Grid item xs={1}>
                <TextField
                  id="conceptCurrency"
                  label="Currency code"
                  name="conceptCurrency"
                  value={currencyCode}
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  id="conceptValueEuro"
                  label="Concept Value in EURO"
                  name="conceptValueEuro"
                  value={conceptValueEuro[row]}
                  type="number"
                  onChange={this.handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: true, inputProps: { min: 0 }
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <br />
                <IconButton size="medium" color="primary" onClick={() => this.handleOpenConcept(row)}>
                  <AddIcon />
                </IconButton>
                <IconButton size="small" color="primary" onClick={() => this.handleDeleteConcept(row)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid
            container
            spacing={1}
            alignItems="flex-start"
            direction="row"
          >
            <Grid item xs={12} sm={3} md={3} />
            <Grid item xs={12} sm={3} md={3} align="center">
              <TextField
                id="conceptTotalAmount"
                label="Concept Total Amount in currency"
                name="conceptTotalAmount"
                value={conceptTotalAmount}
                type="number"
                onChange={this.handleChange}
                fullWidth
                error={errorEquality}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3} md={3} align="center">
              <TextField
                id="conceptTotalAmountEuro"
                label="Concept Total Amount in Euro"
                name="conceptTotalAmountEuro"
                value={conceptTotalAmountEuro}
                type="number"
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  readOnly: true, inputProps: { min: 0 }
                }}
              />
            </Grid>
          </Grid>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
                Details
          </Typography>
          <br />
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12} sm={7} md={3}>
              <FormControlLabel
                id="insure"
                name="insure"
                value={insure}
                control={<Checkbox color="primary" checked={insure} onChange={this.handleCheck} />}
                label="Insure"
                labelPlacement="start"
              />
              {open === false ? (
                <div />
              ) : (
                <div>
                  <TextField
                    id="firstDayInsured"
                    label="Insured First Day "
                    type="date"
                    name="firstDayInsured"
                    value={firstDayInsured}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    required
                  />
                  <TextField
                    id="lastDayInsured"
                    label="Insured last Date"
                    type="date"
                    name="lastDayInsured"
                    value={lastDayInsured}
                    onChange={this.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    required
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={7}>
                      <TextField
                        id="amountInsured"
                        label="Amount Insured"
                        type="number"
                        name="amountInsured"
                        value={amountInsured}
                        onChange={this.handleChange}
                        InputProps={{ inputProps: { min: 0 } }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        id="conceptCurrency"
                        label="Currency code"
                        name="conceptCurrency"
                        value={currencyCode}
                        onChange={this.handleChange}
                        fullWidth
                        InputProps={{
                          readOnly: true, inputProps: { min: 0 }
                        }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    id="amountInsuredEuro"
                    label="Amount Insured (Euro)"
                    type="number"
                    name="amountInsuredEuro"
                    value={amountInsuredEuro}
                    onChange={this.handleChange}
                    fullWidth
                    required
                    InputProps={{
                      readOnly: true, inputProps: { min: 0 }
                    }}
                  />
                  <br />
                  <br />
                  {/* eslint-disable-next-line react/destructuring-assignment */}
                  {insureDocumentations.map((doc, index) => (
                    <div key={index}>
                      <Grid container>
                        <Grid item xs={9}>
                          <Button
                            fullWidth
                            variant="outlined"
                            component="span"
                            startIcon={<Image color="primary" />}
                            className={
                              doc.doc.constructor === Object
                                ? classes.uploadAvatarEmptyContract
                                : classes.uploadAvatarDoneContract
                            }
                            onClick={() => this.handleUploadDocClick(index)}
                          >
                            Insure document
                          </Button>
                          <input
                            type="file"
                            id="file"
                            accept=".png, .jpg, .jpeg, .pdf, .tiff"
                            ref={doc.inputDoc}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={() => this.handleDocChange(index)}
                          />
                        </Grid>
                        <Grid item x={3}>
                          <IconButton size="small" color="primary" onClick={() => this.handleOpenDoc()}>
                            <AddIcon />
                          </IconButton>
                          <IconButton size="small" color="primary" onClick={() => this.handleDeleteDoc(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                      <br />
                    </div>
                  ))}
                </div>
              )}
            </Grid>
            <Grid item xs={12} sm={7} md={3}>
              {/*              <FormControlLabel
                id="purchaseOrder"
                name="purchaseOrder"
                value={purchaseOrder}
                control={<Checkbox color="primary" onChange={this.handleCheck2} />}
                label="Purchase Order"
                labelPlacement="start"
              /> */}
              <br />
              <Typography variant="subtitle2" component="h2" color="primary">
                Purchase Order *
              </Typography>
              <br />
              <div>
                {purchaseOrders.map((row) => (
                  <Grid container spacing={2} key={row}>
                    <Grid item xs={8}>
                      <TextField
                        id="purchaseOrderNumber"
                        label={'Purchase Order ' + row}
                        name="purchaseOrderNumber"
                        value={purchaseOrderNumber[row]}
                        onChange={event => this.handleConcept(event, row)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <br />
                      {/*                      <IconButton size="small" color="primary" onClick={() => this.handleOpenPurchase(row)}>
                        <AddIcon />
                      </IconButton>
                      <IconButton size="small" color="primary" onClick={() => this.handleDeletePurchase(row)}>
                        <DeleteIcon />
                      </IconButton> */}
                    </Grid>
                  </Grid>
                ))}
               
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      inputProps={{ readOnly: false }}
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="purchaseOrderReceiveDate"
                      name="purchaseOrderReceiveDate"
                      label="Purchase Order Receive Date"
                      value={purchaseOrderReceiveDate}
                      onChange={value => this.handleDateValue(value, 'purchaseOrderReceiveDate')
                      }
                      KeyboardButtonProps={{
                        'aria-label': 'change date'
                      }}
                      fullWidth
                      required
                    />
                  </MuiPickersUtilsProvider>
                <br />
                <Button
                  style={{ marginTop: '22px' }}
                  fullWidth
                  variant="outlined"
                  component="span"
                  startIcon={<Image color="primary" />}
                  className={
                    purchaseOrderDoc.constructor === Object
                      ? classes.uploadAvatarEmptyContract
                      : classes.uploadAvatarDoneContract
                  }
                  onClick={event => this.handleUploadDocumentClick(event, 'inputPurchaseOrderDoc')}
                >
                  purchase order document
                </Button>
                <input
                  type="file"
                  id="file"
                  accept=".png, .jpg, .jpeg, .pdf, .tiff"
                  ref={inputPurchaseOrderDoc}
                  multiple={false}
                  style={{ display: 'none' }}
                  onChange={this.handlePurchaseOrderDocChange}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={7} md={3}>
              <FormControlLabel
                id="proposal"
                name="proposal"
                value={proposal}
                control={<Checkbox color="primary" onChange={this.handleCheck3} />}
                label="Proposal"
                labelPlacement="start"
              />
              <br />
              {open3 === false ? (
                <div />
              ) : (
                <FormControl component="fieldset">
                  <RadioGroup aria-label="gender" name="radio" value={radio} onChange={this.handleChange}>
                    <FormControlLabel value="oneProposal" control={<Radio />} label="Technical & Economical" />
                    {radio === 'oneProposal' ? (
                      <FormControl>
                        <Button
                          style={{ marginTop: '8px' }}
                          fullWidth
                          variant="outlined"
                          component="span"
                          startIcon={<Image color="primary" />}
                          className={
                            proposalOneDoc.constructor === Object
                              ? classes.uploadAvatarEmptyContract
                              : classes.uploadAvatarDoneContract
                          }
                          onClick={event => this.handleUploadDocumentClick(event, 'inputProposalDoc')}
                        >
                          Technical & Economical Proposal
                        </Button>
                        <input
                          type="file"
                          id="file"
                          accept=".png, .jpg, .jpeg, .pdf, .tiff"
                          ref={inputProposalDoc}
                          multiple={false}
                          style={{ display: 'none' }}
                          onChange={this.handleProposalDocChange}
                        />
                      </FormControl>
                    ) : (
                      <div />
                    )}
                    <FormControlLabel value="separatedProposal" control={<Radio />} label="Separated Proposals" />
                    {radio === 'separatedProposal' ? (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Button
                            style={{ marginTop: '8px' }}
                            fullWidth
                            variant="outlined"
                            component="span"
                            startIcon={<Image color="primary" />}
                            className={
                              proposalTechnicalDoc.constructor === Object
                                ? classes.uploadAvatarEmptyContract
                                : classes.uploadAvatarDoneContract
                            }
                            onClick={event => this.handleUploadDocumentClick(event, 'inputTechnicalProposalDoc')}
                          >
                              Technical Proposal
                          </Button>
                          <input
                            type="file"
                            id="file"
                            accept=".png, .jpg, .jpeg, .pdf, .tiff"
                            ref={inputTechnicalProposalDoc}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={this.handleTechnicalProposalDocChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            style={{ marginTop: '8px' }}
                            fullWidth
                            variant="outlined"
                            component="span"
                            startIcon={<Image color="primary" />}
                            className={
                              proposalEconomicalDoc.constructor === Object
                                ? classes.uploadAvatarEmptyContract
                                : classes.uploadAvatarDoneContract
                            }
                            onClick={event => this.handleUploadDocumentClick(event, 'inputEconomicalProposalDoc')}
                          >
                              Economical Proposal
                          </Button>
                          <input
                            type="file"
                            id="file"
                            accept=".png, .jpg, .jpeg, .pdf, .tiff"
                            ref={inputEconomicalProposalDoc}
                            multiple={false}
                            style={{ display: 'none' }}
                            onChange={this.handleEconomicalProposalDocChange}
                          />
                        </Grid>
                      </Grid>
                    ) : (
                      <div />
                    )}
                  </RadioGroup>
                </FormControl>
              )}
            </Grid>
          </Grid>
          <br />
          <Typography variant="subtitle2" component="h2" color="primary">
            Others
          </Typography>
          <br />
          <Grid
            container
            spacing={1}
            alignItems="flex-start"
            direction="row"
            justify="space-around"
          >
            <Grid item xs={12}>
              <FormControlLabel
                id="penalties"
                name="penalties"
                value={penalties}
                control={<Checkbox color="primary" checked={penalties} onChange={this.handleCheck4} />}
                label="Penalties"
                labelPlacement="start"
              />
              {open4 === false ? (
                <div />
              ) : (
                <Grid container spacing={4}>
                  <Grid item xs={12} />
                  {
                    penaltiesListe.map((row) => (
                      <Grid container spacing={4} key={row}>
                        <Grid item xs={1} />
                        <Grid item xs={2}>
                          <FormControl fullWidth required>
                            <InputLabel>
                                Select Quantity
                              {penaltyQuantity[row]}
                            </InputLabel>
                            <Select
                              name="penaltyQuantity"
                              value={penaltyQuantity[row]}
                              defaultValue="1"
                              onChange={event => this.handlePenalty(event, row)}
                            >
                              {
                                Quantities.map((clt) => (
                                  <MenuItem key={clt.value} value={clt.value}>
                                    {clt.label}
                                  </MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            label="Penalty Value"
                            type="number"
                            name="penaltyValue"
                            value={penaltyValue[row]}
                            defaultValue="0"
                            onChange={event => this.handlePenalty(event, row)}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            InputProps={{
                              inputProps: { min: 0 }
                            }}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <FormControl fullWidth required>
                            <InputLabel>Select Value</InputLabel>
                            <Select
                              name="penaltyCost"
                              value={penaltyCost[row]}
                              defaultValue="1"
                              onChange={event => this.handlePenalty(event, row)}
                            >
                              {
                                penaltiesCost.map((clt) => (
                                  <MenuItem key={clt.value} value={clt.value}>
                                    {clt.label}
                                  </MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <FormControl fullWidth required>
                            <InputLabel>Select Unit</InputLabel>
                            <Select
                              name="penaltyPer"
                              value={penaltyPer[row]}
                              defaultValue="1"
                              onChange={event => this.handlePenalty(event, row)}
                            >
                              {
                                penaltiesPer.map((clt) => (
                                  <MenuItem key={clt.value} value={clt.value}>
                                    {clt.label}
                                  </MenuItem>
                                ))
                              }
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={2}>
                          <br />
                          <IconButton size="small" color="primary" onClick={() => this.handleAddPenalty(row)}>
                            <AddIcon />
                          </IconButton>
                          <IconButton size="small" color="primary" onClick={() => this.handleDeletePenalty(row)}>
                            <DeleteIcon />
                          </IconButton>
                          <br />
                          <br />
                        </Grid>
                      </Grid>
                    ))
                  }
                  <Grid item xs={12} />
                  <Typography variant="subtitle2" component="h2" color="primary" align="center">
                        Maximum Value Of Penalty
                  </Typography>
                  <Grid item xs={4}>
                    <br />
                    <TextField
                      id="penaltyMaxValue"
                      label="Penalty Maximum Value (%)"
                      type="number"
                      name="penaltyMaxValue"
                      value={penaltyMaxValue}
                      onChange={this.handleChange}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <br />
                    <FormControl fullWidth required>
                      <InputLabel>Select Type </InputLabel>
                      <Select
                        name="penaltyMaxType"
                        value={penaltyMaxType}
                        defaultValue={penaltyMaxType}
                        onChange={this.handleChange}
                      >
                        {
                          MaxValue.map((clt) => (
                            <MenuItem key={clt.value} value={clt.value}>
                              {clt.label}
                            </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
          <br />
          <br />
          <div align="center">
            <Button size="small" color="inherit" onClick={this.handleGoBack}>Cancel</Button>
            <Button variant="contained" color="primary" type="button" onClick={this.handleCreate}>
                            Save
            </Button>
          </div>
        </PapperBlock>
      </div>
    );
  }
}

AddContract.propTypes = {
};
const mapStateToProps = state => ({
  allCountrys: state.getIn(['countries']).allCountrys,
  countryResponse: state.getIn(['countries']).countryResponse,
  isLoading: state.getIn(['countries']).isLoading,
  errors: state.getIn(['countries']).errors,
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
});
const mapDispatchToProps = dispatch => bindActionCreators({
  getAllCountry,
  getAllStateByCountry,
  getAllCityByState,
  addClientCommercial,
  getAllClient
}, dispatch);

const AddContractMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddContract);

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles();
  return <AddContractMapped changeTheme={changeTheme} classes={classes} />;
};
