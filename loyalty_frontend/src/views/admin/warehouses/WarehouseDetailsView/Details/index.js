import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import OtherActions from 'src/views/admin/warehouses/WarehouseDetailsView/Details/OtherActions';
import WarehouseInfo from './WarehouseInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Details({
  warehouse,
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
        <WarehouseInfo warehouse={warehouse} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        lg={3}
        xl={3}
      >
        <OtherActions warehouse={warehouse} />
      </Grid>
    </Grid>
  );
}

Details.propTypes = {
  className: PropTypes.string,
  warehouse: PropTypes.object.isRequired,
};

export default Details;
