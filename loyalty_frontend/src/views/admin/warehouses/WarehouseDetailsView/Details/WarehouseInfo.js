import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import {
  Button,
  Box,
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
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import {
  Edit as EditIcon
} from 'react-feather';
import Label from 'src/components/Label';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

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

function WarehouseInfo({ warehouse, className, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/warehouse/reset-password/${warehouse.id}`);

      if (response.data.status) {
        enqueueSnackbar('Password reset, warehouse will get an email for a new password.', {
          variant: 'success',
          action: <Button>See all</Button>
        });
      } else {
        enqueueSnackbar('Can\'t reset password.', {
          variant: 'error',
          action: <Button>See all</Button>
        });
      }
    } catch (error) {
      enqueueSnackbar('Can\'t reset password.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

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
            title="Warehouse info"
          />
        </Grid>
        <Grid
          item
        >
          <IconButton
            component={RouterLink}
            to={`/app/admin/warehouses/${warehouse.id}/edit`}
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
              Name
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {warehouse.name}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Contact Name
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {warehouse.contactName}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Contact Email
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {warehouse.contactEmail}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className={classes.fontWeightMedium}>
              Contact Phone
            </TableCell>
            <TableCell>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                {warehouse.contactPhone}
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
                {warehouse.aptSuite}
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
                {warehouse.city}
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
                {warehouse.state}
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
                {warehouse.country}
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
                {warehouse.postalCode}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}

WarehouseInfo.propTypes = {
  className: PropTypes.string,
  warehouse: PropTypes.object.isRequired
};

export default WarehouseInfo;
