/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { useHistory } from 'react-router';
import ReactLoading from 'react-loading';
import clsx from 'clsx';
import moment from 'moment';
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
  Grid,
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
  PlusCircle as PlusCircleIcon,
  ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';
import { API_BASE_URL } from 'src/config';
import { SET_SHIPMENTS, SET_SHIPMENTS_BY_CUSTOMER_ID } from 'src/actions/shipmentActions';
import { typeOptions } from './Header';
// import wait from 'src/utils/wait';

const sortOptions = [
  {
    value: '1',
    label: 'New'
  },
  {
    value: '2',
    label: 'In Progress'
  },
  {
    value: '3',
    label: 'Delivered'
  },
  {
    value: '4',
    label: 'Cancelled'
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
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    },
    marginTop: '23px',
    marginRight: '15px',
    height: '40px',
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
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
  tableRowTag: {
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
  confirmPopupHeader: {
    minWidth: '500px',
  },
  typeSelect: {
    margin: '15px 10px 10px 0px',
  },
}));

let source;

const Results = forwardRef(({
  className,
  customer = null,
  oldShipments = [],
  oldTotalCount = 0,
  setModalCreateIsOpenToTrue,
  setTypeFromButton,
  setModalEditIsOpenToTrue,
  handleTypeChangeParent,
  ...rest
}, ref) => {
  const classes = useStyles();
  const history = useHistory();
  const isMountedRef = useIsMountedRef();
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(sortOptions[0].value);
  const { enqueueSnackbar } = useSnackbar();
  const [shipments, setShipments] = useState(oldShipments);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();
  const [type, setType] = useState(typeOptions[0].value);

  const handleTypeChange = (event) => {
    event.persist();
    setType(event.target.value);
    handleTypeChangeParent(event.target.value);
  };

  const getShipments = async () => {
    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    const data = {
      page: page || 0,
      limit: limit || 10,
      customer_id: (customer === null) ? '' : customer.id,
      status: sort,
      searchText,
      type,
    };

    axios.post(`${API_BASE_URL}/shipment/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set shipment data
          setShipments(response.data.shipments);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_SHIPMENTS,
            payload: {
              shipments: response.data.shipments,
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

  const getShipmentsByCustomerID = async () => {
    const data = {
      page: page || 0,
      limit: limit || 10,
      customer_id: (customer === null) ? '' : customer.id,
      status: sort,
      searchText,
      type,
    };

    axios.post(`${API_BASE_URL}/shipment/load`, data)
      .then(async (response) => {
        if (isMountedRef.current) {
          setLoading(false);
          setLoadingSecond(false);
          // set shipment data
          setShipments(response.data.shipments);
          setTotalCount(response.data.totalCount);

          dispatch({
            type: SET_SHIPMENTS_BY_CUSTOMER_ID,
            payload: {
              shipmentsByCustomerID: response.data.shipments,
              totalCountByCustomerID: response.data.totalCount,
            }
          });
        }
      });
  };

  // useImperativeHandle(ref, () => ({
  //   updateList() {
  //     getShipmentsByCustomerID();
  //   }
  // }));

  useImperativeHandle(ref, () => ({
    updateList() {
      getShipmentsByCustomerID();
    },
    updateType(newType) {
      setType(newType);
    }
  }));

  useEffect(() => {
    if (customer === null) {
      if (shipments.length < 1) {
        setLoading(true);
        getShipments();
      }
    } else if (customer !== null) {
      if (shipments.length < 1) {
        setLoadingSecond(true);
        getShipmentsByCustomerID();
      }
    }
  }, []);

  useEffect(() => {
    if (customer === null) {
      if (shipments.length < 1) {
        setLoading(true);
        getShipments();
      } else {
        setLoadingSecond(true);
        getShipments();
      }
    } else if (customer !== null) {
      if (shipments.length < 1) {
        setLoading(true);
        getShipmentsByCustomerID();
      } else {
        setLoadingSecond(true);
        getShipmentsByCustomerID();
      }
    }
  }, [limit, searchText, sort, page, type]);

  const handleQueryChange = (event) => {
    event.persist();
    setSearchText(event.target.value);
  };

  const handleSortChange = (event) => {
    event.persist();
    setSort(event.target.value);
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

  const handleSelectAllShipments = (event) => {
    setSelectedShipments(event.target.checked
      ? shipments.map((shipment) => shipment.id)
      : []);
  };

  const handleSelectOneShipment = (event, shipmentId) => {
    if (!selectedShipments.includes(shipmentId)) {
      setSelectedShipments((prevSelected) => [...prevSelected, shipmentId]);
    } else {
      setSelectedShipments((prevSelected) => prevSelected.filter((id) => id !== shipmentId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Succesfully deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedShipments([]);
    if (customer === null) {
      getShipments();
    } else {
      getShipmentsByCustomerID();
    }
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
    asyncForEach(selectedShipments, async (selectedShipment) => {
      const response = await axios.delete(`${API_BASE_URL}/shipment/${selectedShipment}`);
      if (!response.data.status) {
        return false;
      }
      return true;
    });
  };

  const handleEdit = async () => {
    history.push(`/app/management/shipments/${selectedShipments[0]}/edit/${type}`);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedShipments.length > 0;
  const selectedSomeShipments = selectedShipments.length > 0 && selectedShipments.length < shipments.length;
  const selectedAllShipments = selectedShipments.length === shipments.length;

  // Confirm delete
  const [viewConfirm, setViewConfirm] = useState(false);

  const onConfirmYes = () => {
    setViewConfirm(false);
    handleDelete();
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
        <Grid
          container
        >
          <Grid
            item
            xs={12}
            md={12}
            className={classes.buttonWrapper}
          >
            {(customer !== null) && (
              <>
                <TextField
                  label="type"
                  name="type"
                  onChange={handleTypeChange}
                  select
                  SelectProps={{ native: true }}
                  value={type}
                  variant="outlined"
                  className={classes.typeSelect}
                >
                  {typeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </TextField>
                {type !== '0' && (
                <Button
                  color="secondary"
                  variant="contained"
                  className={classes.action}
                  onClick={() => {
                    setTypeFromButton(type);
                    setModalCreateIsOpenToTrue();
                  }}
                >
                  <SvgIcon
                    fontSize="small"
                    className={classes.actionIcon}
                  >
                    <PlusCircleIcon />
                  </SvgIcon>
                  {type === '1' ? 'New Shipment' : 'New Service'}
                </Button>
                )}
                {type === '0' && (
                <>
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    onClick={() => {
                      setTypeFromButton('1');
                      setModalCreateIsOpenToTrue();
                    }}
                  >
                    <SvgIcon
                      fontSize="small"
                      className={classes.actionIcon}
                    >
                      <PlusCircleIcon />
                    </SvgIcon>
                    New Shipment
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    className={classes.action}
                    onClick={() => {
                      setTypeFromButton('2');
                      setModalCreateIsOpenToTrue();
                    }}
                  >
                    <SvgIcon
                      fontSize="small"
                      className={classes.actionIcon}
                    >
                      <PlusCircleIcon />
                    </SvgIcon>
                    New Service
                  </Button>
                </>
                )}
              </>
            )}
          </Grid>
        </Grid>
        <Divider />
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
            placeholder={type === '1' ? 'Search shipments' : 'Search services'}
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
                checked={selectedAllShipments}
                indeterminate={selectedSomeShipments}
                onChange={handleSelectAllShipments}
              />
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={() => setViewConfirm(true)}
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
                      checked={selectedAllShipments}
                      indeterminate={selectedSomeShipments}
                      onChange={handleSelectAllShipments}
                    />
                  </TableCell>
                  <TableCell>
                    { type === '0' ? 'BOL/SO ID' : (type === '1' ? 'BOL ID' : 'SO ID') }
                  </TableCell>
                  {(customer === null) && (
                  <TableCell>
                    Customer
                  </TableCell>
                  )}
                  <TableCell>
                    Origin Address
                  </TableCell>
                  <TableCell>
                    Dest Address
                  </TableCell>
                  <TableCell>
                    Pick Up Date
                  </TableCell>
                  <TableCell>
                    Delivery Date
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
                        There are no data in your account.
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
                      Loading data...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {shipments.map((shipment) => {
                  const isShipmentSelected = selectedShipments.includes(shipment.id);
                  return (
                    <TableRow
                      hover
                      key={shipment.id}
                      selected={isShipmentSelected}
                      className={classes.tableRowTag}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isShipmentSelected}
                          onChange={(event) => handleSelectOneShipment(event, shipment.id)}
                          value={isShipmentSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={`/app/management/shipments/${shipment.id}/${type}`}
                          variant="h6"
                        >
                          {shipment.title}
                        </Link>
                      </TableCell>
                      {(customer === null) && (
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            className={classes.avatar}
                            src={shipment.customer.avatar}
                          >
                            {getInitials(`${shipment.customer[0].firstName} ${shipment.customer[0].lastName}`)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/app/management/customers/${shipment.customer[0]._id}`}
                              variant="h6"
                            >
                              {shipment.customer[0].company}
                            </Link>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/app/management/customers/${shipment.customer[0]._id}`}
                                variant="h6"
                              >
                                {shipment.customer[0].firstName}
                                {' '}
                                {shipment.customer[0].lastName}
                                {', '}
                                {shipment.customer[0].email}
                              </Link>
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      )}
                      <TableCell>
                        {shipment.originFullAddr}
                      </TableCell>
                      <TableCell>
                        {shipment.destFullAddr}
                      </TableCell>
                      <TableCell>
                        {moment(shipment.dueStart).format(
                          'MM/DD/YYYY'
                        )}
                      </TableCell>
                      <TableCell>
                        {moment(shipment.dueEnd).format(
                          'MM/DD/YYYY'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/app/management/shipments/${shipment.id}/${type}`}
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
            The inventories and transaction inventories for the selected records, will be deleted. Are you sure?
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
});

Results.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object,
  oldShipments: PropTypes.array,
  oldTotalCount: PropTypes.number,
  setModalCreateIsOpenToTrue: PropTypes.func,
  setTypeFromButton: PropTypes.func,
  setModalEditIsOpenToTrue: PropTypes.func,
  handleTypeChangeParent: PropTypes.func,
};

Results.defaultProps = {
};

export default Results;
