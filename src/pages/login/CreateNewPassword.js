import React, { useState } from 'react';

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

import { axiosLoginInstance } from '../../axiosInstance';
import { useParams } from 'react-router-dom';
import Spinner from '../../components/loadingSpinner/Spinner';
const theme = createTheme({});
const CreateNewPassword = () => {
  const { uuid, token } = useParams();
  const [loading, setloading] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setloading(true);
    axiosLoginInstance
      .post('/users/reset_password/', {
        uid: uuid,
        token: token,
        new_password: data.get('password1'),
        re_new_password: data.get('password2'),
      })
      .then((res) => {
        setloading(false);
        console.log(res);
      })
      .catch((err) => {
        setloading(false);
        console.log(err);
      });
  };
  return (
    <div className="login">
      <div className="logContent">
        <div
          style={{
            background: 'white',
            marginTop: 25,
            marginBottom: 25,
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
                  Fogot password
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
                    id="password1"
                    label="Password"
                    name="password1"
                    autoComplete="password1"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password2"
                    label="Confirm Password"
                    name="password2"
                    autoComplete="password2"
                    autoFocus
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Submit
                    {loading ? <Spinner /> : ''}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="/login" variant="body2">
                        login page
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

export default CreateNewPassword;
