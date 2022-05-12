import React, {
  useState,
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Breadcrumbs,
  Button,
  Grid,
  Link,
  SvgIcon,
  TextField,
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
    },
    marginTop: '8px',
    height: '40px',
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  typeSelect: {
    marginRight: '10px',
  }
}));

export const typeOptions = [
  {
    value: '1',
    label: 'Shipment'
  },
  {
    value: '2',
    label: 'Service'
  },
];
function Header({
  className, isShowHeader,
  handleTypeChangeParent,
  handleExportToCSV,
  ...rest
}) {
  const classes = useStyles();
  const [type, setType] = useState(typeOptions[0].value);
  const handleTypeChange = (event) => {
    event.persist();
    setType(event.target.value);
    handleTypeChangeParent(event.target.value);
  };

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
            Management
          </Link>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Reports
          </Typography>
          <Typography
            variant="body1"
            color="textPrimary"
          >
            Shipments / Services
          </Typography>
        </Breadcrumbs>
        <Typography
          variant="h3"
          color="textPrimary"
        >
          Reports - All Shipments / Services
        </Typography>
      </Grid>
      {isShowHeader && (
      <Grid item>
        <TextField
          label="type"
          name="type"
          onChange={handleTypeChange}
          select
          SelectProps={{ native: true }}
          value={type}
          variant="outlined"
          className={classes.typeSelect}
        >
          {typeOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </TextField>
        <Button
          color="secondary"
          variant="contained"
          className={classes.action}
          onClick={handleExportToCSV}
        >
          <SvgIcon
            fontSize="small"
            className={classes.actionIcon}
          >
            <PlusCircleIcon />
          </SvgIcon>
          Export to CSV
        </Button>
      </Grid>
      )}
    </Grid>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  isShowHeader: PropTypes.bool,
  handleTypeChangeParent: PropTypes.func,
  handleExportToCSV: PropTypes.func,
};

export default Header;
