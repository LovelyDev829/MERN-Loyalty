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

function OtherActions({ warehouse, className, ...rest }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isDefault, setIsDefault] = useState(warehouse.isDefault);
  const [viewConfirm, setViewConfirm] = useState(false);
  const history = useHistory();

  const handleIsDefault = async (event) => {
    const { checked } = event.target;
    setIsDefault(checked);
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/warehouse/set-default/${warehouse.id}`,
        { isDefault: checked });

      const msg = checked ? 'Set as a Default Warehouse' : 'It is not a Default Warehouse now.';
      const err_msg = checked ? 'Can\'t set as Default Warehouse' : 'Can\'t set as Default Warehouse';
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
      console.log('>>> error', error);
      enqueueSnackbar('Can\'t set / unset.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  const processConfirm = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/admin/warehouse/${warehouse.id}`);

      if (response.data.status) {
        enqueueSnackbar('Warehouse deleted', {
          variant: 'success',
          action: <Button>See all</Button>
        });
        history.push('/app/admin/warehouses');
      } else {
        enqueueSnackbar('Can\'t delete Warehouse.', {
          variant: 'error',
          action: <Button>See all</Button>
        });
      }
    } catch (error) {
      enqueueSnackbar('Can\'t delete Warehouse.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  const handleDeleteWarehouse = async () => {
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
                Default Warehouse
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
              >
                Selection will set the warehouse as a default one
              </Typography>
              <Switch
                checked={isDefault}
                color="secondary"
                edge="start"
                name="isDefault"
                onChange={handleIsDefault}
                // value={isDefault}
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
              Remove this warehouse's data if requested, if not please
              be aware that what has been deleted can never brough back
            </Typography>
          </Box>
          <Button className={classes.deleteAction} onClick={handleDeleteWarehouse}>
            <DeleteIcon className={classes.actionIcon} />
            Delete Warehouse
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
            Would you like to delete this warehouse?
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
  warehouse: PropTypes.object,
  className: PropTypes.string
};

export default OtherActions;
