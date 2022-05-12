/* eslint-disable no-empty */
import React, {
  useRef,
  useState,
  useEffect
} from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import {
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  SvgIcon,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Bell as BellIcon,
  Package as PackageIcon,
  MessageCircle as MessageIcon,
  Truck as TruckIcon,
} from 'react-feather';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import { getNotifications } from 'src/actions/notificationsActions';

const iconsMap = {
  order_placed: PackageIcon,
  new_message: MessageIcon,
  item_shipped: TruckIcon
};

const useStyles = makeStyles((theme) => ({
  popover: {
    width: 320
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText
  },
  number: {
    height: '20px',
    minWidth: '22px',
    backgroundColor: '#d63031',
    borderRadius: '20px',
    color: 'white',
    textAlign: 'center',
    position: 'absolute',
    top: '3px',
    left: '23px',
    padding: '3px',
    borderStyle: 'solid',
    borderWidth: '1px',
    fontSize: '10px',
    // border: 'none',
  },
  list: {
    maxHeight: '350px',
    overflowY: 'auto',
  }
}));

function Notifications() {
  const classes = useStyles();
  const notifications = useSelector((state) => state.notifications.notifications);
  const countUnRead = useSelector((state) => state.notifications.countUnRead);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkAllAsRead = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notification/mark-all-as-read`, {});
      if (response.data.status) {
        dispatch(getNotifications());
      }
    } catch (ex) {}
  };

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          ref={ref}
          onClick={handleOpen}
        >
          {countUnRead > 0 && (
            <div
              className={classes.number}
            >
              {countUnRead}
            </div>
          )}
          <SvgIcon>
            <BellIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        classes={{ paper: classes.popover }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <Box p={2}>
          <Typography
            variant="h5"
            color="textPrimary"
          >
            Notifications
          </Typography>
        </Box>
        {notifications.length === 0 ? (
          <Box p={2}>
            <Typography
              variant="h6"
              color="textPrimary"
            >
              There are no notifications
            </Typography>
          </Box>
        ) : (
          <>
            <List
              className={classes.list}
              disablePadding
            >
              {notifications.map((notification) => {
                // const Icon = iconsMap[notification.type];
                let Icon = iconsMap.item_shipped;
                if (notification.type === 'Upcoming Shipment Pickup Date') {
                  Icon = iconsMap.item_shipped;
                }

                return (
                  <ListItem
                    className={classes.listItem}
                    component="a"
                    href={notification.refURL}
                    divider
                    key={notification._id}
                    // component={RouterLink}
                    // to={notification.refURL}
                  >
                    <ListItemAvatar>
                      <Avatar
                        className={classes.icon}
                      >
                        <SvgIcon fontSize="small">
                          <Icon />
                        </SvgIcon>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      primaryTypographyProps={{ variant: 'subtitle2', color: 'textPrimary' }}
                      secondary={notification.description}
                    />
                  </ListItem>
                );
              })}
            </List>
            <Box
              p={1}
              display="flex"
              justifyContent="center"
            >
              <Button
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  );
}

export default Notifications;
