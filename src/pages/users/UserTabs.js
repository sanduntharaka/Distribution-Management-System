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
import ManagerDistributors from './ManagerDistributors';

const UserTabs = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [selected, setSelected] = useState(0);
  const handleSelect = (i) => {
    setSelected(i);
  };
  // is_companyStaff
  // is_distributor
  // is_manager
  // is_salesref
  // is_superuser
  return (
    <div className="tab">
      <div className="tab_contaner">
        {user.is_superuser ||
        user.is_manager ||
        user.is_distributor ||
        user.is_companyStaff ? (
          <div
            className={`item ${selected === 0 ? 'selected' : ''}`}
            onClick={() => handleSelect(0)}
          >
            User creation
          </div>
        ) : (
          ''
        )}
        {user.is_superuser ||
        user.is_manager ||
        user.is_distributor ||
        user.is_companyStaff ? (
          <div
            className={`item ${selected === 1 ? 'selected' : ''}`}
            onClick={() => handleSelect(1)}
          >
            Add user details
          </div>
        ) : (
          ''
        )}
        {user.is_superuser || user.is_manager ? (
          <div
            className={`item ${selected === 3 ? 'selected' : ''}`}
            onClick={() => handleSelect(3)}
          >
            Assign Distributor
          </div>
        ) : (
          ''
        )}
        {user.is_superuser ||
        user.is_manager ||
        user.is_distributor ||
        user.is_companyStaff ? (
          <div
            className={`item ${selected === 2 ? 'selected' : ''}`}
            onClick={() => handleSelect(2)}
          >
            Assign Sales Ref
          </div>
        ) : (
          ''
        )}

        {user.is_superuser || user.is_manager ? (
          <div
            className={`item ${selected === 4 ? 'selected' : ''}`}
            onClick={() => handleSelect(4)}
          >
            View details
          </div>
        ) : (
          ''
        )}
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <UserCreation />
        ) : selected === 1 ? (
          <UserDetails />
        ) : selected === 2 ? (
          <DistributorSalesRef />
        ) : selected === 3 ? (
          <ManagerDistributors />
        ) : selected === 4 ? (
          <AllUsers />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default UserTabs;
