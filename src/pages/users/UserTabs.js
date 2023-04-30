import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import UserCreation from './UserCreation';
import UserDetails from './UserDetails';

import { TabComponent } from '../../components/tab/TabsComponent';
import { TabButtons } from '../../components/tab/TabButtons';
import { TabContent } from '../../components/tab/TabsContent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const UserTabs = () => {
  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    // <TabComponent>
    //   <TabButtons>
    //     <button
    //       className={toggleState === 1 ? 'tabs active-tabs' : 'tabs'}
    //       onClick={() => toggleTab(1)}
    //     >
    //       Create user
    //     </button>
    //     <button
    //       className={toggleState === 2 ? 'tabs active-tabs' : 'tabs'}
    //       onClick={() => toggleTab(2)}
    //     >
    //       Add details
    //     </button>
    //     <button
    //       className={toggleState === 3 ? 'tabs active-tabs' : 'tabs'}
    //       onClick={() => toggleTab(3)}
    //     >
    //       Show users
    //     </button>
    //   </TabButtons>
    //   <TabContent>
    //     <div
    //       className={toggleState === 1 ? 'content  active-content' : 'content'}
    //     >
    //       <UserCreation />
    //     </div>

    //     <div
    //       className={toggleState === 2 ? 'content  active-content' : 'content'}
    //     >
    //       <UserDetails />
    //     </div>
    //     <div
    //       className={toggleState === 3 ? 'content  active-content' : 'content'}
    //     >
    //       <h3>User details</h3>
    //     </div>
    //   </TabContent>
    // </TabComponent>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons={false}
          aria-label="scrollable prevent tabs example"
        >
          <Tab label="User creation" />
          <Tab label="Add user details" />
          <Tab label="View user" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UserCreation />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UserDetails />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </Box>
  );
};

export default UserTabs;
