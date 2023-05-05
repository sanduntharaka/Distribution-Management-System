import React, { useState } from 'react';
import './delaser_tab.scss';
import CreateDealer from './CreateDealer';
import ShowDealers from './ShowDealers';
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
      <div className="tab_page">
        {selected === 0 ? (
          <CreateDealer />
        ) : selected === 1 ? (
          <ShowDealers inventory={0} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DealersTab;
