import React from 'react';

const TotalSalesReturns = (props) => {
  return (
    <div className="wcontainer">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <h4>Sales Returns</h4>
          </div>
        </div>
        <div className="wcontainer__row__col">
          <p className="pcenter">{props.data}</p>
        </div>
      </div>
    </div>
  );
};
export default TotalSalesReturns;
