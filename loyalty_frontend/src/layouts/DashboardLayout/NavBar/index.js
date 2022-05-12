/* eslint-disable no-use-before-define */
/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useLocation, matchPath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  Link,
  List,
  ListSubheader,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  Users as UsersIcon,
  Truck as TruckIcon,
  Package as ServiceIcon,
  List as VendorIcon,
  List as InventoryIcon,
  Home as WarehouseIcon,
  Users as DriverIcon,
  FileText as ReportsIcon,
  UserCheck as CustomerRepresentativeIcon,
} from 'react-feather';
import Logo from 'src/components/Logo';
import NavItem from './NavItem';

const navConfig = [
  {
    subheader: 'Management',
    items: [
      {
        title: 'Customers',
        icon: UsersIcon,
        href: '/app/management/customers',
      },
      {
        title: 'Shipments / Services',
        icon: TruckIcon,
        href: '/app/management/shipments',
      },
      {
        title: 'Inventories',
        icon: InventoryIcon,
        href: '/app/management/inventories',
      },
    ]
  },
];

const navConfigReports = [
  {
    subheader: 'Reports',
    items: [
      {
        title: 'Shipments / Services',
        icon: ReportsIcon,
        href: '/app/management/reports/shipments',
      },
    ]
  },
];

const navConfigAdmin = [
  {
    subheader: 'Admin',
    items: [
      {
        title: 'Users',
        icon: UsersIcon,
        href: '/app/admin/users',
      },
      {
        title: 'Service Packages',
        icon: ServiceIcon,
        href: '/app/admin/service-packages',
      },
      {
        title: 'Warehouses',
        icon: WarehouseIcon,
        href: '/app/admin/warehouses',
      },
      {
        title: 'Vendors',
        icon: VendorIcon,
        href: '/app/admin/vendors',
      },
      {
        title: 'Drivers',
        icon: DriverIcon,
        href: '/app/admin/drivers',
      },
      {
        title: 'Customer Representatives',
        icon: CustomerRepresentativeIcon,
        href: '/app/admin/customer-representatives',
      },
    ]
  },
];

function renderNavItems({ items, ...rest }) {
  return (
    <List disablePadding>
      {items.reduce(
        (acc, item) => reduceChildRoutes({ acc, item, ...rest }),
        []
      )}
    </List>
  );
}

function reduceChildRoutes({
  acc,
  pathname,
  item,
  depth = 0
}) {
  const key = item.title + depth;

  if (item.items) {
    const open = matchPath(pathname, {
      path: item.href,
      exact: false
    });

    acc.push(
      <NavItem
        depth={depth}
        icon={item.icon}
        key={key}
        info={item.info}
        open={Boolean(open)}
        title={item.title}
      >
        {renderNavItems({
          depth: depth + 1,
          pathname,
          items: item.items
        })}
      </NavItem>
    );
  } else {
    acc.push(
      <NavItem
        depth={depth}
        href={item.href}
        icon={item.icon}
        key={key}
        info={item.info}
        title={item.title}
      />
    );
  }

  return acc;
}

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

function NavBar({ openMobile, onMobileClose, }) {
  const classes = useStyles();
  const location = useLocation();
  const { user } = useSelector((state) => state.account);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <PerfectScrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box
            p={2}
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/">
              <Logo />
            </RouterLink>
          </Box>
        </Hidden>
        {/* <Box p={2}>
          <Box
            display="flex"
            justifyContent="center"
          >
            <RouterLink to="/app/account">
              <Avatar
                alt="User"
                className={classes.avatar}
                src={user.avatar}
              />
            </RouterLink>
          </Box>
          <Box
            mt={2}
            textAlign="center"
          >
            <Link
              component={RouterLink}
              to="/app/account"
              variant="h5"
              color="textPrimary"
              underline="none"
            >
              {`${user.firstName} ${user.lastName}`}
            </Link>
            <Typography
              variant="body2"
              color="textSecondary"
            >
              {user.bio}
            </Typography>
          </Box>
        </Box> */}
        <Divider />
        <Box p={2}>
          {navConfig.map((config) => (
            <List
              key={config.subheader}
              subheader={(
                <ListSubheader
                  disableGutters
                  disableSticky
                >
                  {config.subheader}
                </ListSubheader>
              )}
            >
              {renderNavItems({ items: config.items, pathname: location.pathname })}
            </List>
          ))}
        </Box>
        <Divider />
        {user.role && user.isReportsAccess
          ? (
            <>
              <Box p={2}>
                {navConfigReports.map((config) => (
                  <List
                    key={config.subheader}
                    subheader={(
                      <ListSubheader
                        disableGutters
                        disableSticky
                      >
                        {config.subheader}
                      </ListSubheader>
                    )}
                  >
                    {renderNavItems({ items: config.items, pathname: location.pathname })}
                  </List>
                ))}
              </Box>
              <Divider />
            </>
          ) : (<></>)}
        <Divider />
        {user.role && user.role === 'admin'
          ? (
            <>
              <Box p={2}>
                {navConfigAdmin.map((config) => (
                  <List
                    key={config.subheader}
                    subheader={(
                      <ListSubheader
                        disableGutters
                        disableSticky
                      >
                        {config.subheader}
                      </ListSubheader>
                    )}
                  >
                    {renderNavItems({ items: config.items, pathname: location.pathname })}
                  </List>
                ))}
              </Box>
              <Divider />
            </>
          ) : (<></>)}
      </PerfectScrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
}

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

export default NavBar;
