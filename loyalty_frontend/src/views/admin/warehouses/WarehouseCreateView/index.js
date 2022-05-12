import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import WarehouseCreateForm from './WarehouseCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function WarehouseCreateView() {
  const classes = useStyles();

  return (
    <Page
      className={classes.root}
      title="Warehouse Create"
    >
      <Container maxWidth={false}>
        <Header />
        <WarehouseCreateForm />
      </Container>
    </Page>
  );
}

export default WarehouseCreateView;
