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
import VendorEditForm from './VendorEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function VendorEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setVendor] = useState();
  const [customer, setCustomer] = useState();
  const { vendorId } = useParams();

  const getVendor = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/vendor/${vendorId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.vendor.customer}`);
    setCustomer(response02.data.customer);
    setVendor(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getVendor();
  }, [getVendor]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Vendor Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <VendorEditForm shipment={shipment} customer={customer} />
        </Box>
      </Container>
    </Page>
  );
}

export default VendorEditView;
