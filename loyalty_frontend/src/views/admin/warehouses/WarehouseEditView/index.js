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
import WarehouseEditForm from './WarehouseEditForm';
import Header from './Header';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function WarehouseEditView() {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [warehouse, setWarehouse] = useState();
  const { warehouseId } = useParams();

  const getWarehouse = useCallback(() => {
    axios
      .get(`${API_BASE_URL}/admin/warehouse/${warehouseId}`)
      .then((response) => {
        if (isMountedRef.current) {
          setWarehouse(response.data.warehouse);
        }
      });
  }, [isMountedRef]);

  useEffect(() => {
    getWarehouse();
  }, [getWarehouse]);

  if (!warehouse) {
    return null;
  }

  return (
    <Page
      className={classes.root}
      title="Warehouse Edit"
    >
      <Container maxWidth="lg">
        <Header />
        <Box mt={3}>
          <WarehouseEditForm warehouse={warehouse} />
        </Box>
      </Container>
    </Page>
  );
}

export default WarehouseEditView;
