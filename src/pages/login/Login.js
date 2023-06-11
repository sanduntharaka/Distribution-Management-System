import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login } from '../../redux/actions/UserActions';
import '../../sass/main.scss';
import Spinner from '../../components/loadingSpinner/Spinner';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;
  const [showError, setShowError] = useState('');
  useEffect(() => {
    if (userInfo) {
      console.log('yes');
    }
  }, [userInfo]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    dispatch(login(data.get('user_name'), data.get('password')));
    navigate('/');

    if (error) {
      setShowError('Username or password not valid.');
      setTimeout(() => {
        setShowError('');
      }, 2000);
    }
  };
  return (
    <div className="login">
      <div className="logContent">
        <div className="logContent__img">
          <img src="./images/loginback.png" alt="" />
        </div>
        <div className="logContent__form">
          <Container style={{ height: '240px' }}>
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
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign in
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
                  id="user_name"
                  label="User name"
                  name="user_name"
                  autoComplete="user_name"
                  autoFocus
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                  {loading ? <Spinner login={true} /> : ''}
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Link href="/forgot" variant="body2">
                      Forgot password?
                    </Link>
                  </Grid>
                </Grid>
                {error ? <p style={{ color: 'red' }}>{showError}</p> : ''}
              </Box>
            </Box>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Login;
