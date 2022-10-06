import React from 'react';
import { forwardRef } from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import 'profile-picture/build/ProfilePicture.css';

const useStyles = makeStyles(theme => ({
  input: {
      height: '53px',
      fontFamily: 'sans-serif',
  }
}));

const phoneInput = (props, ref) => {
  const classes = useStyles();
  return (

    <TextField
      {...props}
      InputProps={{
        className: classes.input
      }}
      inputRef={ref}
      fullWidth
      size="small"
      variant="outlined"
      name="phone"
    />
  );
};
export default forwardRef(phoneInput);
