import React from 'react';

const PendingInvoices = ({ data }) => {
  return (
    <div className="wcontainer ">
      <div className="wcontainer__row">
        <div className="wcontainer__row__col">
          <div className="title">
            <p>Pending invoice summary</p>
          </div>
        </div>
      </div>
      <div className="wcontainer__row ">
        <div className="wcontainer__row__col credit ">
          <p>Total invoices</p>
          <p>Rs {data.total ? data.total : 0} /-</p>
        </div>
        <div className="wcontainer__row__col credit ">
          <p>Count</p>
          <p>{data.count ? data.count : 0}</p>
        </div>
        <div className="wcontainer__row__col credit ">
          <p>Above 7 days</p>
          <p>{data.above ? data.above : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default PendingInvoices;
