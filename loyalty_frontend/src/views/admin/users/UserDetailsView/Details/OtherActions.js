import React, { useState } from 'react';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  Divider,
  Switch,
  Typography,
  makeStyles
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';

const useStyles = makeStyles((theme) => ({
  root: {},
  deleteAction: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark
    }
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  confirmPopupHeader: {
    minWidth: '500px',
  }
}));

function OtherActions({ user, className, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isActive, setIsActive] = useState(user.isActive);
  const [isAdmin, setIsAdmin] = useState(user.role === 'admin');
  const [isReportsAccess, setIsReportsAccess] = useState(user.isReportsAccess);
  const [viewConfirm, setViewConfirm] = useState(false);
  const history = useHistory();

  const handleIsActive = async (event) => {
    event.persist();
    setIsActive(event.target.checked);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/user/set-active/${user.id}`,
        { isActive: event.target.checked });

      const msg = event.target.checked ? 'Enabled Login' : 'Disabled Login';
      const err_msg = event.target.checked ? 'Can\'t enable Login' : 'Can\'t disable Login';

      if (response.data.status) {
        enqueueSnackbar(msg, {
          variant: 'success',
          action: <Button>See all</Button>
        });
      } else {
        enqueueSnackbar(err_msg, {
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

  const handleAllowAdmin = async (event) => {
    event.persist();
    setIsAdmin(event.target.checked);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/user/set-admin/${user.id}`,
        { isAdmin: event.target.checked });

      const msg = event.target.checked ? 'Enabled Admin rights' : 'Disabled Admin rights';
      const err_msg = event.target.checked ? 'Can\'t enable Admin rights' : 'Can\'t disable Admin rights';

      if (response.data.status) {
        enqueueSnackbar(msg, {
          variant: 'success',
          action: <Button>See all</Button>
        });
      } else {
        enqueueSnackbar(err_msg, {
          variant: 'error',
          action: <Button>See all</Button>
        });
      }
    } catch (error) {
      enqueueSnackbar('Can\'t change Admin rights.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  const handleAllowReportsAccess = async (event) => {
    event.persist();
    setIsReportsAccess(event.target.checked);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/user/set-reports-access/${user.id}`,
        { isReportsAccess: event.target.checked });

      const msg = event.target.checked ? 'Enabled Reports Access rights' : 'Disabled Report sAccess rights';
      const err_msg = event.target.checked ? 'Can\'t enable Reports Access rights' : 'Can\'t disable Reports Access rights';

      if (response.data.status) {
        enqueueSnackbar(msg, {
          variant: 'success',
          action: <Button>See all</Button>
        });
      } else {
        enqueueSnackbar(err_msg, {
          variant: 'error',
          action: <Button>See all</Button>
        });
      }
    } catch (error) {
      enqueueSnackbar('Can\'t change Reports Access rights.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  const processConfirm = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/user/${user.id}`);

      if (response.data.status) {
        enqueueSnackbar('Account deleted', {
          variant: 'success',
          action: <Button>See all</Button>
        });
        history.push('/app/admin/users');
      } else {
        enqueueSnackbar('Can\'t delete account.', {
          variant: 'error',
          action: <Button>See all</Button>
        });
      }
    } catch (error) {
      enqueueSnackbar('Can\'t delete account.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  const handleDeleteAccount = async () => {
    setViewConfirm(true);
  };

  const onConfirmYes = () => {
    setViewConfirm(false);
    processConfirm();
  };

  const onConfirmNo = () => {
    setViewConfirm(false);
  };

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Other actions" />
        <Divider />
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box
              md={6}
              xs={12}
            >
              <Typography
                variant="h5"
                color="textPrimary"
              >
                Enable Login
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                Disabling this will automatically disable user login
              </Typography>
              <Switch
                checked={isActive}
                color="secondary"
                edge="start"
                name="isActive"
                onChange={handleIsActive}
                // value={isActive}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box
              md={6}
              xs={12}
            >
              <Typography
                variant="h5"
                color="textPrimary"
              >
                Admin
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                Selection will give the user admin rights
              </Typography>
              <Switch
                checked={isAdmin}
                color="secondary"
                edge="start"
                name="isAdmin"
                onChange={handleAllowAdmin}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
          >
            <Box
              md={6}
              xs={12}
            >
              <Typography
                variant="h5"
                color="textPrimary"
              >
                Reports Access
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                Selection will give the user reports access rights
              </Typography>
              <Switch
                checked={isReportsAccess}
                color="secondary"
                edge="start"
                name="isReportsAccess"
                onChange={handleAllowReportsAccess}
              />
            </Box>
          </Box>
          <Box
            mt={1}
            mb={2}
          >
            <Typography
              variant="body2"
              color="textSecondary"
            >
              Remove this customer’s data if he requested that, if not please
              be aware that what has been deleted can never brough back
            </Typography>
          </Box>
          <Button className={classes.deleteAction} onClick={handleDeleteAccount}>
            <DeleteIcon className={classes.actionIcon} />
            Delete Account
          </Button>
        </CardContent>
      </Card>
      <Dialog open={viewConfirm}>
        <Box p={2} className={classes.confirmPopupHeader}>
          <Typography
            align="left"
            gutterBottom
            variant="h3"
            color="textPrimary"
          >
            Are you sure?
          </Typography>
        </Box>
        <Divider />
        <Box p={2}>
          <Typography
            align="left"
            gutterBottom
            variant="p"
            color="textPrimary"
          >
            Would you like to delete this account?
          </Typography>
        </Box>
        <Divider />
        <Box
          p={2}
          display="flex"
          alignItems="center"
        >
          <Box flexGrow={1} />
          <Button onClick={onConfirmNo}>
            No
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.confirmButton}
            onClick={onConfirmYes}
          >
            Yes
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

OtherActions.propTypes = {
  user: PropTypes.object,
  className: PropTypes.string
};

export default OtherActions;
