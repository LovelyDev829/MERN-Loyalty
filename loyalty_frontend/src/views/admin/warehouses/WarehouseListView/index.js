import React from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function WarehouseListView() {
  const classes = useStyles();
  const { warehouses, totalCount } = useSelector((state) => state.warehouse);
  return (
    <Page
      className={classes.root}
      title="Warehouse List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results oldWarehouses={warehouses} oldTotalCount={totalCount} />
        </Box>
      </Container>
    </Page>
  );
}

export default WarehouseListView;
