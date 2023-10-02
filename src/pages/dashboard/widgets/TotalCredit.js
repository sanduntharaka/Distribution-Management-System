import React from 'react';

const TotalCredit = ({ data }) => {
  return (
    <div className="wcontainer ">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <p>Credit Summary</p>
          </div>
        </div>
      </div>
      <div className="wcontainer__row ">
        <div className="wcontainer__row__col credit tc">
          <p>Total credit</p>
          <p>Rs {data.total ? data.total : 0} /-</p>
        </div>
        <div className="wcontainer__row__col credit cou">
          <p>Count</p>
          <p>{data.count ? data.count : 0}</p>
        </div>
        <div className="wcontainer__row__col credit above">
          <p>Above 45 days</p>
          <p>{data.above ? data.above : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default TotalCredit;
