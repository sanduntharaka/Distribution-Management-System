import React from 'react';

const PendingInvoices = () => {
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
          <p>150</p>
        </div>
        <div className="wcontainer__row__col credit ">
          <p>Count</p>
          <p>150</p>
        </div>
        <div className="wcontainer__row__col credit ">
          <p>Above 7 days</p>
          <p>150</p>
        </div>
      </div>
    </div>
  );
};

export default PendingInvoices;
