import React, { useState, forwardRef, useRef } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import { axiosInstance } from '../../axiosInstance';
import Spinner from '../../components/loadingSpinner/Spinner';
const theme = createTheme({});
const ShowMessage = forwardRef((props, ref) => {
  return (
    <Message
      hide={props.handleClose}
      success={props.success}
      error={props.error}
      title={props.title}
      msg={props.msg}
      ref={ref}
    />
  );
});
const FogotPassword = () => {
  const inputRef = useRef(null);
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setloading(true);
    axiosInstance
      .post('/user/password-reset-email/', {
        email: data.get('email'),
      })
      .then((res) => {
        setloading(false);
        setError(false);
        setSuccess(true);
        setTitle('Success');
        setMsg(
          'Your password change email has been sended to your email. Please check your inbox'
        );
        handleOpen();
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
        setSuccess(false);
        setError(true);
        setTitle('Error');
        setMsg(
          'Cannot send email to your account. Please verify that the email entered is correct.'
        );
        handleOpen();
      });
  };
  return (
    <div className="login">
      <div className="logContent">
        <Modal open={open} onClose={handleClose}>
          <ShowMessage
            ref={inputRef}
            handleClose={handleClose}
            success={success}
            error={error}
            title={title}
            msg={msg}
          />
        </Modal>
        <div
          style={{
            background: 'white',
            margin: '10px',
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto',
            borderRadius: '25px',
          }}
        >
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                  <LockResetIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Fogot Password
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                    {loading ? <Spinner login={true} /> : ''}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="/" variant="body2">
                        Login Page
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
};

export default FogotPassword;
