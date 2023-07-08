import React, { useState, useEffect } from 'react';
import NotPerchase from './NotPerchase';
import NotBuyDetails from './NotBuyDetails';

const PurchTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [selected, setSelected] = useState(user.is_salesref ? 0 : 1);

  const handleSelect = (i) => {
    setSelected(i);
  };
  return (
    <div className="tab">
      <div className="tab_contaner">
        {user.is_salesref ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            None Buy
          </div>
        ) : (
          ''
        )}

        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          All reasons
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <NotPerchase />
        ) : selected === 1 ? (
          <NotBuyDetails user={user} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default PurchTab;
