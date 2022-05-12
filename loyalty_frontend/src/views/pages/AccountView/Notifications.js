/* eslint-disable max-len */
/* eslint-disable no-empty */
import React, {
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import { SET_GARBAGE } from 'src/actions/garbageActions';

const useStyles = makeStyles(() => ({
  root: {}
}));

function Notifications({ className, oldGarbage, ...rest }) {
  const classes = useStyles();
  const [isEmailAllowed, setIsEmailAllowed] = useState(oldGarbage.isEmailAllowed);
  const [isNotificationAllowed, setIsNotificationAllowed] = useState(oldGarbage.isNotificationAllowed);
  const [isTextAllowed, setIsTextAllowed] = useState(oldGarbage.isTextAllowed);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Make API request
    try {
      const values = {
        isEmailAllowed,
        isNotificationAllowed,
        isTextAllowed,
      };
      const response = await axios.put(`${API_BASE_URL}/garbage`, values);
      if (response.data.status) {
        enqueueSnackbar('Notification Settings updated.', {
          variant: 'success',
        });
        dispatch({
          type: SET_GARBAGE,
          payload: {
            garbage: values,
          }
        });
      } else {
        enqueueSnackbar('Failed to save notification notificationSettings.', {
          variant: 'error',
        });
      }
    } catch (ex) {
      enqueueSnackbar('Failed to save notification notificationSettings.', {
        variant: 'error',
      });
    }
  };

  const getNotificationSettings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/garbage`);
      if (response.data.status) {
        setIsEmailAllowed(response.data.garbage.isEmailAllowed);
        setIsNotificationAllowed(response.data.garbage.isNotificationAllowed);
        setIsTextAllowed(response.data.garbage.isTextAllowed);

        const values = {
          isEmailAllowed: response.data.garbage.isEmailAllowed,
          isNotificationAllowed: response.data.garbage.isNotificationAllowed,
          isTextAllowed: response.data.garbage.isTextAllowed,
        };
        dispatch({
          type: SET_GARBAGE,
          payload: {
            garbage: values,
          }
        });
      }
    } catch (ex) {}
  };

  useEffect(() => {
    getNotificationSettings();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <CardHeader title="Notifications" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
              <div>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isEmailAllowed}
                      value={isEmailAllowed}
                      name="isEmailAllowed"
                      onChange={(event) => { setIsEmailAllowed(event.target.checked); }}
                    />
                  )}
                  label="Email alerts"
                />
              </div>
              <div>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isNotificationAllowed}
                      value={isNotificationAllowed}
                      name="isNotificationAllowed"
                      onChange={(event) => { setIsNotificationAllowed(event.target.checked); }}
                    />
                  )}
                  label="Push Notifications"
                />
              </div>
              <div>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={isTextAllowed}
                      value={isTextAllowed}
                      name="isTextAllowed"
                      onChange={(event) => { setIsTextAllowed(event.target.checked); }}
                    />
                  )}
                  label="Text message"
                />
              </div>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          p={2}
          display="flex"
          justifyContent="flex-end"
        >
          <Button
            color="secondary"
            type="submit"
            variant="contained"
          >
            Save Settings
          </Button>
        </Box>
      </Card>
    </form>
  );
}

Notifications.propTypes = {
  className: PropTypes.string,
  oldGarbage: PropTypes.any,
};

export default Notifications;
