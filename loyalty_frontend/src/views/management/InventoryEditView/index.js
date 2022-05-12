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
import InventoryEditForm from './InventoryEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function InventoryEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setInventory] = useState();
  const [customer, setCustomer] = useState();
  const { inventoryId } = useParams();

  const getInventory = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/inventory/${inventoryId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.inventory.customer}`);
    setCustomer(response02.data.customer);
    setInventory(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getInventory();
  }, [getInventory]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Inventory Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <InventoryEditForm shipment={shipment} customer={customer} />
        </Box>
      </Container>
    </Page>
  );
}

export default InventoryEditView;
