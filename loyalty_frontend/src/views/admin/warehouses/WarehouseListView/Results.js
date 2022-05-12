/* eslint-disable radix */
/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import ReactLoading from 'react-loading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Label from 'src/components/Label';
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
import { SET_WAREHOUSES } from 'src/actions/warehouseActions';
import { API_BASE_URL } from 'src/config';

/**
   * 1. Alphabetical A-Z
   * 2. Default Warehouse
   * 3. Admin
   * 4. Active
*/

const sortOptions = [
  {
    value: 1,
    label: 'Alphabetical A-Z'
  },
  {
    value: 2,
    label: 'Alphabetical Z-A'
  },
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
  confirmPopupHeader: {
    minWidth: '500px',
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
  className, oldWarehouses, oldTotalCount, ...rest
}) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [warehouses, setWarehouses] = useState(oldWarehouses);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  // const [warehouses, setWarehouses] = useState([]);
  // const [totalCount, setTotalCount] = useState(0);
  const [selectedWarehouses, setSelectedWarehouses] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(50);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [viewConfirm, setViewConfirm] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getWarehouses = async () => {
    const data = {
      page: page || 0,
      limit: limit || 50,
      sort: sort || 1,
      searchText,
    };

    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    axios.post(`${API_BASE_URL}/admin/warehouse/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set warehouse data
          setWarehouses(response.data.warehouses);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_WAREHOUSES,
            payload: {
              warehouses: response.data.warehouses,
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
    if (warehouses.length < 1) {
      setLoading(true);
      getWarehouses();
    }
  }, []);

  useEffect(() => {
    if (warehouses.length < 1) {
      setLoading(true);
      getWarehouses();
    } else {
      setLoadingSecond(true);
      getWarehouses();
    }
  }, [limit, sort, page, searchText]);

  if (!warehouses) {
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

  const handleSelectAllWarehouses = (event) => {
    setSelectedWarehouses(event.target.checked
      ? warehouses.map((warehouse) => warehouse.id)
      : []);
  };

  const handleSelectOneWarehouse = (event, warehouseId) => {
    if (!selectedWarehouses.includes(warehouseId)) {
      setSelectedWarehouses((prevSelected) => [...prevSelected, warehouseId]);
    } else {
      setSelectedWarehouses((prevSelected) => prevSelected.filter((id) => id !== warehouseId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Warehouses deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete all the selected Warehouses.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedWarehouses([]);
    getWarehouses();
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
    asyncForEach(selectedWarehouses, async (selectedWarehouse) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/warehouse/${selectedWarehouse}`);
      if (!response.data.status) {
        return false;
      }
      return true;
    });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedWarehouses.length > 0;
  const selectedSomeWarehouses = selectedWarehouses.length > 0 && selectedWarehouses.length < warehouses.length;
  const selectedAllWarehouses = selectedWarehouses.length === warehouses.length;

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
            placeholder="Search warehouses"
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
                checked={selectedAllWarehouses}
                indeterminate={selectedSomeWarehouses}
                onChange={handleSelectAllWarehouses}
              />
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={() => setViewConfirm(true)}
              >
                Delete
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
                      checked={selectedAllWarehouses}
                      indeterminate={selectedSomeWarehouses}
                      onChange={handleSelectAllWarehouses}
                    />
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Address
                  </TableCell>
                  <TableCell>
                    Contact Name
                  </TableCell>
                  <TableCell>
                    Contact Phone
                  </TableCell>
                  <TableCell>
                    Default
                  </TableCell>
                  <TableCell align="right">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
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
                      Loading warehouses...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
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
                        There are no warehouses.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {warehouses.map((warehouse) => {
                  const isWarehouseSelected = selectedWarehouses.includes(warehouse.id);

                  return (
                    <TableRow
                      hover
                      key={warehouse.id}
                      selected={isWarehouseSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isWarehouseSelected}
                          onChange={(event) => handleSelectOneWarehouse(event, warehouse.id)}
                          value={isWarehouseSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Link
                          color="inherit"
                          component={RouterLink}
                          to={`/app/admin/warehouses/${warehouse.id}`}
                          variant="h6"
                        >
                          {warehouse.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {warehouse.fullAddr}
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            className={classes.avatar}
                            src={warehouse.avatar}
                          >
                            {getInitials(`${warehouse.contactName}`)}
                          </Avatar>
                          <div>
                            {warehouse.contactName}
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              {warehouse.contactEmail}
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {warehouse.contactPhone}
                      </TableCell>
                      <TableCell>
                        {warehouse.isDefault && (
                          <Label color="success">
                            Default
                          </Label>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/app/admin/warehouses/${warehouse.id}`}
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
            Would you like to delete selected warehouses?
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

Results.propTypes = {
  className: PropTypes.string,
  oldWarehouses: PropTypes.array,
  oldTotalCount: PropTypes.number
};

export default Results;
