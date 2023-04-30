import React from 'react';
import Sidebar from './Sidebar';
import { ThemeProvider, createTheme } from '@mui/material';
const defaultMaterialTheme = createTheme();
const Layout = (props) => {
  return (
    <React.Fragment>
      <div className="page">
        <div className="page__sidebar">
          <Sidebar />
        </div>

        <main className="page__content">
          <ThemeProvider theme={defaultMaterialTheme}>
            <React.Fragment>{props.children}</React.Fragment>
          </ThemeProvider>
        </main>
      </div>
    </React.Fragment>
  );
};

export default Layout;
