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
import CustomerRepresentativeEditForm from './CustomerRepresentativeEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function CustomerRepresentativeEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setCustomerRepresentative] = useState();
  const [customer, setCustomer] = useState();
  const { customerRepresentativeId } = useParams();

  const getCustomerRepresentative = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/customer-representative/${customerRepresentativeId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.customerRepresentative.customer}`);
    setCustomer(response02.data.customer);
    setCustomerRepresentative(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getCustomerRepresentative();
  }, [getCustomerRepresentative]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="CustomerRepresentative Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <CustomerRepresentativeEditForm shipment={shipment} customer={customer} />
        </Box>
      </Container>
    </Page>
  );
}

export default CustomerRepresentativeEditView;
