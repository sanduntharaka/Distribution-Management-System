import React, { useEffect, useState } from 'react';
import { Box, Tab } from '@mui/material';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import AddInventory from './AddInventory';
import ViewInventory from './ViewInventory';
import DistributorInventory from './DistributorInventory';
import SalesRefInventory from './SalesRefInventory';
import { axiosInstance } from '../../axiosInstance';

const InventoryTabs = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [inventory, setInventory] = useState();
  useEffect(() => {
    if (JSON.parse(sessionStorage.getItem('user')).is_salesref === true) {
      axiosInstance
        .get(
          `/salesref/get/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          setInventory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    if (JSON.parse(sessionStorage.getItem('user')).is_distributor === true) {
      axiosInstance
        .get(
          `/distributor/get/${
            JSON.parse(sessionStorage.getItem('user_details')).id
          }`,
          {
            headers: {
              Authorization:
                'JWT ' + JSON.parse(sessionStorage.getItem('userInfo')).access,
            },
          }
        )
        .then((res) => {
          console.log('dis:', res.data);
          setInventory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  return (
    <TabContext value={value}>
      <Box className="tab" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="Add Inventory" value="1" />
          <Tab label="View inventory" value="2" />
          <Tab label="Distributor Inventory" value="3" />

          <Tab label="Sales Ref Inventory" value="4" />
        </TabList>
      </Box>
      <TabPanel value="1" className="tabContent">
        <AddInventory />
      </TabPanel>
      <TabPanel value="2" className="tabContent">
        <ViewInventory />
      </TabPanel>
      <TabPanel value="3" className="tabContent">
        <DistributorInventory inventory={inventory} />
      </TabPanel>
      <TabPanel value="4" className="tabContent">
        <SalesRefInventory inventory={inventory} />
      </TabPanel>
    </TabContext>
  );
};

export default InventoryTabs;
