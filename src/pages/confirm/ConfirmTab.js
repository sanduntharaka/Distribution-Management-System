import React, { useEffect, useState } from 'react';
import BillConfirm from './billconfirm/BillConfirm';
import AddCreditDetails from './creaditpayments/AddCreditDetails';
import SalesReturnConfirm from './salesreturnconfirm/SalesReturnConfirm';
import MarketReturnConfirm from './marcketreturnconfirm/MarketReturnConfirm';

const ConfirmTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  //message modal
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState('');
  const [title, setTitle] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const handleSelect = (i) => {
    setSelected(i);
  };
  return (
    <div className="tab">
      <div className="tab_contaner">
        <div
          className={`item ${selected === 0 ? 'selected' : ''}`}
          onClick={() => handleSelect(0)}
        >
          Bill Confirm
        </div>

        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          Credit bills
        </div>
        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Sales returns
        </div>
        <div
          className={`item ${selected === 3 ? 'selected' : ''}`}
          onClick={() => handleSelect(3)}
        >
          Market returns
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 && isLoading === false ? (
          <BillConfirm />
        ) : selected === 1 ? (
          <AddCreditDetails />
        ) : selected === 2 ? (
          <SalesReturnConfirm />
        ) : selected === 3 ? (
          <MarketReturnConfirm />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default ConfirmTab;
