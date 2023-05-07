import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import UserCreation from './UserCreation';
import UserDetails from './UserDetails';
import DistributorSalesRef from './DistributorSalesRef';
import AllUsers from './AllUsers';

const UserTabs = () => {
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
          User creation
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          Add user details
        </div>
        <div
          className={`item ${selected === 2 ? 'selected' : ''}`}
          onClick={() => handleSelect(2)}
        >
          Assign Sales Ref
        </div>
        <div
          className={`item ${selected === 3 ? 'selected' : ''}`}
          onClick={() => handleSelect(3)}
        >
          View details
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <UserCreation />
        ) : selected === 1 ? (
          <UserDetails />
        ) : selected === 2 ? (
          <DistributorSalesRef />
        ) : selected === 3 ? (
          <AllUsers />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default UserTabs;
