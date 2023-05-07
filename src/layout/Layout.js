import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { ThemeProvider, createTheme } from '@mui/material';
import { BiPurchaseTagAlt, BiMenu } from 'react-icons/bi';
const defaultMaterialTheme = createTheme();
const Layout = (props) => {
  const [show, setShow] = useState('');
  const handleShowMenu = (e) => {
    setShow('show');
    if (show === 'show') {
      setShow('hide');
    }
    if (show === 'hide') {
      setShow('show');
    }
  };
  const handleHideMenu = (e) => {
    setShow('hide');
  };
  return (
    <React.Fragment>
      <div className="page">
        <BiMenu className="page__menu" onClick={(e) => handleShowMenu(e)} />
        <div
          className={`page__sidebar ${show}`}
          onClick={(e) => handleHideMenu(e)}
        >
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
