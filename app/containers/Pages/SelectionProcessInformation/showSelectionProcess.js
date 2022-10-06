import React, { useContext } from 'react';
import {
  Grid,
  TextField,
  Typography,
  makeStyles,
  FormControl,
  FormLabel,
  FormControlLabel,
  IconButton,
  FormGroup,
  Checkbox,
  FormHelperText, withStyles, Divider, DialogContent, Button, DialogTitle, DialogActions, Dialog,
} from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import '../Configurations/map/app.css';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import { ThemeContext } from '../../App/ThemeWrapper';
import {
  getAllSelectionProcessInformation,
  saveSelectionProcessInformation
} from '../../../redux/selectionProcessInformation/actions';
import { getAllSelectionTypeEvaluation } from '../../../redux/selectionTypeEvaluation/actions';
import CurrencyService from '../../Services/CurrencyService';
import styles from '../Staff/staff-jss';
import Transition from '../../../components/Transition/transition';

const useStyles = makeStyles(styles);

const inputEconomicProposalDoc = React.createRef();
const inputCurriculumDoc = React.createRef();
const inputAttitudeTestDoc = React.createRef();

class ShowSelectionProcess extends React.Component {
  constructor(props) {
    super(props);
    this.editingPromiseResolve = () => {};
    this.state = {
      docName: '',
      numPages: null,
      pageNumber: null,
      doc: {},
      isOpenDocument: false,
      comment: '',
      subjectiveMark: '',
      english: '',
      firstName: '',
      fatherFamilyName: '',
      motherFamilyName: '',
      profile: '',
      testDate: new Date(),
      energy: '',
      adaptability: '',
      integrity: '',
      interpersonalSensitivity: '',
      economicCandidateProposal: '',
      economicCandidateProposalInEuro: 0.0,
      economicClaimsValue: 0,
      economicClaimsValueInEuro: 0.0,
      economicClaimsRange1: 0,
      economicClaimsRange1InEuro: 0,
      economicClaimsRange2: 0,
      economicClaimsRange2InEuro: 0,
      candidateProposalType: '',
      candidateSalaryType: '',
      economicClaimsType: '',
      economicCompanyProposal: '',
      economicCompanyProposalInEuro: 0.0,
      objectives: '',
      objectivesInEuro: 0.0,
      companyProposalType: '',
      companySalaryType: '',
      checkedKnowledges: [],
      experiences: [],
      economicProposalDoc: {},
      curriculumDoc: {},
      attitudeTestDoc: {},
      currencies: [],
      currency: ''
    };
  }

  componentDidMount() {
    const { getAllSelectionTypeEvaluation } = this.props;
    getAllSelectionTypeEvaluation();
    CurrencyService.getCurrency().then(({ data }) => {
      this.setState({ currencies: data });
    });
  }

    callback = () => {
      const { callback } = this.props;
      callback();
    }

    handleDownload = () => {
      const { selectionProcess } = this.props;
      const { docName, doc } = this.state;
      const docTitle = `${selectionProcess.firstName}_
    ${selectionProcess.fatherFamilyName}_
    ${selectionProcess.motherFamilyName}_${docName}`;

      const documentBase64 = this.fileToBase64(doc);
      const documentBlob = new Blob([documentBase64], {
        type: 'application/pdf'
      });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(documentBlob);
      link.download = docTitle;
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

    handleOpenDocumentDialog = (docName) => {
      const { selectionProcess } = this.props;
      this.setState({
        isOpenDocument: true, docName
      });
      switch (docName) {
        case 'curriculumDoc':
          this.setState({
            doc: selectionProcess.curriculumDoc
          });
          break;
        case 'attitudeTestDoc':
          this.setState({
            doc: selectionProcess.attitudeTestDoc
          });
          break;
        case 'economicProposalDoc':
          this.setState({
            doc: selectionProcess.economicProposalDoc
          });
          break;
        default:
            // code block
      }
    };

    handleClose = () => {
      this.setState({
        isOpenDocument: false,
        pageNumber: 1
      });
    };

    renderFile = () => {
      const { doc } = this.state;
      return `data:application/pdf;base64,${doc}`;
    };

    onDocumentLoadSuccess = ({ numPages }) => {
      this.setState({
        numPages,
        pageNumber: 1
      });
    };

    changePage = (offset) => {
      const { pageNumber } = this.state;
      this.setState({
        pageNumber: pageNumber + offset
      });
    }

    previousPage = () => {
      this.changePage(-1);
    }

    nextPage = () => {
      this.changePage(1);
    }

    renderKnowledgeRow = knowledgeName => {
      const { classes } = this.props;
      const { selectionProcess } = this.props;
      const index = selectionProcess.knowledge.findIndex(
        elem => elem.name === knowledgeName
      );
      const experience = selectionProcess.experiences[index];
      return (
        <div className={classes.divSpace}>
          <Typography
            variant="subtitle1"
            style={{
              /*   color: '#5c5757', */
              fontFamily: 'sans-serif , Arial',
              fontSize: '15px',
              fontWeight: 'bold',
              marginTop: 20,
              marginLeft: 20
            }}
          >
            {knowledgeName}
          </Typography>
          <Typography
            variant="subtitle1"
            style={{
              /* color: '#5c5757', */
              fontFamily: 'sans-serif , Arial',
              fontSize: '15px',
              fontWeight: 'bold',
              marginTop: 20,
              marginLeft: 20
            }}
          >
            {`${experience > 0 ? experience : 0} Years`}
          </Typography>
        </div>
      );
    };

    render() {
      const {
        classes,
        isLoadingSelectionProcessInformation,
        selectionProcessInformationResponse,
        errorSelectionProcessInformation,
        allSelectionTypeEvaluation,
        selectionProcess, economicCandidateProposalInEuro, objectivesInEuro, economicCompanyProposalInEuro, economicClaimsValueInEuro, economicClaimsRange1, economicClaimsRange2
      } = this.props;

      const {
        checkedKnowledges,
        experiences,
        isOpenDocument,
        numPages, pageNumber
      } = this.state;
      !isLoadingSelectionProcessInformation
      && selectionProcessInformationResponse
      && this.editingPromiseResolve(selectionProcessInformationResponse);
      !isLoadingSelectionProcessInformation
      && !selectionProcessInformationResponse
      && this.editingPromiseResolve(errorSelectionProcessInformation);

      return (
        <div>
          <Grid
            container
            spacing={2}
            style={{
              marginBottom: 20
            }}
          >
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Apply position :'}
                {' '}
                &nbsp;
              </Typography>
              <Typography className={classes.selectionProcessInformationshow}>
                <span>{selectionProcess.profile}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                style={{ display: 'inline-block' }}
                color="secondary"
              >
                {'Father family name :  '}
                  &nbsp;
              </Typography>
              <Typography style={{ display: 'inline-block' }} className={classes.selectionProcessInformationshow}>
                <span>{selectionProcess.fatherFamilyName}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Mother family name:  '}
                {' '}
                &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.motherFamilyName}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'First name:  '}
&nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.firstName}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 20
            }}
          >
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'sans-serif , Arial',
                fontSize: '18px',
                fontWeight: 'bold',
                opacity: 0.6
              }}
            >
                Attitude Test Results
            </Typography>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              marginBottom: 20
            }}
          >
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Test Date:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.testDate}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Energy:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.energy}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Adaptability:  '}
                &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.adaptability}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Integrity:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.integrity}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Interpersonal Sensitivity:  '}
                &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.interpersonalSensitivity}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'English:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.english}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'subjective Mark:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.subjectiveMark}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'comment:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.comment !== 'undefined' ? selectionProcess.comment : '***'}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: 20
            }}
          >
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'sans-serif , Arial',
                fontSize: '18px',
                fontWeight: 'bold',
                opacity: 0.6
              }}
            >
                Economical requirements of the candidate
            </Typography>
          </Grid>
          <Grid
            container
            spacing={2}
            style={{
              marginBottom: 10
            }}
          >
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Currency:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.currencyName}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Proposal Type:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.candidateProposalType}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Salary Type:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.candidateSalaryType}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Economic claims Type:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.economicClaimsType}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Economic Proposal:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.economicCandidateProposal}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Economic Proposal in Euro:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{economicCandidateProposalInEuro}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={2}
          >
            {selectionProcess.economicClaimsType == 'Number' ? (
              <>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Typography
                    className={classes.selectionProcessInformationshow}
                    color="secondary"
                  >
                    {'economic claims value:  '}
                        &nbsp;
                  </Typography>
                  <Typography
                    className={classes.selectionProcessInformationshow}
                  >
                    <span>{selectionProcess.economicClaimsValue}</span>
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={3}>
                  <Typography
                    className={classes.selectionProcessInformationshow}
                    color="secondary"
                  >
                    {'economic claims value in Euro:  '}
                        &nbsp;
                  </Typography>
                  <Typography
                    className={classes.selectionProcessInformationshow}
                  >
                    <span>{economicClaimsValueInEuro}</span>
                  </Typography>
                </Grid>
              </>
            )
              : (
                <>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                      color="secondary"
                    >
                      {'Economic Claims Range 1  : '}
                                &nbsp;
                    </Typography>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                    >
                      <span>{selectionProcess.economicClaimsRange1}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                      color="secondary"
                    >
                      {'Economic Claims Range 1 In Euro '}
                                &nbsp;
                    </Typography>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                    >
                      <span>{economicClaimsRange1}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                      color="secondary"
                    >
                      {'Economic Claims Range 2:  '}
                                &nbsp;
                    </Typography>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                    >
                      <span>{selectionProcess.economicClaimsRange2}</span>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={6} lg={3}>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                      color="secondary"
                    >
                      {'Economic Claims Range 2 In Euro  :  '}
                                &nbsp;
                    </Typography>
                    <Typography
                      className={classes.selectionProcessInformationshow}
                    >
                      <span>{economicClaimsRange2}</span>
                    </Typography>
                  </Grid>
                </>
              )}

          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: 20,
              marginBottom: 10
            }}
          >
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'sans-serif , Arial',
                fontSize: '18px',
                fontWeight: 'bold',
                opacity: 0.6
              }}
            >
                Economical company proposal
            </Typography>
          </Grid>
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Proposal Type:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.companyProposalType}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Salary Type:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.companySalaryType}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Economic Proposal:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.economicCompanyProposal}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Economic Proposal In Euro:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{economicCompanyProposalInEuro}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Objectives:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}
              >
                <span>{selectionProcess.objectives}</span>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={3}>
              <Typography
                className={classes.selectionProcessInformationshow}
                color="secondary"
              >
                {'Objectives In Euro:  '}
                  &nbsp;
              </Typography>
              <Typography
                className={classes.selectionProcessInformationshow}

              >
                <span>{objectivesInEuro}</span>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginTop: 20,
              marginBottom: 10
            }}
          >
            <Typography
              variant="subtitle1"
              style={{
                fontFamily: 'sans-serif , Arial',
                fontSize: '18px',
                fontWeight: 'bold',
                opacity: 0.6
              }}
            >
              Knowledges
            </Typography>
          </Grid>
          <Grid
            container
            spacing={6}
            direction="row"
            justify="center"
          /*  alignItems="center" */
          >

            {selectionProcess && allSelectionTypeEvaluation.length > 0 ? (
              allSelectionTypeEvaluation
                .filter(type => type.type === 'Main Type')
                .map(
                  type => selectionProcess.knowledge.filter(elem => type.childs.some(i => i.name.includes(elem.name))
                  ).length > 0 && (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 0
                      }}
                    >
                      <div>
                        <Typography
                          variant="subtitle1"
                          style={{
                            color: 'primary',
                            fontFamily: 'sans-serif , Arial',
                            fontSize: '20px',
                            marginTop: 20
                          }}
                        >
                          {type.name}
                        </Typography>
                        <Divider />
                        {selectionProcess.knowledge
                          .filter(elem => type.childs.some(i => i.name.includes(elem.name))
                          )
                          .map(elem => this.renderKnowledgeRow(elem.name))}
                      </div>
                    </Grid>
                  )
                )
            ) : (
              <div>there is no experiences</div>
            )}
            {/*     <Grid
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
                onClick={this.callback}
              >
                      return
              </Button>
            </Grid> */}
          </Grid>
          <Grid
            container
            spacing={6}
            direction="row"
            justify="center"
            /*  alignItems="center" */
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
              {selectionProcess.curriculumDoc != undefined ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    onClick={() => this.handleOpenDocumentDialog('curriculumDoc')
                    }
                  >
                    <IconButton>
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                      Curriculum
                  </Typography>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    /*   flexDirection: 'column', */
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <IconButton>
                    <VisibilityOffIcon disabled color="secondary" />
                  </IconButton>
                  {' '}
                        no Curriculum

                </div>
              )}

              {selectionProcess.attitudeTestDoc != undefined ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    onClick={() => this.handleOpenDocumentDialog('attitudeTestDoc')
                    }
                  >
                    <IconButton>
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                            Attitude Test
                  </Typography>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    /*   flexDirection: 'column', */
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <IconButton>
                    <VisibilityOffIcon disabled color="secondary" />
                  </IconButton>
                  {' '}
                    no attitude Test Doc

                </div>
              )}
              {selectionProcess.economicProposalDoc != undefined ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    onClick={() => this.handleOpenDocumentDialog('economicProposalDoc')
                    }
                  >
                    <IconButton>
                      <VisibilityIcon color="secondary" />
                    </IconButton>
                            Economic proposal
                  </Typography>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    /*   flexDirection: 'column', */
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <IconButton>
                    <VisibilityOffIcon disabled color="secondary" />
                  </IconButton>
                  {' '}
                        no Economic proposal
                </div>
              )}
            </Grid>
          </Grid>
          <Dialog
            maxWidth="lg"
            TransitionComponent={Transition}
            fullWidth
            scroll="body"
            aria-labelledby="changeProfilePic"
            open={isOpenDocument}
            classes={{
              paper: classes.paper
            }}
          >
            <DialogTitle id="SaveFormula">Document preview</DialogTitle>
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
                {selectionProcess ? (
                  <>
                    <Document
                      file={this.renderFile()}
                      onLoadSuccess={this.onDocumentLoadSuccess}
                      onLoadError={console.error}
                    >
                      <Page pageNumber={pageNumber} />
                    </Document>
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
                  </>
                ) : (
                  <div />
                )}
              </div>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose} color="primary">
                        Close
              </Button>
              <Button onClick={this.handleDownload} color="primary">
                        Download
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    }
}

const mapStateToProps = state => ({
  allSelectionProcessInformation: state.getIn(['selectionProcessInformations'])
    .allSelectionProcessInformation,
  allSelectionProcessInformationByState: state.getIn([
    'selectionProcessInformations'
  ]).allSelectionProcessInformationByState,
  selectionProcessInformationResponse: state.getIn([
    'selectionProcessInformations'
  ]).selectionProcessInformationResponse,
  isLoadingSelectionProcessInformation: state.getIn([
    'selectionProcessInformations'
  ]).isLoading,
  errorSelectionProcessInformation: state.getIn([
    'selectionProcessInformations'
  ]).errors,
  allStaff: state.getIn(['staffs']).allStaff,
  allSelectionTypeEvaluation: state.getIn(['selectionTypeEvaluations'])
    .allSelectionTypeEvaluation
});
const mapDispatchToProps = dispatch => bindActionCreators(
  {
    saveSelectionProcessInformation,
    getAllSelectionProcessInformation,
    getAllSelectionTypeEvaluation
  },
  dispatch
);

const ShowSelectionProcesssMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowSelectionProcess);

export default withStyles(styles)(ShowSelectionProcesssMapped);
