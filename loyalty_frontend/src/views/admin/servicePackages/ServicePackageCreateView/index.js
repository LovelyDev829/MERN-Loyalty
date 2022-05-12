import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import ServicePackageCreateForm from './ServicePackageCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ServicePackageCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="ServicePackage Create"
    >
      <Container maxWidth={false}>
        <Header />
        <ServicePackageCreateForm />
      </Container>
    </Page>
  );
}

export default ServicePackageCreateView;
