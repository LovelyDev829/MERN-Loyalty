import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import VendorCreateForm from './VendorCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function VendorCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Vendor Create"
    >
      <Container maxWidth={false}>
        <Header />
        <VendorCreateForm />
      </Container>
    </Page>
  );
}

export default VendorCreateView;
