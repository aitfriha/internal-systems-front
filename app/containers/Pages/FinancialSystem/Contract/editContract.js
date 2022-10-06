import React from 'react';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
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
import { withStyles } from '@material-ui/core/styles';
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
//import styles from '../../Companies/companies-jss';
import ContractService from '../../../Services/ContractService';
import notification from '../../../../components/Notification/Notification';
import history from '../../../../utils/history';
import styles from '../../AbsenceRequest/absenceRequest-jss';
import SuppliersPaymentService from '../../../Services/SuppliersPaymentService';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const inputProposalDoc = React.createRef();
const inputTechnicalProposalDoc = React.createRef();
const inputEconomicalProposalDoc = React.createRef();
const inputPurchaseOrderDoc = React.createRef();
const inputContractDoc = React.createRef();
const extList = ['pdf', 'jpg', 'jpeg', 'png', 'tiff'];
class EditContract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstS: 0,
      DesableLevel2: true,
      DesableLevel3: true,
      levelChild2: [],
      levelChild3: [],
      maxValue: [],
      functionalStructureLevelId: '',
      currency: {},
      errorEquality: false,
      financialContractId: '',
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
      addressId: '',
      level1: '',
      level2: '',
      level3: '',
      levels: [],
      signedDate: new Date(),
      startDate: new Date(),
      endDate: new Date(),
      finalReelDate: new Date(),
      contractTradeVolume: 0,
      contractTradeVolumeEuro: 0,
      currencies: [],
      currencyId: '',
      currencyCode: '',
      changeFactor: 0,
      paymentsBDDays: '',
      nbrConcepts: ['1'],
      conceptType: [],
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
      penaltyMaxType: '',
      penaltiesListe: ['1'],
      purchaseOrderDocumentation: '',
      purchaseOrders: ['1'],
      purchaseOrderNumber: [],
      purchaseOrderReceiveDate: new Date(),
      insure: false,
      firstDayInsured: '',
      lastDayInsured: '',
      amountInsured: '',
      amountInsuredEuro: '',
      proposalDocumentation: '',
      proposalDocumentationDuo: [],
      proposalDocumentations: ['1'],
      insureDocumentation: [],
      insureDocumentations: ['1'],
      contractDocumentation: [],
      contractDocumentations: ['1'],
      contractDocDescreption: [],
      city: {},
      keyCountry: {},
      keyState: {},
      keyCity: {},
      keyClient: {},
      radio: '',
      open: false,
      open2: false,
      open3: false,
      open4: false,
      openDoc: true
    };
  }

  componentDidMount() {
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
    CommercialOperationService.getCommercialOperation().then(result => {
      this.setState({ operations: result.data.payload, commercialOperations: result.data.payload });
    });
    ClientService.getClients().then(result => {
      this.setState({ clients: result.data.payload });
    });
    FunctionalStructureService.getLevelByType('Level 1').then(result => {
      this.setState({ levels: result.data.payload });
    });
  }

  componentWillReceiveProps(newProps) {
    const {
      keyCity, keyCountry, keyState, firstS
    } = this.state;
    const contract = newProps.Info;
    if (newProps.Info != this.props.Info) {
      if (contract.financialContractId) {
        if (this.props.allStateCountrys) {
          for (const key in this.props.allCountrys) {
            if (this.props.allCountrys[key].countryName === contract.address.city.stateCountry.country.countryName) {
              this.setState({ keyCountry: this.props.allCountrys[key] });
              break;
            }
          }

          for (const key in this.props.allStateCountrys) {
            if (this.props.allStateCountrys[key].stateCountryId === contract.address.city.stateCountry._id) {
              this.setState({ keyState: this.props.allStateCountrys[key] });
              break;
            }
          }
          for (const key in this.props.allCitys) {
            if (this.props.allCitys[key].cityName === contract.address.city.cityName) {
              this.setState({ keyCity: this.props.allCitys[key], cityId: this.props.allCitys[key].cityId });
              break;
            }
          }
          this.setState({ currentCity: contract.address.city._id });
        }

        if (contract.functionalStructureLevel1 != null) {
          this.setState({ DesableLevel1: false });
          this.setState({
            functionalStructureLevelId: contract.functionalStructureLevel._id,
            level1: contract.functionalStructureLevel1._id,
            levelChild1: [contract.functionalStructureLevel1],
            level2: '',
            level3: ''
          });
        }
        if (typeof contract.functionalStructureLevel2 !== 'undefined') {
          this.setState({ DesableLevel2: false });
          this.setState({
            functionalStructureLevelId: contract.functionalStructureLevel2._id,
            level2: contract.functionalStructureLevel2._id,
            levelChild2: [contract.functionalStructureLevel2],
            level3: ''
          });
        }
        if (typeof contract.functionalStructureLevel3 === 'undefined') {
          this.setState({ DesableLevel3: false });
        }
        if (typeof contract.functionalStructureLevel3 !== 'undefined') {
          this.setState({
            functionalStructureLevelId: contract.functionalStructureLevel3._id,
            level3: contract.functionalStructureLevel3._id,
            levelChild3: [contract.functionalStructureLevel3],
            DesableLevel3: false
          });
        }
        if (typeof contract.functionalStructureLevel3 === 'undefined' && typeof contract.functionalStructureLevel2 !== 'undefined') {
          this.setState({
            functionalStructureLevelId: contract.functionalStructureLevel2._id,
            level2: contract.functionalStructureLevel2._id,
            levelChild2: [contract.functionalStructureLevel2],
            DesableLevel3: false
          });
          // get level 3
          FunctionalStructureService.getLevelChild(contract.functionalStructureLevel2._id).then(result => {
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
        }
        if (typeof contract.functionalStructureLevel2 === 'undefined') {
          this.setState({
            levelChild3: [], DesableLevel3: true
          });
        }
        this.setState({
          financialContractId: contract.financialContractId,
          contractTitle: contract.contractTitle,
          client: contract.client._id,
          operation: contract.commercialOperation._id,
          company: contract.financialCompany._id,
          // company: contract.companyId,
          state: contract.contractStatus._id,
          taxeIdentityNumber: contract.taxeIdentityNumber,
          // currentCity: contract.address.city._id,
          addressId: contract.address.addressId,
          address: contract.address,
          // level1: contract.functionalStructureLevel1._id,
          signedDate: contract.signedDate ? contract.signedDate.slice(0, 10) : '',
          startDate: contract.startDate ? contract.startDate.slice(0, 10) : '',
          endDate: contract.endDate ? contract.endDate.slice(0, 10) : '',
         // finalReelDate: contract.finalReelDate ? contract.finalReelDate.slice(0, 10) : '',
          finalReelDate: contract.finalReelDate !== 'null' ? contract.finalReelDate : '',
          contractTradeVolume: contract.contractTradeVolume,
          contractTradeVolumeEuro: contract.contractTradeVolumeEuro,
          currencyId: contract.currency._id,
          currency: contract.currency,
          currencyCode: contract.currency.typeOfCurrency.currencyCode,
          changeFactor: contract.currency.changeFactor,
          paymentsBDDays: contract.paymentsBDDays,
          nbrConcepts: contract.nbrConcepts,
          // same
          conceptType: contract.conceptType,
          conceptValue: contract.conceptValue,
          conceptValueLocal: contract.conceptValueLocal,
          conceptValueEuro: contract.conceptValueEuro,
          conceptTotalAmount: contract.conceptTotalAmount,
          conceptTotalAmountEuro: contract.conceptTotalAmountEuro,
          // same
          penaltyQuantity: contract.penaltyQuantity,
          penaltyValue: contract.penaltyValue,
          penaltyCost: contract.penaltyCost,
          penaltyPer: contract.penaltyPer,
          penaltyMaxValue: contract.penaltyMaxValue,
          penaltyMaxType: contract.penaltyMaxType,
          penaltiesListe: contract.penaltiesListe,
          purchaseOrders: contract.purchaseOrders,
          penalties: (contract.penaltyValue.length > 0),
          insure: (contract.amountInsured > 0),
          //  purchaseOrder: (contract.purchaseOrders.length > 0),

          proposal: (contract.proposalOneDoc !== '' || contract.proposalDocumentationDuo.length > 0),
          purchaseOrderDocumentation: contract.purchaseOrderDocumentation,
          purchaseOrderNumber: contract.purchaseOrderNumber,
          purchaseOrderReceiveDate: contract.purchaseOrderReceiveDate ? contract.purchaseOrderReceiveDate.slice(0, 10) : '',
          firstDayInsured: contract.firstDayInsured ? contract.firstDayInsured.slice(0, 10) : '',
          lastDayInsured: contract.lastDayInsured ? contract.lastDayInsured.slice(0, 10) : '',
          amountInsured: contract.amountInsured,
          amountInsuredEuro: contract.amountInsuredEuro,
          proposalDocumentation: contract.proposalDocumentation,
          proposalDocumentationDuo: contract.proposalDocumentationDuo,
          // proposalDocumentations: contract.proposalDocumentations,
          insureDocumentation: contract.insureDocumentation,
          insureDocumentations: this.getListOfcurrency(contract.insureDocumentations, contract.docExtensionList),
          docExtensionList: contract.docExtensionList,
          contractDocumentation: contract.contractDocumentation,
          contractDocumentations: contract.contractDocumentations,
          contractDocDescreption: contract.contractDocDescreption,
          open: (contract.amountInsured > 0),
          open2: (contract.purchaseOrderNumber.length > 0),
          open3: (contract.proposalDocumentationDuo.length > 0 || contract.proposalOneDoc !== ''),
          open4: (contract.penaltiesListe.length > 0),
          openDoc: true,
          // proposalOneDoc: contract.proposalOneDoc,
          radio: ((typeof contract.proposalEconomicalDoc !== 'undefined') || (typeof contract.proposalTechnicalDoc !== 'undefined')) ? 'separatedProposal' : 'proposalOneDoc',
          proposalOneDoc: (typeof contract.proposalOneDoc !== 'undefined' && contract.proposalOneDoc !== null) ? new File([this.base64ToArrayBuffer(contract.proposalOneDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(contract.proposalOneExtension), lastModified: new Date() }) : {},
          proposalTechnicalDoc: (typeof contract.proposalTechnicalDoc !== 'undefined' && contract.proposalTechnicalDoc !== null) ? new File([this.base64ToArrayBuffer(contract.proposalTechnicalDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(contract.proposalTechnicalExtension), lastModified: new Date() }) : {},
          proposalEconomicalDoc: (typeof contract.proposalEconomicalDoc !== 'undefined' && contract.proposalEconomicalDoc !== null) ? new File([this.base64ToArrayBuffer(contract.proposalEconomicalDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(contract.proposalEconomicalExtension), lastModified: new Date() }) : {},
          proposalOneExtension: contract.proposalOneExtension,
          purchaseOrderDoc: (typeof contract.purchaseOrderDoc !== 'undefined' && contract.purchaseOrderDoc !== null) ? new File([this.base64ToArrayBuffer(contract.purchaseOrderDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(contract.purchaseOrderDocExtension), lastModified: new Date() }) : {},
          contractDoc: (typeof contract.contractDoc !== 'undefined' && contract.contractDoc !== null) ? new File([this.base64ToArrayBuffer(contract.contractDoc)], 'testdeclaration.pdf', { type: this.handleFileDataType(contract.contractDocExtension), lastModified: new Date() }) : {},
          contractDocExtension: contract.contractDocExtension,
          purchaseOrderDocExtension: contract.purchaseOrderDocExtension,
          proposalTechnicalExtension: contract.proposalTechnicalExtension,
          proposalEconomicalExtension: contract.proposalEconomicalExtension
        });
      }
      this.setState({ firstS: 1 });
    }
  }

  handleDateValue = (value, name) => {
    this.setState({
      [name]: value
    });
  };

  base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const binaryLen = binaryString.length;
    const bytes = new Uint8Array(binaryLen);
    for (let i = 0; i < binaryLen; i++) {
      const ascii = binaryString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  handleChangeCountry = (ev, value) => {
    const { getAllStateByCountry } = this.props;
    getAllStateByCountry(value.countryId);
    this.setState({ keyCountry: value });
    this.setState({ keyState: {}, keyCity: {} });
  };

  handleChangeState = (ev, value) => {
    const { getAllCityByState } = this.props;
    getAllCityByState(value.stateCountryId);
    this.setState({ keyState: value });
  };

  handleChangeCity = (ev, value) => {
    this.setState({ cityId: value.cityId, keyCity: value, currentCity: value.cityId });
  };

  handleChangeLevel1 = (ev) => {
    FunctionalStructureService.getLevelChild(ev.target.value).then(result => {
      this.setState({ [ev.target.name]: ev.target.value, functionalStructureLevelId: ev.target.value });
      if (result.status === 200) {
        if ((result.data).length > 0) {
          this.setState({
            levelChild2: result.data, levelChild3: [], DesableLevel2: false, level2: '', level3: ''
          });
        } else {
          this.setState({
            levelChild2: [], levelChild3: [], DesableLevel2: true, DesableLevel3: true, level2: '', level3: ''
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
          this.setState({ levelChild3: result.data, DesableLevel3: false, level3: '' });
        } else {
          this.setState({
            levelChild3: [], DesableLevel3: true, level3: ''
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

    handleChange = (ev) => {
      console.log(ev.target.value);
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
              if (Number(conceptType[i]) === 1) {
                conceptValueEuro[i] = ((Number(contractTradeVolume) * Number(conceptValue[i])) / 100) * currencyo.changeFactor;
                conceptValueLocal[i] = (Number(contractTradeVolume) * Number(conceptValue[i])) / 100;
              }
              if (Number(conceptType[i]) === 2) {
                conceptValueEuro[i] = conceptValue[i] * currencyo.changeFactor;
                conceptValueLocal[i] = conceptValue[i] * 1;
              }
            }
          }
          return null;
        });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += Number(row); });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += Number(row); });
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
        /*        const tradeValue = this.state.contractTradeVolume;
        let currencyCode;
        this.state.currencies.map(currency => {
          if (currency.currencyId === ev.target.value) {
            changeFactor = currency.changeFactor; currencyCode = currency.typeOfCurrency.currencyCode;
          }
        });
        this.setState({ contractTradeVolumeEuro: tradeValue * changeFactor, changeFactor, currencyCode }); */
      }
      if (ev.target.name === 'contractTradeVolume') {
        let totalEuro = 0;
        let total = 0;
        this.setState({ contractTradeVolumeEuro: ev.target.value * currency.changeFactor });
        for (let i = 0; i < conceptType.length; i++) {
          if (Number(conceptType[i]) === 1) {
            conceptValueEuro[i] = ((ev.target.value * conceptValue[i]) / 100) * changeFactor;
            conceptValueLocal[i] = (ev.target.value * conceptValue[i]) / 100;
          }
          if (Number(conceptType[i]) === 2) {
            conceptValueEuro[i] = conceptValue[i] * changeFactor;
            conceptValueLocal[i] = conceptValue[i] * 1;
          }
        }
        conceptValueEuro.map(row => { totalEuro += Number(row); });
        conceptValueLocal.map(row => { total += Number(row); });
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
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const factor = changeFactor;
        this.setState({ amountInsuredEuro: ev.target.value * factor });
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
        /*      const tab = conceptType;
        tab[0] = 0;
        tab[row] = event.target.value;
        this.setState({ conceptType: tab }); */
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
        conceptValueEuro.map(row => { totalEuro += Number(row); });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += Number(row); });
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
        conceptValue[0] = 0;
        conceptValueEuro[0] = 0;
        conceptValueLocal[0] = 0;
        conceptValue[row] = event.target.value;
        this.setState({
          conceptValue
        });
        if (Number(conceptType[row]) === 1) {
          conceptValueEuro[row] = ((contractTradeVolume * event.target.value) / 100) * changeFactor;
          conceptValueLocal[row] = (contractTradeVolume * event.target.value) / 100;
          maxValue[row] = 100;
          this.setState({ maxValue });
        }
        if (Number(conceptType[row]) === 2) {
          conceptValueEuro[row] = event.target.value * changeFactor;
          conceptValueLocal[row] = event.target.value * 1;
          maxValue[row] = contractTradeVolume;
          this.setState({ maxValue });
        }
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueEuro.map(row => { totalEuro += Number(row); });
        // eslint-disable-next-line array-callback-return,no-shadow
        conceptValueLocal.map(row => { total += Number(row); });
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
        /*    const tab = this.state.conceptValue; const type = this.state.conceptType[row]; const tab2 = this.state.conceptValueEuro; const tab3 = this.state.conceptValueLocal; const amount = this.state.contractTradeVolume; const factor = this.state.changeFactor;
        tab[0] = 0; tab2[0] = 0; tab3[0] = 0;
        tab[row] = event.target.value;
        if (type === 1) {
          tab2[row] = ((amount * event.target.value) / 100) * factor;
          tab3[row] = (amount * event.target.value) / 100;
        }
        if (type === 2) {
          tab2[row] = event.target.value * factor;
          tab3[row] = event.target.value * 1;
        }
        tab2.map(row => { totalEuro += row; });
        tab3.map(row => { total += row; });
        this.setState({
          conceptValue: tab, conceptValueLocal: tab3, conceptValueEuro: tab2, conceptTotalAmountEuro: totalEuro, conceptTotalAmount: total
        }); */
      }
      if (event.target.name === 'purchaseOrderNumber') {
        // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
        const tab = this.state.purchaseOrderNumber;
        tab[0] = 0;
        tab[row] = event.target.value;
        this.setState({ purchaseOrderNumber: tab });
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

    handleCheck = () => {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const ok = !this.state.open;
      this.setState({ open: ok, insure: !this.state.open });
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

  handleCheck4 = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const ok4 = !this.state.open4;
    this.setState({ open4: ok4 });
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
   // const newElement = insureDocumentations.length + 1;
    insureDocumentations.push({ inputDoc: React.createRef(), doc: {}, docExtension: '' });
    //insureDocumentations.push(newElement);
    this.setState({ openDoc: true, insureDocumentations });
  }

  handleDeleteDoc = (row) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.insureDocumentations.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = this.state.insureDocumentations.filter(rows => rows !== row);
      this.setState({ insureDocumentations: newDocs });
    }
  }

  handleOpenConcept = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const newElement = this.state.nbrConcepts.length + 1;
    // eslint-disable-next-line react/destructuring-assignment
    this.state.nbrConcepts.push(newElement);
    this.setState({ openDoc: true });
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

  handleAddPenalty = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const newElement = this.state.penaltiesListe.length + 1;
    // eslint-disable-next-line react/destructuring-assignment
    this.state.penaltiesListe.push(newElement);
    this.setState({ openDoc: true });
  }

  handleDeletePenalty = (row) => {
    const {
      penaltiesListe, penaltyQuantity, penaltyCost, penaltyValue, penaltyPer
    } = this.state;
    if (penaltiesListe.length > 1) {
      const newDocs = penaltiesListe.filter(rows => rows !== row);
      const newDocs2 = penaltyQuantity.filter((e, i) => i !== (row));
      const newDocs3 = penaltyCost.filter((e, i) => i !== (row));
      const newDocs4 = penaltyValue.filter((e, i) => i !== (row));
      const newDocs5 = penaltyPer.filter((e, i) => i !== (row));
      this.setState({
        penaltiesListe: newDocs, penaltyQuantity: newDocs2, penaltyCost: newDocs3, penaltyValue: newDocs4, penaltyPer: newDocs5
      });
    }
  }

  handleOpenPurchase = () => {
    // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
    const newElement = this.state.purchaseOrders.length + 1;
    // eslint-disable-next-line react/destructuring-assignment
    this.state.purchaseOrders.push(newElement);
    this.setState({ openDoc: true });
  }

  handleDeletePurchase = (row) => {
    // eslint-disable-next-line react/destructuring-assignment
    if (this.state.purchaseOrders.length > 1) {
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs = this.state.purchaseOrders.filter((e, i) => i !== (row - 1));
      // eslint-disable-next-line react/destructuring-assignment,react/no-access-state-in-setstate
      const newDocs2 = this.state.purchaseOrderNumber.filter((e, i) => i !== (row));
      this.setState({ purchaseOrderNumber: newDocs2, purchaseOrders: newDocs });
    }
  }

    handleCreate = () => {
      const {
        proposalTechnicalExtension, proposalEconomicalExtension,
        contractDoc, purchaseOrderDoc, purchaseOrderDocExtension,
        radio, proposalOneDoc, proposalEconomicalDoc, proposalTechnicalDoc, proposalOneExtension, contractDocExtension,
        contractDocDescreption, contractDocumentation, insureDocumentation, proposalDocumentation, proposalDocumentationDuo, purchaseOrderDocumentation,
        operation, company, state, taxeIdentityNumber, contractTitle, financialContractId, addressId,
        conceptType, conceptValue, conceptValueEuro, conceptValueLocal, conceptTotalAmount, conceptTotalAmountEuro,
        signedDate, startDate, endDate, finalReelDate, contractTradeVolume, contractTradeVolumeEuro,
        currencyId, paymentsBDDays, penaltyQuantity, penaltyValue, currentCity,
        penaltyCost, penaltyPer, purchaseOrderNumber, purchaseOrderReceiveDate,
        amountInsuredEuro, insure, penalties,
        penaltiesListe, purchaseOrders, insureDocumentations, contractDocumentations, nbrConcepts, functionalStructureLevelId
      } = this.state;

      if (new Date(finalReelDate) < new Date(startDate) && finalReelDate) {
        this.props.callbackFromParentCloseEdit();
        notification('danger', 'Final real date must be more then start date');
        return;
      }

      if (new Date(endDate) < new Date(startDate)) {
        this.props.callbackFromParentCloseEdit();
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
      // eslint-disable-next-line react/destructuring-assignment
      const clientId = this.state.client;
      const client = { _id: clientId };
      const commercialOperation = { _id: operation };
      const financialCompany = { _id: company };
      const contractStatus = { _id: state };
      const city = { _id: currentCity };
      const address = { addressId, city };
      const currency = { _id: currencyId };
      const functionalStructureLevel = { _id: functionalStructureLevelId };
      /*  console.log(insure);
        console.log(amountInsured);
        return; */
      const financialContractUpdaterequest = {
        financialContractId,
        client,
        commercialOperation,
        financialCompany,
        contractStatus,
        contractTitle,
        contractDocumentation,
        contractDocDescreption,
        functionalStructureLevel,
        taxeIdentityNumber,
        address,
        currencyId,
        signedDate: new Date(signedDate),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
       // finalReelDate: new Date(finalReelDate),
        finalReelDate: (finalReelDate != '' && finalReelDate != 'null') ? new Date(finalReelDate).toISOString().slice(0, 10) : null,
        contractTradeVolume,
        currency,
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
        insureDocumentations,
        contractDocumentations,
        nbrConcepts,
        cityId: currentCity,
        companyId: company,
        commercialOperationId: operation,
        contractStatusId: state,
        clientId,
        insure,
        functionalStructureLevelId,
        proposalOneExtension,
        contractDocExtension,
        purchaseOrderDocExtension,
        proposalTechnicalExtension,
        proposalEconomicalExtension
      };
      const formData = new FormData();
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
      if (radio === 'proposalOneDoc') {
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
      const docExtensionList = [];
      insureDocumentations.forEach(doc => {
        if (doc.doc.constructor === File) {
          docExtensionList.push(doc.docExtension);
          formData.append('insureDocumentations', doc.doc);
        }
      });
      formData.append('docExtensionList', docExtensionList);
      Object.keys(financialContractUpdaterequest).forEach(e => formData.append(e, financialContractUpdaterequest[e])
      );
      if (parseFloat(contractTradeVolume) === conceptTotalAmount) {
        ContractService.updateContract(formData).then(result => {
          /*          this.props.callbackFromParent(false);
        });
      } else {
        notification('danger', 'Trade Volume must be equal to Concept Total Amount in currency');
      } */
          if (result.status === 200) {
            notification('success', 'contract updated');
            this.props.callbackFromParent2();
          }
          history.push('/app/gestion-financial/Contracts');
        })
          .catch(err => notification('danger', err.response.data.errors));
      } else {
        notification('danger', 'Trade Volume must be equal to Concept Total Amount in currency');
      }
      this.props.callbackFromParentCloseEdit();
    }

    handleGoBack = () => {
      // eslint-disable-next-line react/prop-types,react/destructuring-assignment
      this.props.callbackFromParent(false);
    }

  getListOfcurrency = (insureDocumentations, extention) => {
    const list = [];
    let o = {};
    let docExtension = '';
    for (const key in insureDocumentations) {
    //  doc = insureDocumentations[key];
      docExtension = extention[key];
      o = { inputDoc: React.createRef(), doc: new File([this.base64ToArrayBuffer(insureDocumentations[key])], 'testdeclaration.pdf', { type: this.handleFileDataType(extention[key]), lastModified: new Date() }), docExtension };
      // list.push(new File([this.base64ToArrayBuffer(insureDocumentations[key])], 'testdeclaration.pdf', { type: this.handleFileDataType(extention[key]), lastModified: new Date() }));
      list.push(o);
    }
    if(list.length===0){
      list.push({ inputDoc: React.createRef(), doc: {}});
    }
    return list;
  }

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
        value: '1',
        label: 'Of the Value Of Contract',
      },
      {
        value: '2',
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
      proposalOneDoc, radio, proposalTechnicalDoc, proposalEconomicalDoc, purchaseOrderDoc, contractDoc,
      client, operation, company, state, taxeIdentityNumber, nbrConcepts, status, currencies, contractTitle,
      conceptType, conceptValue, conceptValueEuro, conceptValueLocal, conceptTotalAmount, conceptTotalAmountEuro,
      signedDate, startDate, endDate, finalReelDate, contractTradeVolume, companies, commercialOperations, clients, contractTradeVolumeEuro,
      penaltyMaxType, currencyId, currencyCode, paymentsBDDays, penalties, penaltyQuantity, penaltyValue, levels, amountInsuredEuro,
      penaltyCost, penaltyPer, penaltyMaxValue, purchaseOrder, penaltiesListe, purchaseOrderNumber, purchaseOrderReceiveDate, purchaseOrders,
      insure, firstDayInsured, lastDayInsured, amountInsured, proposal, open, open2, open3, open4, level1, level2, level3, openDoc, contractDocDescreption,
      keyCountry, keyState, keyCity, errorEquality, DesableLevel2, DesableLevel3, levelChild2, levelChild3
    } = this.state;
    console.log(finalReelDate);
    return (
      <div>
        <Typography variant="subtitle2" component="h2" color="primary">
                        Contract Information
        </Typography>
        <br />
        <div>
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
                <InputLabel>Select State</InputLabel>
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
                  contractDoc && contractDoc.constructor === Object
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
            <Grid item xs={12} md={3} sm={3} />
            <Grid item xs={12} md={3} sm={3} />
          </Grid>
          <br />
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
            <Grid
              container
              spacing={2}
              alignItems="flex-start"
              direction="row"
              justify="space-around"
            >
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
                value={allCountrys.find(v => v.countryName === keyCountry.countryName) || ''}
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
                getOptionLabel={option => option.stateName || ''}
                value={allStateCountrys.find(v => v.stateName === keyState.stateName) || ''}
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
                getOptionLabel={option => option.cityName || ''}
                value={allCitys.find(v => v.cityName === keyCity.cityName) || ''}
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
        </div>
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
                readOnly: true,
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
              fullWidth
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
            key={'nbrConcepts' + row}
            container
            spacing={1}
            alignItems="flex-start"
            direction="row"
          >
            <Grid item xs={1} align="center">
              <Typography variant="subtitle2" component="h3" color="initial">
                <br />
                  Concept
                {' '}
                { conceptType[row] }
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <FormControl fullWidth required>
                <InputLabel>
                  Select Type
                </InputLabel>
                <Select
                  name="conceptType"
                  value={conceptType[row] ? conceptType[row] : ''}
                  onChange={event => this.handleConcept(event, row)}
                >
                  {
                    conceptTypes.map((clt) => (
                      <MenuItem key={clt.value + row} value={clt.value}>
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
                name="conceptValue"
                value={conceptValue[row] ? conceptValue[row] : ''}
                type="number"
                onChange={event => this.handleConcept(event, row)}
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
                    readOnly: true,
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
                label="Currency"
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
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={1}>
              <br />
              <IconButton size="medium" color="primary" onClick={() => this.handleOpenConcept()}>
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
                readOnly: true,
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
              control={<Checkbox color="primary" checked={insure === true} onChange={this.handleCheck} />}
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
                      label="Amount Insured "
                      type="number"
                      name="amountInsured"
                      value={amountInsured}
                      onChange={this.handleChange}
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
                        readOnly: true,
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
                    readOnly: true,
                  }}
                />
                <br />
                <br />
                {/* eslint-disable-next-line react/destructuring-assignment */}
                {typeof this.state.insureDocumentations !== 'undefined' && this.state.insureDocumentations.map((doc, index) => (
                  <div>
                    <Grid container>
                      <Grid item xs={9}>
                        <FormControl>
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
                        </FormControl>
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
            <br />
            <Typography variant="subtitle2" component="h2" color="primary">
              Purchase Order *
            </Typography>
            <br />
            <div>
              {purchaseOrders.map((row) => (
                <Grid container spacing={2} key={'purchaseOrders' + row}>
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
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <br />
                   {/*<IconButton size="small" color="primary" onClick={() => this.handleOpenPurchase()}>
                      <AddIcon />
                    </IconButton>
                    <IconButton size="small" color="primary" onClick={() => this.handleDeletePurchase(row)}>
                      <DeleteIcon />
                    </IconButton>*/}
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
              <FormControl>
                <Button
                  style={{ marginTop: '22px' }}
                  fullWidth
                  variant="outlined"
                  component="span"
                  startIcon={<Image color="primary" />}
                  className={
                    purchaseOrderDoc && purchaseOrderDoc.constructor === Object
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
              </FormControl>
            </div>
            {/*  )} */}
          </Grid>
          <Grid item xs={12} sm={7} md={3}>
            <FormControlLabel
              id="proposal"
              name="proposal"
              value={proposal}
              control={<Checkbox checked={open3 === true} color="primary" onChange={this.handleCheck3} />}
              label="Proposal"
              labelPlacement="start"
            />
            <br />
            {open3 === false ? (
              <div />
            ) : (
              <FormControl component="fieldset">
                <RadioGroup aria-label="gender" name="radio" value={radio === 'proposalOneDoc' ? 'proposalOneDoc' : 'separatedProposal'} onChange={this.handleChange}>
                  <FormControlLabel value="proposalOneDoc" control={<Radio />} label="Technical & Economical" />
                  {radio === 'proposalOneDoc' ? (
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
                    <Grid container spacing={0}>
                      <Grid item xs={12} md={9} sm={4}>
                        <FormControl>
                          <Button
                            style={{ marginTop: '5px' }}
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
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={9} sm={4}>
                        <FormControl>
                          <Button
                            style={{ marginTop: '5px' }}
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
                        </FormControl>
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
                    <Grid container spacing={4} key={'penaltiesListe' + row}>
                      <Grid item xs={1} />
                      <Grid item xs={2}>
                        <FormControl fullWidth required>
                          <InputLabel>Select Quantity</InputLabel>
                          <Select
                            name="penaltyQuantity"
                            value={penaltyQuantity[row] ? penaltyQuantity[row] : ''}
                            onChange={event => this.handlePenalty(event, row)}
                          >
                            {
                              Quantities.map((clt) => (
                                <MenuItem key={clt.value + row} value={clt.value}>
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
                          onChange={event => this.handlePenalty(event, row)}
                          InputLabelProps={{
                            shrink: true,
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
                            onChange={event => this.handlePenalty(event, row)}
                          >
                            {
                              penaltiesCost.map((clt) => (
                                <MenuItem key={clt.value + row} value={clt.value}>
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
                            onChange={event => this.handlePenalty(event, row)}
                          >
                            {
                              penaltiesPer.map((clt) => (
                                <MenuItem key={clt.value + row} value={clt.value}>
                                  {clt.label}
                                </MenuItem>
                              ))
                            }
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <br />
                        <IconButton size="small" color="primary" onClick={() => this.handleAddPenalty()}>
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
      </div>
    );
  }
}

EditContract.propTypes = {
  classes: PropTypes.object.isRequired
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

export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(EditContract));
