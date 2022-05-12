import React, {
  useState,
  useCallback,
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import Page from 'src/components/Page';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API_BASE_URL } from 'src/config';
import DriverEditForm from './DriverEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function DriverEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setDriver] = useState();
  const [customer, setCustomer] = useState();
  const { driverId } = useParams();

  const getDriver = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/driver/${driverId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.driver.customer}`);
    setCustomer(response02.data.customer);
    setDriver(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getDriver();
  }, [getDriver]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Driver Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <DriverEditForm shipment={shipment} customer={customer} />
        </Box>
      </Container>
    </Page>
  );
}

export default DriverEditView;
