import React from 'react';

const Spinner = (props) => {
  return (
    <div className="spinner-container">
      <div
        className={`loading-spinner  ${
          props.login ? 'login' : props.detail ? 'detail' : ''
        } `}
      ></div>
    </div>
  );
};

export default Spinner;
