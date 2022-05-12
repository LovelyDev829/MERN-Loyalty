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

function CustomerListView() {
  const classes = useStyles();
  const { customers, totalCount } = useSelector((state) => state.customer);
  return (
    <Page
      className={classes.root}
      title="Customer List"
    >
      <Container maxWidth={false}>
        <Header />
        <Box mt={3}>
          <Results oldCustomers={customers} oldTotalCount={totalCount} />
        </Box>
      </Container>
    </Page>
  );
}

export default CustomerListView;
