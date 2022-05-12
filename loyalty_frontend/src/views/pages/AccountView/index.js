import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Divider,
  Tab,
  Tabs,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import General from './General';
import Subscription from './Subscription';
import Notifications from './Notifications';
import Security from './Security';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function AccountView() {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = useState('general');
  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'security', label: 'Security' },
    { value: 'notifications', label: 'Notifications' },
  ];

  const handleTabsChange = (event, value) => {
    setCurrentTab(value);
  };

  const { garbage } = useSelector((state) => state.garbage);

  return (
    <Page
      className={classes.root}
      title="Settings"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <Tabs
            onChange={handleTabsChange}
            scrollButtons="auto"
            value={currentTab}
            variant="scrollable"
            textColor="secondary"
            className={classes.tabs}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
              />
            ))}
          </Tabs>
        </Box>
        <Divider />
        <Box mt={3}>
          {currentTab === 'general' && <General />}
          {currentTab === 'subscription' && <Subscription />}
          {currentTab === 'notifications' && <Notifications oldGarbage={garbage} />}
          {currentTab === 'security' && <Security />}
        </Box>
      </Container>
    </Page>
  );
}

export default AccountView;
