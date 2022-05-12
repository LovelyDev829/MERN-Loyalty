import React, {
  useCallback,
  useState,
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API_BASE_URL } from 'src/config';
import { Header } from './Header';
import Details from './Details';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ShipmentDetailsView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setShipment] = useState(null);
  const { shipmentId } = useParams();

  const getShipment = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/shipment/related/${shipmentId}`)
      .then((response) => {
        if (isMountedRef.current) {
          setShipment(response.data.shipments[0]);
        }
      });
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
      title="Shipment Details"
    >
      <Container maxWidth={false}>
        <Header shipment={shipment} />
        <Box mt={3}>
          <Details shipment={shipment} setShipment={setShipment} />
        </Box>
      </Container>
    </Page>
  );
}

export default ShipmentDetailsView;
