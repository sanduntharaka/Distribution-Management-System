import React, { useState } from 'react';
import AssignSalesRef from './AssignSalesRef';
import ShowInvoices from './ShowInvoices';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';

const SalesTabs = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <TabContext value={value}>
      <Box className="tab" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Assign" value="1" />
          <Tab label="View" value="2" />
        </TabList>
      </Box>
      <TabPanel value="1" className="tabContent">
        <AssignSalesRef />
      </TabPanel>
      <TabPanel value="2" className="tabContent">
        <ShowInvoices />
      </TabPanel>
    </TabContext>
  );
};

export default SalesTabs;
