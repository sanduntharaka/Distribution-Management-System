import React from 'react';

const TotalReturns = (props) => {
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <p>Returns</p>
          </div>
        </div>
      </div>
      <div className="wcontainer__row mt details">
        <div className="wcontainer__row__col">Market</div>
        <div className="wcontainer__row__col">{props.market}</div>
      </div>
      <div className="wcontainer__row details">
        <div className="wcontainer__row__col">Sales</div>
        <div className="wcontainer__row__col">{props.sales}</div>
      </div>
    </div>
  );
};
export default TotalReturns;
