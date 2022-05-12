import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Grid,
  Link,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
  root: {},
  actionIcon: {
    marginRight: theme.spacing(1)
  },
}));

function Header({
  className,
  warehouse,
  ...rest
}) {
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        spacing={3}
        justify="space-between"
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Grid item>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              variant="body1"
              color="inherit"
              to="/app"
              component={RouterLink}
            >
              Dashboard
            </Link>
            <Link
              variant="body1"
              color="inherit"
              to="/app/admin"
              component={RouterLink}
            >
              Admin
            </Link>
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Warehouse Details
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
    </>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  warehouse: PropTypes.object.isRequired,
};

export default Header;
