import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Header from './Header';
import ShipmentCreateForm from './ShipmentCreateForm';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

function ShipmentCreateView() {
  const classes = useStyles();
  const { type } = useParams();

  return (
    <Page
      className={classes.root}
      title={type === '1' ? 'Shipment Create' : 'Service Create'}
    >
      <Container maxWidth={false}>
        <Header type={type} />
        <ShipmentCreateForm type={type} />
      </Container>
    </Page>
  );
}

export default ShipmentCreateView;
