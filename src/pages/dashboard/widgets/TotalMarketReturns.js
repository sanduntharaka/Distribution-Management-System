import React from 'react';

const TotalMarketReturns = (props) => {
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Market Returns</h4>
          </div>
        </div>
        <div className="wcontainer__row__col">
          <p className="pcenter">{props.data}</p>
        </div>
      </div>
    </div>
  );
};
export default TotalMarketReturns;
