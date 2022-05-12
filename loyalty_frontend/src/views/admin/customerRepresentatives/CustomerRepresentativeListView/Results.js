/* eslint-disable max-len */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useDispatch } from 'react-redux';
import ReactLoading from 'react-loading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSnackbar } from 'notistack';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Dialog,
  Divider,
  IconButton,
  InputAdornment,
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
  // PlusCircle as PlusCircleIcon,
  Edit as EditIcon,
  // ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import { API_BASE_URL } from 'src/config';
import { SET_CUSTOMER_REPRESENTATIVES } from 'src/actions/customerRepresentativeActions';
// import wait from 'src/utils/wait';

const sortOptions = [
  {
    value: '1',
    label: 'Alphabetical A-Z'
  },
  {
    value: '2',
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
  action: {
    marginBottom: theme.spacing(1),
    '& + &': {
      marginLeft: theme.spacing(1)
    },
    marginTop: '15px',
    marginRight: '15px',
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
  contactLabel: {
    fontWeight: 500,
    fontStyle: 'italic',
  },
  zIndex0: {
    zIndex: 0,
  },
}));

let source;

const Results = forwardRef(({
  className,
  customer = null,
  oldCustomerRepresentatives = [],
  oldTotalCount = 0,
  setModalEditIsOpenToTrue,
  ...rest
}, ref) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [viewConfirmBulkDelete, setViewConfirmBulkDelete] = useState(false);
  const [selectedCustomerRepresentatives, setSelectedCustomerRepresentatives] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(sortOptions[0].value);
  const { enqueueSnackbar } = useSnackbar();
  const [customerRepresentatives, setCustomerRepresentatives] = useState(oldCustomerRepresentatives);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getCustomerRepresentatives = async () => {
    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    const data = {
      page: page || 0,
      limit: limit || 10,
      status: sort,
      searchText,
    };

    axios.post(`${API_BASE_URL}/admin/customer-representative/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set customerRepresentative data
          setCustomerRepresentatives(response.data.customerRepresentatives);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_CUSTOMER_REPRESENTATIVES,
            payload: {
              customerRepresentatives: response.data.customerRepresentatives,
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
    if (customer === null) {
      if (customerRepresentatives.length < 1) {
        setLoading(true);
        getCustomerRepresentatives();
      }
    }
  }, []);

  useEffect(() => {
    if (customer === null) {
      if (customerRepresentatives.length < 1) {
        setLoading(true);
        getCustomerRepresentatives();
      } else {
        setLoadingSecond(true);
        getCustomerRepresentatives();
      }
    }
  }, [limit, searchText, sort, page]);

  useImperativeHandle(ref, () => ({
    updateList() {
      getCustomerRepresentatives();
    }
  }));

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

  const handleSelectAllCustomerRepresentatives = (event) => {
    setSelectedCustomerRepresentatives(event.target.checked
      ? customerRepresentatives.map((customerRepresentative) => customerRepresentative.id)
      : []);
  };

  const handleSelectOneCustomerRepresentative = (event, customerRepresentativeId) => {
    if (!selectedCustomerRepresentatives.includes(customerRepresentativeId)) {
      setSelectedCustomerRepresentatives((prevSelected) => [...prevSelected, customerRepresentativeId]);
    } else {
      setSelectedCustomerRepresentatives((prevSelected) => prevSelected.filter((id) => id !== customerRepresentativeId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('CustomerRepresentatives deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete CustomerRepresentatives.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedCustomerRepresentatives([]);
    if (customer === null) {
      getCustomerRepresentatives();
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
    asyncForEach(selectedCustomerRepresentatives, async (selectedCustomerRepresentative) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/customer-representative/${selectedCustomerRepresentative}`);
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

  const handleEdit = async (customerRepresentativeId) => {
    setModalEditIsOpenToTrue(customerRepresentativeId);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedCustomerRepresentatives.length > 0;
  const selectedSomeCustomerRepresentatives = selectedCustomerRepresentatives.length > 0 && selectedCustomerRepresentatives.length < customerRepresentatives.length;
  const selectedAllCustomerRepresentatives = selectedCustomerRepresentatives.length === customerRepresentatives.length;

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
            placeholder="Search Customer Representatives"
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
            className={classes.zIndex0}
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
                checked={selectedAllCustomerRepresentatives}
                indeterminate={selectedSomeCustomerRepresentatives}
                onChange={handleSelectAllCustomerRepresentatives}
              />
              <Button
                variant="outlined"
                className={classes.bulkAction}
                onClick={handleDelete}
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
                      checked={selectedAllCustomerRepresentatives}
                      indeterminate={selectedSomeCustomerRepresentatives}
                      onChange={handleSelectAllCustomerRepresentatives}
                    />
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Contact
                  </TableCell>
                  <TableCell>
                    Address
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
                        There are no CustomerRepresentatives.
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
                      Loading CustomerRepresentatives...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {customerRepresentatives.map((customerRepresentative) => {
                  const isCustomerRepresentativeSelected = selectedCustomerRepresentatives.includes(customerRepresentative.id);
                  return (
                    <TableRow
                      hover
                      key={customerRepresentative.id}
                      selected={isCustomerRepresentativeSelected}
                      className={classes.tableRowTag}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isCustomerRepresentativeSelected}
                          onChange={(event) => handleSelectOneCustomerRepresentative(event, customerRepresentative.id)}
                          value={isCustomerRepresentativeSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          {customerRepresentative.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className={classes.contactLabel}>Email:</span>
                          {' '}
                          {customerRepresentative.email}
                          <br />
                          <span className={classes.contactLabel}>Phone:</span>
                          {' '}
                          {customerRepresentative.phone}
                          <br />
                        </div>
                      </TableCell>
                      <TableCell>
                        {customerRepresentative.fullAddr}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(customerRepresentative.id)}
                        >
                          <SvgIcon fontSize="small">
                            <EditIcon />
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
});

Results.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object,
  oldCustomerRepresentatives: PropTypes.array,
  oldTotalCount: PropTypes.number,
  setModalEditIsOpenToTrue: PropTypes.func,
};

Results.defaultProps = {
};

export default Results;
