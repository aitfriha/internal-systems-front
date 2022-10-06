import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { LoginForm } from 'dan-components';
import styles from 'dan-components/Forms/user-jss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isEmpty, isString } from 'lodash';
import { signIn } from '../../../../transversal-administration/redux/auth/actions';
import notification from '../../../components/Notification/Notification';
import { getUserByEmail } from '../../../../transversal-administration/redux/users/actions';
import { ThemeContext } from '../../App/ThemeWrapper';
const useStyles = makeStyles(styles);
class Login extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          token : false
      };
    this.editingPromiseResolve = () => {
    };
    this.editingPromiseResolve2 = () => {
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      history, isLoading, errors, signInResponse,userResponse
    } = this.props;
    if (localStorage.getItem('logedUser') != null) {
      (!isLoading && !isEmpty(errors) && notification('danger', errors));
      (!isLoading && !isEmpty(signInResponse) && history.push('/app'));
    }
  }

  componentDidMount() {
    const { changeTheme } = this.props;
    changeTheme('pinkBlueTheme');
  }

  submitForm(values) {
      const {token} = this.state;
    const {
      signIn, getUserByEmail
    } = this.props;

    const authBody = {
      userEmail: values.get('email'),
      userPassword: values.get('password')
    };
    new Promise((resolve2) => {
      getUserByEmail(values.get('email'));
      this.editingPromiseResolve2 = resolve2;
    }).then((result2) => {
      // notification('success', result2);
      delete result2.userPassword;
      localStorage.setItem('logedUser', JSON.stringify(result2));
      this.setState({token: !token});
    });
    new Promise((resolve) => {
      signIn(authBody);
      this.editingPromiseResolve = resolve;
    }).then((result) => {
    });
  }


  render() {
    const title = brand.name + ' - Login';
    const description = brand.desc;
    const {
      classes, isLoading, signInResponse, errors, userResponse, userIsLoading, userErrors
    } = this.props;
    (!isLoading && signInResponse) && this.editingPromiseResolve(signInResponse);
    (!isLoading && !signInResponse) && this.editingPromiseResolve(errors);

    (!userIsLoading && userResponse) && this.editingPromiseResolve2(userResponse);
    (!userIsLoading && !userResponse) && this.editingPromiseResolve2(userErrors);

    return (
      <div className={classes.root}>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        <div className={classes.container}>
          <div className={classes.userFormWrap}>
            <LoginForm onSubmit={(values) => this.submitForm(values)} />
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  signInResponse: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  signIn: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  signInResponse: state.getIn(['auth']).signInResponse,
  isLoading: state.getIn(['auth']).isLoading,
  errors: state.getIn(['auth']).errors,

  userResponse: state.getIn(['user']).userResponse,
  userIsLoading: state.getIn(['user']).isLoading,
  userErrors: state.getIn(['user']).errors
});

const mapDispatchToProps = dispatch => bindActionCreators({
  signIn, getUserByEmail
}, dispatch);
/*
export default withStyles(styles)(connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login)));
*/

const LoginMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Login));

export default () => {
  const { changeTheme } = useContext(ThemeContext);
  const classes = useStyles(styles);
  return <LoginMapped changeTheme={changeTheme} classes={classes} />;
};
