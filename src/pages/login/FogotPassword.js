import React, { useState } from "react";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockResetIcon from "@mui/icons-material/LockReset";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import { axiosLoginInstance } from "../../axiosInstance";
import Spinner from "../../components/loadingSpinner/Spinner";
const theme = createTheme({});

const FogotPassword = () => {
  const [loading, setloading] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setloading(true);
    axiosLoginInstance
      .post("/users/reset_password/", {
        email: data.get("email"),
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
            background: "white",
            margin: "10px",
            width: "95%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: "25px",
          }}
        >
          <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
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
                    {loading ? <Spinner /> : ""}
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="/" variant="body2">
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

export default FogotPassword;
