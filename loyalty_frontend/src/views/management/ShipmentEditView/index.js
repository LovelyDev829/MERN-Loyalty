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
import ShipmentEditForm from './ShipmentEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ShipmentEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setShipment] = useState();
  const [customer, setCustomer] = useState();
  const [driver, setDriver] = useState();
  const [customerRepresentative, setCustomerRepresentative] = useState();
  const { shipmentId, type } = useParams();

  const getShipment = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/shipment/${shipmentId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.shipment.customer}`);
    if (response.data.shipment.driver === undefined) {
      setDriver('');
    } else if (response.data.shipment.driver === null) {
      setDriver('');
    } else {
      const response03 = await axios.get(`${API_BASE_URL}/admin/driver/${response.data.shipment.driver}`);
      setDriver(response03.data.driver);
    }

    if (response.data.shipment.customerRepresentative === undefined) {
      setCustomerRepresentative('');
    } else if (response.data.shipment.customerRepresentative === null) {
      setCustomerRepresentative('');
    } else {
      const response03 = await axios.get(`${API_BASE_URL}/admin/customer-representative/${response.data.shipment.customerRepresentative}`);
      setCustomerRepresentative(response03.data.customerRepresentative);
    }
    setCustomer(response02.data.customer);
    setShipment(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getShipment();
  }, [getShipment]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Shipment Edit"
    >
      <Container maxWidth="lg">
        <Header type={type} />
        <Box mt={3}>
          <ShipmentEditForm
            shipment={shipment}
            customer={customer}
            driver={driver}
            type={type}
            customerRepresentative={customerRepresentative}
          />
        </Box>
      </Container>
    </Page>
  );
}

export default ShipmentEditView;
