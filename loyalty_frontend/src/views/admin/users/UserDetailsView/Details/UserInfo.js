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

function UserInfo({ user, className, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/user/reset-password/${user.id}`);

      if (response.data.status) {
        enqueueSnackbar('Password reset, user will get an email for a new password.', {
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
            title="User info"
          />
        </Grid>
        <Grid
          item
        >
          <IconButton
            component={RouterLink}
            to={`/app/admin/users/${user.id}/edit`}
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
                {user.firstName}
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
                {user.lastName}
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
                {user.email}
              </Typography>
              <Label color={user.verifiedEmail ? 'success' : 'error'}>
                {user.verifiedEmail
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
                {user.phone}
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
                {user.aptSuite}
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
                {user.city}
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
                {user.state}
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
                {user.country}
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
                {user.postalCode}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        p={1}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
      >
        <Button onClick={handleResetPassword}>
          <LockOpenIcon className={classes.actionIcon} />
          Reset &amp; Send Password
        </Button>
      </Box>
    </Card>
  );
}

UserInfo.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object.isRequired
};

export default UserInfo;
