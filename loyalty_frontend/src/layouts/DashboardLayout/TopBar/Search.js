/* eslint-disable max-len */
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import {
  Box,
  // Button,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Link,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import axiosOrigin from 'axios';
import { API_BASE_URL } from 'src/config';
import {
  Search as SearchIcon,
  XCircle as XIcon,
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
import { convertToPlain } from 'src/utils/helper';

const useStyles = makeStyles(() => ({
  root: {},
  drawer: {
    width: '100%',
    maxWidth: '100%',
    height: 'calc(100vh - 64px)',
    marginTop: '64px',
  },
  textOne: {
    fontSize: '16px',
    fontWeight: '500',
  },
  textTwo: {
    fontSize: '17px',
    fontWeight: '400',
  },
  textThree: {
    fontSize: '14px',
    fontWeight: '400',
  },
  searchItem: {
    marginLeft: '19px',
  },
  searchItemLink: {
    display: 'flex',
  },
  searchItemLinkIcon: {
    marginRight: '8px',
  },
  searchItemSeeAllLink: {
    color: 'blue',
    fontSize: '16px',
    fontWeight: '400',
    marginLeft: '19px',
  }
}));
let source;
function Search() {
  const classes = useStyles();
  const [value, setValue] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async (searchValue) => {
    if (searchValue.trim().length < 1) {
      return;
    }
    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    try {
      setLoading(true);

      const response = await axios.get(
        `${API_BASE_URL}/shipment/global-search/${searchValue}`,
        {},
        { cancelToken: source.token }
      );
      if (response.data.status) {
        setResults(response.data);
      }
    } catch (error) {
      source = null;
      enqueueSnackbar('Something went wrong', {
        variant: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (event) => {
    event.persist();
    setValue(event.target.value);
    handleSearch(event.target.value);
  };

  return (
    <div
      classes={{ paper: classes.root }}
    >
      <Tooltip
        title="Search"
        classes={{ paper: classes.tooltip }}
      >
        <IconButton
          color="inherit"
          onClick={handleOpen}
        >
          <SvgIcon fontSize="small">
            <SearchIcon />
          </SvgIcon>
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
        classes={{ paper: classes.drawer }}
        ModalProps={{ BackdropProps: { invisible: true } }}
        onClose={handleClose}
        open={isOpen}
        variant="temporary"
      >
        <PerfectScrollbar options={{ suppressScrollX: true }}>
          <Box p={3}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="h4"
                color="textPrimary"
              >
                Search
              </Typography>
              <IconButton onClick={handleClose}>
                <SvgIcon fontSize="small">
                  <XIcon />
                </SvgIcon>
              </IconButton>
            </Box>
            <Box mt={2}>
              <TextField
                className={classes.queryField}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon
                        fontSize="small"
                        color="action"
                      >
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                onChange={(event) => handleQueryChange(event)}
                placeholder="Begin typing search query here..."
                value={value}
                variant="outlined"
              />
            </Box>
            {/* <Box
              mt={2}
              display="flex"
              justifyContent="flex-end"
            >
              <Button
                color="secondary"
                variant="contained"
                onClick={handleSearch}
              >
                Search
              </Button>
            </Box> */}
            <Box mt={4}>
              {isLoading ? (
                <Box
                  display="flex"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Box mb={2}>
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      className={classes.textOne}
                    >
                      Searching for &quot;
                      {value}
                      &quot;
                    </Typography>
                  </Box>
                  {/* Customer */}
                  {results && results.customers && !results.shipments.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.customers.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.customers && results.customers.data.map((customer) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/management/customers/${customer.id}`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <UsersIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {customer.company}
                          {', '}
                          {customer.firstName}
                          {', '}
                          {customer.lastName}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.customers && results.customers.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/management/customers"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Shipment */}
                  {results && results.shipments && !results.shipments.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.shipments.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.shipments && results.shipments.data.map((shipment) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/management/shipments/${shipment.id}/1`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {shipment.title}
                          {', '}
                          {convertToPlain(shipment.customerNote)}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.shipments && results.shipments.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/management/shipments"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Service */}
                  {results && results.services && !results.services.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.services.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.services && results.services.data.map((shipment) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/management/shipments/${shipment.id}/2`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {shipment.title}
                          {', '}
                          {convertToPlain(shipment.customerNote)}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.services && results.services.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/management/services"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Inventory */}
                  {results && results.inventories && !results.inventories.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.inventories.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.inventories && results.inventories.data.map((inventory) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/management/inventories/${inventory.id}`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {inventory.lglNumber}
                          {', '}
                          {inventory.itemNumber}
                          {', '}
                          {inventory.pieces}
                          {', '}
                          {inventory.type}
                          {', '}
                          {inventory.description}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.inventories && results.inventories.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/management/inventories"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* User */}
                  {results && results.users && !results.users.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.users.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.users && results.users.data.map((user) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/admin/users/${user.id}`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {user.firstName}
                          {', '}
                          {user.lastName}
                          {', '}
                          {user.email}
                          {', '}
                          {user.phone}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.users && results.users.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/users"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Service Package */}
                  {results && results.servicePackages && !results.servicePackages.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.servicePackages.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.servicePackages && results.servicePackages.data.map((servicePackage) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/service-packages"
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {servicePackage.description}
                          {', '}
                          {servicePackage.unitPrice}
                          {', '}
                          {convertToPlain(servicePackage.note)}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.servicePackages && results.servicePackages.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/service-packages"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Warehouse */}
                  {results && results.warehouses && !results.warehouses.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.warehouses.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.warehouses && results.warehouses.data.map((warehouse) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to={`/app/admin/warehouses/${warehouse.id}`}
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {warehouse.name}
                          {', '}
                          {warehouse.contactName}
                          {', '}
                          {warehouse.contactEmail}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.warehouses && results.warehouses.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/warehouses"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Vendor */}
                  {results && results.vendors && !results.vendors.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.vendors.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.vendors && results.vendors.data.map((vendor) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/vendors"
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {vendor.name}
                          {', '}
                          {vendor.email}
                          {', '}
                          {vendor.fullAddr}
                        </Typography>
                      </Link>

                    </Box>
                  ))}
                  {results && results.vendors && results.vendors.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/vendors"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Driver */}
                  {results && results.drivers && !results.drivers.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.drivers.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.drivers && results.drivers.data.map((driver) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/drivers"
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {driver.name}
                          {', '}
                          {driver.phone}
                        </Typography>
                      </Link>
                    </Box>
                  ))}
                  {results && results.drivers && results.drivers.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/drivers"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}

                  {/* Customer Representative */}
                  {results && results.customerRepresentatives && !results.customerRepresentatives.isEmpty && (
                    <Box mb={2}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        className={classes.textTwo}
                      >
                        {results.customerRepresentatives.title}
                      </Typography>
                    </Box>
                  )}
                  {results && results.customerRepresentatives && results.customerRepresentatives.data.map((customerRepresentative) => (
                    <Box
                      mb={2}
                      className={classes.searchItem}
                    >
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/customer-representatives"
                        className={classes.searchItemLink}
                        target="_blank"
                      >
                        <SvgIcon fontSize="small" className={classes.searchItemLinkIcon}>
                          <TruckIcon />
                        </SvgIcon>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                        >
                          {customerRepresentative.name}
                          {', '}
                          {customerRepresentative.email}
                          {', '}
                          {customerRepresentative.fullAddr}
                        </Typography>
                      </Link>
                    </Box>
                  ))}
                  {results && results.customerRepresentatives && results.customerRepresentatives.isShowSeeAll && (
                    <Box mb={2}>
                      <Link
                        variant="h4"
                        color="textPrimary"
                        component={RouterLink}
                        to="/app/admin/customer-representatives"
                        className={classes.searchItemSeeAllLink}
                        target="_blank"
                      >
                        See all
                      </Link>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        </PerfectScrollbar>
      </Drawer>
    </div>
  );
}

Search.propTypes = {
};

export default Search;
