import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AssignDistribution from './AssignDistribution';
import ShowInvoices from './ShowInvoices';

const DistributionTabs = () => {
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
          Assign
        </div>
        <div
          className={`item ${selected === 1 ? 'selected' : ''}`}
          onClick={() => handleSelect(1)}
        >
          View
        </div>
      </div>
      <div className="tab_page">
        {selected === 0 ? (
          <AssignDistribution />
        ) : selected === 1 ? (
          <ShowInvoices />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default DistributionTabs;
