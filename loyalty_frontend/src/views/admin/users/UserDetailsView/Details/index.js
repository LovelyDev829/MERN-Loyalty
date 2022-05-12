import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid, makeStyles } from '@material-ui/core';
import OtherActions from 'src/views/admin/users/UserDetailsView/Details/OtherActions';
import UserInfo from './UserInfo';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Details({
  user,
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
        <UserInfo user={user} />
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        lg={3}
        xl={3}
      >
        <OtherActions user={user} />
      </Grid>
    </Grid>
  );
}

Details.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired,
};

export default Details;
