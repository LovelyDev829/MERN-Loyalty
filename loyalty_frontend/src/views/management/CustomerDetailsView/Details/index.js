import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import CustomerInfo from './CustomerInfo';
import ShipmentListView from '../../ShipmentListView';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Details({
  customer,
  className,
  ...rest
}) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      spacing={3}
      {...rest}
    >
      <Grid
        item
        xs={12}
        md={6}
        lg={3}
        xl={3}
      >
        <CustomerInfo customer={customer} />
      </Grid>
      <Grid
        item
        xs={12}
        md={12}
        lg={9}
        xl={9}
      >
        <ShipmentListView
          isShowHeader={false}
          mtOfHeader={0}
          customer={customer}
        />
      </Grid>
    </Grid>
  );
}

Details.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired,
};

export default Details;
