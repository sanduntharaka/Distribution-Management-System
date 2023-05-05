import React, { useEffect } from 'react';

const ShowError = (props) => {
  useEffect(() => {
    setTimeout(() => {
      //   setShowError(false);
    }, 1000);
  }, []);
  return (
    <p style={{ color: 'red' }}>
      Username or password not valid. Please enter valid username and password.
    </p>
  );
};

export default ShowError;
