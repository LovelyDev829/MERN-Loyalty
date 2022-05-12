import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Edit as EditIcon
} from 'react-feather';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  gridSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  }
}));

function CustomerInfo({ customer, className, ...rest }) {
  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Grid
        container
        className={classes.gridSpaceBetween}
      >
        <Grid item>
          <CardHeader
            title="Customer info"
          />
        </Grid>
        <Grid
          item
        >
          <IconButton
            component={RouterLink}
            to={`/app/management/customers/${customer.id}/edit`}
          >
            <SvgIcon fontSize="small">
              <EditIcon />
            </SvgIcon>
          </IconButton>
        </Grid>
      </Grid>
      <Divider />
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              First Name
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.firstName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Last Name
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.lastName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Company
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.company}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Email
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.email}
              </Typography>
              <Label color={customer.verified ? 'success' : 'error'}>
                {customer.verified
                  ? 'Email verified'
                  : 'Email not verified'}
              </Label>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Phone
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.phone}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Fax
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.fax}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Apt, Suite, etc (optional)
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.aptSuite}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              City
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.city}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              State
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.state}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Country
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.country}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Zip/Postal code
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {customer.postalCode}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

CustomerInfo.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default CustomerInfo;
