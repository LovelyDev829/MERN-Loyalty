import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import CustomerRepresentativeCreateForm from './CustomerRepresentativeCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function CustomerRepresentativeCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Customer Representative Create"
    >
      <Container maxWidth={false}>
        <Header />
        <CustomerRepresentativeCreateForm />
      </Container>
    </Page>
  );
}

export default CustomerRepresentativeCreateView;
