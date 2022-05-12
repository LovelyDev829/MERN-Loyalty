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
import { SET_VENDORS } from 'src/actions/vendorActions';
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
  oldVendors = [],
  oldTotalCount = 0,
  setModalEditIsOpenToTrue,
  ...rest
}, ref) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [viewConfirmBulkDelete, setViewConfirmBulkDelete] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(sortOptions[0].value);
  const { enqueueSnackbar } = useSnackbar();
  const [vendors, setVendors] = useState(oldVendors);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getVendors = async () => {
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

    axios.post(`${API_BASE_URL}/admin/vendor/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set vendor data
          setVendors(response.data.vendors);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_VENDORS,
            payload: {
              vendors: response.data.vendors,
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
      if (vendors.length < 1) {
        setLoading(true);
        getVendors();
      }
    }
  }, []);

  useEffect(() => {
    if (customer === null) {
      if (vendors.length < 1) {
        setLoading(true);
        getVendors();
      } else {
        setLoadingSecond(true);
        getVendors();
      }
    }
  }, [limit, searchText, sort, page]);

  useImperativeHandle(ref, () => ({
    updateList() {
      getVendors();
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

  const handleSelectAllVendors = (event) => {
    setSelectedVendors(event.target.checked
      ? vendors.map((vendor) => vendor.id)
      : []);
  };

  const handleSelectOneVendor = (event, vendorId) => {
    if (!selectedVendors.includes(vendorId)) {
      setSelectedVendors((prevSelected) => [...prevSelected, vendorId]);
    } else {
      setSelectedVendors((prevSelected) => prevSelected.filter((id) => id !== vendorId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Vendors deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete Vendors.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedVendors([]);
    if (customer === null) {
      getVendors();
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

  const handleDelete = async () => {
    setViewConfirmBulkDelete(true);
  };
  const processConfirmBulkDelete = async () => {
    asyncForEach(selectedVendors, async (selectedVendor) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/vendor/${selectedVendor}`);
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

  const handleEdit = async (vendorId) => {
    setModalEditIsOpenToTrue(vendorId);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedVendors.length > 0;
  const selectedSomeVendors = selectedVendors.length > 0 && selectedVendors.length < vendors.length;
  const selectedAllVendors = selectedVendors.length === vendors.length;

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
            placeholder="Search vendors"
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
                checked={selectedAllVendors}
                indeterminate={selectedSomeVendors}
                onChange={handleSelectAllVendors}
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
                      checked={selectedAllVendors}
                      indeterminate={selectedSomeVendors}
                      onChange={handleSelectAllVendors}
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
                        There are no Vendors.
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
                      Loading Vendors...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {vendors.map((vendor) => {
                  const isVendorSelected = selectedVendors.includes(vendor.id);
                  return (
                    <TableRow
                      hover
                      key={vendor.id}
                      selected={isVendorSelected}
                      className={classes.tableRowTag}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isVendorSelected}
                          onChange={(event) => handleSelectOneVendor(event, vendor.id)}
                          value={isVendorSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          {vendor.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <span className={classes.contactLabel}>Email:</span>
                          {' '}
                          {vendor.email}
                          <br />
                          <span className={classes.contactLabel}>Phone:</span>
                          {' '}
                          {vendor.phone}
                          <br />
                          <span className={classes.contactLabel}>Fax:</span>
                          {' '}
                          {vendor.fax}
                        </div>
                      </TableCell>
                      <TableCell>
                        {vendor.fullAddr}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(vendor.id)}
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
  oldVendors: PropTypes.array,
  oldTotalCount: PropTypes.number,
  setModalEditIsOpenToTrue: PropTypes.func,
};

Results.defaultProps = {
};

export default Results;
