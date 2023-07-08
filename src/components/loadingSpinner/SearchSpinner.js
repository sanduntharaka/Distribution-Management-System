import React from 'react';

const SearchSpinner = (props) => {
  return (
    <div className="searchspinner-container">
      <div
        className={`searchloading-spinner  ${props.search ? 'search' : ''} `}
      ></div>
    </div>
  );
};

export default SearchSpinner;
