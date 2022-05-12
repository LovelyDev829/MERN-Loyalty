import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import DriverCreateForm from './DriverCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function DriverCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Driver Create"
    >
      <Container maxWidth={false}>
        <Header />
        <DriverCreateForm />
      </Container>
    </Page>
  );
}

export default DriverCreateView;
