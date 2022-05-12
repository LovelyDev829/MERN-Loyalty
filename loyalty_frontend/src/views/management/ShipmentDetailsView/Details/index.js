import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import ShipmentInfo from './ShipmentInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Details({
  shipment,
  setShipment,
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
        md={12}
        lg={12}
        xl={12}
      >
        <ShipmentInfo shipment={shipment} setShipment={setShipment} />
      </Grid>

    </Grid>
  );
}

Details.propTypes = {
  className: PropTypes.string,
  shipment: PropTypes.object.isRequired,
  setShipment: PropTypes.func,
};

export default Details;
