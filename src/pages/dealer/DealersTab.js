import React, { useState } from 'react';
import CreateDealer from './CreateDealer';
import ShowDealers from './ShowDealers';
import DealerCategory from './DealerCategory';
const DealersTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [selected, setSelected] = useState(
    user.is_manager || user.is_superuser ? 0 : 1
  );
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
          Dealer Category
        </div>

        {user.is_distributor ||
        user.is_salesref ||
        user.is_excecutive ||
        user.is_manager ||
        user.is_superuser ? (
          <div
            className={`item ${selected === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >
            Create Dealer
          </div>
        ) : (
          ''
        )}

        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          View Dealers
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <DealerCategory user={user} />
        ) : selected === 1 ? (
          <CreateDealer />
        ) : selected === 2 ? (
          <ShowDealers inventory={0} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DealersTab;
