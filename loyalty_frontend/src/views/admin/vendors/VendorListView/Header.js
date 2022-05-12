import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  Typography,
  makeStyles
} from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {
  PlusCircle as PlusCircleIcon,
} from 'react-feather';

const useStyles = makeStyles((theme) => ({
  root: {},
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    }
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Header({ setModalCreateIsOpenToTrue, className, ...rest }) {
  const classes = useStyles();

  return (
    <Grid
      className={clsx(classes.root, className)}
      container
      justify="space-between"
      spacing={3}
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
            to="/app/management"
            component={RouterLink}
          >
            Admin
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Vendor
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          All Vendors
        </Typography>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={setModalCreateIsOpenToTrue}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <PlusCircleIcon />
          </SvgIcon>
          New Vendor
        </Button>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  setModalCreateIsOpenToTrue: PropTypes.func,
  className: PropTypes.string,
};

export default Header;
