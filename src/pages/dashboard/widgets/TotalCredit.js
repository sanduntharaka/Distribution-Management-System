import React from 'react';

const TotalCredit = () => {
  return (
    <div className="wcontainer ">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <p>Credit summary</p>
          </div>
        </div>
      </div>
      <div className="wcontainer__row ">
        <div className="wcontainer__row__col credit tc">
          <p>Total credit</p>
          <p>150</p>
        </div>
        <div className="wcontainer__row__col credit cou">
          <p>Count</p>
          <p>150</p>
        </div>
        <div className="wcontainer__row__col credit above">
          <p>Above 45 days</p>
          <p>150</p>
        </div>
      </div>
    </div>
  );
};

export default TotalCredit;
