/* eslint-disable radix */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import ReactLoading from 'react-loading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import axiosOrigin from 'axios';
import {
  CheckSquare as CheckSquareIcon,
  // Edit as EditIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';
import { SET_CUSTOMERS } from 'src/actions/customerActions';
import { API_BASE_URL } from 'src/config';

/**
   * 1. Active
   * 2. Total Shipment
   * 3. Alphabetical A-Z
*/

const sortOptions = [
  {
    value: 1,
    label: 'Alphabetical A-Z'
  },
  {
    value: 2,
    label: 'Active'
  },
  {
    value: 3,
    label: 'Total Shipment'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {},
  queryField: {
    width: 500
  },
  bulkOperations: {
    position: 'relative'
  },
  bulkActions: {
    paddingLeft: 4,
    paddingRight: 4,
    marginTop: 6,
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    backgroundColor: theme.palette.background.default
  },
  bulkAction: {
    marginLeft: theme.spacing(2)
  },
  avatar: {
    height: 42,
    width: 42,
    marginRight: theme.spacing(1)
  },
  loadingPopup: {
    position: 'absolute',
    left: '50%',
    top: '30%',
    background: '#555555',
    color: '#fff',
    borderRadius: '5px',
    padding: '10px',
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
  },
  tableWrapper: {
    minHeight: '50vh',
  },
  noDataIconWrapper: {
    textAlign: 'center',
    marginTop: '80px',
    display: 'flex',
    justifyContent: 'center',
  },
  noDataIconWrapperSecond: {
    width: '86px',
    padding: '27px',
    borderRadius: '46px',
    backgroundColor: '#ececef',
  },
  noDataTextWrapper: {
    textAlign: 'center',
    marginTop: '20px',
  },
  noDataText: {
    fontSize: '17px',
  },
}));
let source;

function Results({
  className, oldCustomers, oldTotalCount, ...rest
}) {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const [viewConfirmBulkDelete, setViewConfirmBulkDelete] = useState(false);
  const [customers, setCustomers] = useState(oldCustomers);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  // const [customers, setCustomers] = useState([]);
  // const [totalCount, setTotalCount] = useState(0);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getCustomers = async () => {
    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    const data = {
      page: page || 0,
      limit: limit || 50,
      sort: sort || 1,
      isActive: sort === 2,
      searchText,
    };
    axios.post(`${API_BASE_URL}/customer/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set customer data
          setCustomers(response.data.customers);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_CUSTOMERS,
            payload: {
              customers: response.data.customers,
              totalCount: response.data.totalCount,
            }
          });
        }
      })
      .catch(() => {
        source = null;
        // setLoading(false);
        // setLoadingSecond(false);
      });
  };

  useEffect(() => {
    if (customers.length < 1) {
      setLoading(true);
      getCustomers();
    }
  }, []);

  useEffect(() => {
    if (customers.length < 1) {
      setLoading(true);
      getCustomers();
    } else {
      setLoadingSecond(true);
      getCustomers();
    }
  }, [limit, searchText, sort, page]);

  if (!customers) {
    return null;
  }

  const handleQueryChange = (event) => {
    event.persist();
    setSearchText(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    const newSort = parseInt(event.target.value);
    setSort(newSort);
  };

  const handlePageChange = (event, newPage) => {
    event.persist();
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    event.persist();
    setLimit(event.target.value);
    setPage(0);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(event.target.checked
      ? customers.map((customer) => customer.id)
      : []);
  };

  const handleSelectOneCustomer = (event, customerId) => {
    if (!selectedCustomers.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) => prevSelected.filter((id) => id !== customerId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Customers deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete Customers.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedCustomers([]);
    getCustomers();
  };

  // confirm delete
  const onConfirmBulkDelteNo = () => {
    setViewConfirmBulkDelete(false);
  };

  async function asyncForEach(array, callback) {
    if (array.length < 1) {
      return;
    }

    const arrToCheckExecuted = [];
    for (let index = 0; index < array.length; index++) {
      callback(array[index], index, array).then((success) => {
        if (success) {
          arrToCheckExecuted.push(1);
        } else {
          arrToCheckExecuted.push(0);
        }

        if (arrToCheckExecuted.length >= array.length) {
          const rtn = arrToCheckExecuted.every((currentValue) => currentValue === 1);
          processAfterDeleteDone(rtn);
        }
      });
    }
  }

  const handleDelete = async () => {
    setViewConfirmBulkDelete(true);
  };
  const processConfirmBulkDelete = async () => {
    asyncForEach(selectedCustomers, async (selectedCustomer) => {
      const response = await axios.delete(`${API_BASE_URL}/customer/${selectedCustomer}`);
      if (!response.data.status) {
        return false;
      }
      return true;
    });
  };
  const onConfirmBulkDeleteYes = () => {
    setViewConfirmBulkDelete(false);
    processConfirmBulkDelete();
  };

  const handleEdit = async () => {
    history.push(`/app/management/customers/${selectedCustomers[0]}/edit`);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedCustomers.length > 0;
  const selectedSomeCustomers = selectedCustomers.length > 0 && selectedCustomers.length < customers.length;
  const selectedAllCustomers = selectedCustomers.length === customers.length;

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Box
          p={2}
          minHeight={56}
          display="flex"
          alignItems="center"
        >
          <TextField
            className={classes.queryField}
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
            onChange={handleQueryChange}
            placeholder="Search customers"
            value={searchText}
            variant="outlined"
          />
          <Box flexGrow={1} />
          <TextField
            label="Sort By"
            name="sort"
            onChange={handleSortChange}
            select
            SelectProps={{ native: true }}
            value={sort}
            variant="outlined"
          >
            {sortOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </TextField>
        </Box>
        {enableBulkOperations && (
          <div className={classes.bulkOperations}>
            <div className={classes.bulkActions}>
              <Checkbox
                checked={selectedAllCustomers}
                indeterminate={selectedSomeCustomers}
                onChange={handleSelectAllCustomers}
              />
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={handleDelete}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
          </div>
        )}
        <PerfectScrollbar>
          <Box
            minWidth={700}
            className={classes.tableWrapper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAllCustomers}
                      indeterminate={selectedSomeCustomers}
                      onChange={handleSelectAllCustomers}
                    />
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Address
                  </TableCell>
                  <TableCell>
                    Company
                  </TableCell>
                  <TableCell>
                    Total Shipments
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              {isNoData ? (
                <Box
                  position="absolute"
                  left="44%"
                  display="flex"
                  justifyContent="center"
                >
                  <Box>
                    <Box className={classes.noDataIconWrapper}>
                      <Box className={classes.noDataIconWrapperSecond}>
                        <CheckSquareIcon className={classes.noDataIcon} />
                      </Box>
                    </Box>
                    <Box className={classes.noDataTextWrapper}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        className={classes.noDataText}
                      >
                        There are no customers in your account.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (<></>)}
              {isLoading ? (
                <Box
                  position="absolute"
                  left="44%"
                  display="flex"
                  justifyContent="center"
                >
                  <Box>
                    <ReactLoading type="bubbles" color="rgba(88,80,236,1)" height="100px" width="120px" />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                    >
                      Loading customers...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {customers.map((customer) => {
                  const isCustomerSelected = selectedCustomers.includes(customer.id);

                  return (
                    <TableRow
                      hover
                      key={customer.id}
                      selected={isCustomerSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isCustomerSelected}
                          onChange={(event) => handleSelectOneCustomer(event, customer.id)}
                          value={isCustomerSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            className={classes.avatar}
                            src={customer.avatar}
                          >
                            {getInitials(`${customer.firstName} ${customer.lastName}`)}
                          </Avatar>
                          <div>
                            <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/app/management/customers/${customer.id}`}
                                variant="h6"
                              >
                                {customer.firstName}
                                {' '}
                                {customer.lastName}
                              </Link>
                            <Typography
                                variant="body2"
                                color="textSecondary"
                              >
                                <Link
                                  color="inherit"
                                  component={RouterLink}
                                  to={`/app/management/customers/${customer.id}`}
                                  variant="h6"
                                >
                                  {customer.email}
                                </Link>
                              </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {customer.fullAddr}
                      </TableCell>
                      <TableCell>
                        {customer.company}
                      </TableCell>
                      <TableCell>
                        {customer.totalShipments}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/app/management/customers/${customer.id}`}
                        >
                          <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                          </SvgIcon>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        <TablePagination
          component="div"
          count={totalCount}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
        {isLoadingSecond ? (
          <Box
            className={classes.loadingPopup}
          >
            LOADING
          </Box>
        ) : (<></>)}
      </Card>
      <Dialog open={viewConfirmBulkDelete}>
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
            Would you like to delete selected records?
          </Typography>
        </Box>
        <Divider />
        <Box
          p={2}
          display="flex"
          alignItems="center"
        >
          <Box flexGrow={1} />
          <Button onClick={onConfirmBulkDelteNo}>
            No
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className={classes.confirmButton}
            onClick={onConfirmBulkDeleteYes}
          >
            Yes
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

Results.propTypes = {
  className: PropTypes.string,
  oldCustomers: PropTypes.array,
  oldTotalCount: PropTypes.number
};

export default Results;
