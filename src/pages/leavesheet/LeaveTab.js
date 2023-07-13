import React, { useState } from 'react';
import CreateLeave from './CreateLeave';
import CreatedLeaves from './CreatedLeaves';
import ToApproveLeaves from './ToApproveLeaves';
import AllLeaves from './AllLeaves';

const LeaveTab = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [selected, setSelected] = useState(
    user.is_salesref || user.is_manager || user.is_excecutive
      ? 0
      : user.is_company
      ? 2
      : 3
  );
  const handleSelect = (i) => {
    setSelected(i);
  };
  return (
    <div className="tab">
      <div className="tab_contaner">
        {user.is_salesref || user.is_manager || user.is_excecutive ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            Create Leave
          </div>
        ) : (
          ''
        )}
        {user.is_manager || user.is_company ? (
          <div
            className={`item ${selected === 2 ? 'selected' : ''}`}
            onClick={() => handleSelect(2)}
          >
            Approve leaves
          </div>
        ) : (
          ''
        )}
        {user.is_company ||
        user.is_manager ||
        user.is_excecutive ||
        user.is_distributor ? (
          <div
            className={`item ${selected === 3 ? 'selected' : ''}`}
            onClick={() => handleSelect(3)}
          >
            All Leaves
          </div>
        ) : (
          ''
        )}
        {user.is_salesref || user.is_manager || user.is_excecutive ? (
          <div
            className={`item ${selected === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >
            My Leaves
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <CreateLeave />
        ) : selected === 1 ? (
          <CreatedLeaves />
        ) : selected === 2 ? (
          <ToApproveLeaves />
        ) : selected === 3 ? (
          <AllLeaves />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default LeaveTab;
