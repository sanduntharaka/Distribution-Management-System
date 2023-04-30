import React, { useState } from 'react';
import './delaser_tab.scss';
import Message from '../../components/message/Message';
import Modal from '@mui/material/Modal';
import CreateDealer from './CreateDealer';
const DealersTab = () => {
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
          Create Dealer
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          View Dealers
        </div>
      </div>
      <div className="tab_page">{selected === 0 ? <CreateDealer /> : ''}</div>
    </div>
  );
};

export default DealersTab;
