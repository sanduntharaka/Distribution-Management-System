import React, { useState } from 'react';
import CreateDealer from './CreateDealer';
import ShowDealers from './ShowDealers';
import DealerCategory from './DealerCategory';
import SetupDealerOrder from './SetupDealerOrder';
const DealersTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const user_details = JSON.parse(sessionStorage.getItem('user_details'));

  const [selected, setSelected] = useState(
    user.is_manager ||
      user.is_superuser ||
      user.is_company ||
      user.is_excecutive
      ? 0
      : 1
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
          user.is_salesref ? (
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
        {
          user.is_salesref ? (
            <div
              className={`item ${selected === 3 ? 'selected' : ''}`}
              onClick={() => handleSelect(3)}
            >
              Setup Dealer Order
            </div>) : ''
        }
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <DealerCategory user={user} />
        ) : selected === 1 ? (
          <CreateDealer />
        ) : selected === 2 ? (
          <ShowDealers inventory={0} />
        ) : selected === 3 ? (
          <SetupDealerOrder inventory={0} user={user} user_details={user_details} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DealersTab;
