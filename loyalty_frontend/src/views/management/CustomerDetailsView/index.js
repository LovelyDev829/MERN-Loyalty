import React, {
  useCallback,
  useState,
  useEffect
} from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';
import axios from 'src/utils/axios';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import { API_BASE_URL } from 'src/config';
import Header from './Header';
import Details from './Details';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  popupModal: {
    // width: '897px',
    minWidth: '500px',
    height: '80%',
    zIndex: '10000',
    position: 'fixed',
    top: '100px',
    left: '50%',
    overflow: 'scroll',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    width: '60%',
  }
}));

function CustomerDetailsView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [customer, setCustomer] = useState(null);
  const { customerId } = useParams();
  const getCustomer = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/customer/${customerId}`)
      .then((response) => {
        if (isMountedRef.current) {
          setCustomer(response.data.customer);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getCustomer();
  }, [getCustomer]);

  if (!customer) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Customer Details"
    >
      <Container maxWidth={false}>
        <Header customer={customer} />
        <Typography
          variant="h3"
          color="textPrimary"
        >
          {customer.firstName}
          &nbsp;
          {customer.lastName}
        </Typography>
        <Box mt={3} />
        <Divider />
        <Box mt={3}>
          <Details
            customer={customer}
          />
        </Box>
      </Container>
    </Page>
  );
}

export default CustomerDetailsView;
