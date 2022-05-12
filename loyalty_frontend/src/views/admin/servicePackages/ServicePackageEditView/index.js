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
import ServicePackageEditForm from './ServicePackageEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ServicePackageEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [shipment, setServicePackage] = useState();
  const [customer, setCustomer] = useState();
  const { servicePackageId } = useParams();

  const getServicePackage = useCallback(async () => {
    const response = await axios.get(`${API_BASE_URL}/admin/service-package/${servicePackageId}`);
    const response02 = await axios.get(`${API_BASE_URL}/customer/${response.data.servicePackage.customer}`);
    setCustomer(response02.data.customer);
    setServicePackage(response.data.shipment);
  }, [isMountedRef]);

  useEffect(() => {
    getServicePackage();
  }, [getServicePackage]);

  if (!shipment) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="ServicePackage Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <ServicePackageEditForm shipment={shipment} customer={customer} />
        </Box>
      </Container>
    </Page>
  );
}

export default ServicePackageEditView;
