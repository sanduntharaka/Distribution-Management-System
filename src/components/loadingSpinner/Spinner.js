import React from 'react';

const Spinner = (props) => {
  return (
    <div className="spinner-container">
      <div
        className={`loading-spinner  ${
          props.login
            ? 'login'
            : props.detail
            ? 'detail'
            : props.page
            ? 'page'
            : props.search
            ? 'search'
            : ''
        } `}
      ></div>
    </div>
  );
};

export default Spinner;
