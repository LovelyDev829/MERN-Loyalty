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
import { SET_SERVICE_PACKAGES } from 'src/actions/servicePackageActions';
// import wait from 'src/utils/wait';
import { convertToPlain } from 'src/utils/helper';

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
}));

let source;

const Results = forwardRef(({
  className,
  customer = null,
  oldServicePackages = [],
  oldTotalCount = 0,
  setModalEditIsOpenToTrue,
  ...rest
}, ref) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [viewConfirmBulkDelete, setViewConfirmBulkDelete] = useState(false);
  const [selectedServicePackages, setSelectedServicePackages] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(sortOptions[0].value);
  const { enqueueSnackbar } = useSnackbar();
  const [servicePackages, setServicePackages] = useState(oldServicePackages);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getServicePackages = async () => {
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

    axios.post(`${API_BASE_URL}/admin/service-package/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set servicePackage data
          setServicePackages(response.data.servicePackages);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_SERVICE_PACKAGES,
            payload: {
              servicePackages: response.data.servicePackages,
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
      if (servicePackages.length < 1) {
        setLoading(true);
        getServicePackages();
      }
    }
  }, []);

  useEffect(() => {
    if (customer === null) {
      if (servicePackages.length < 1) {
        setLoading(true);
        getServicePackages();
      } else {
        setLoadingSecond(true);
        getServicePackages();
      }
    }
  }, [limit, searchText, sort, page]);

  useImperativeHandle(ref, () => ({
    updateList() {
      getServicePackages();
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

  const handleSelectAllServicePackages = (event) => {
    setSelectedServicePackages(event.target.checked
      ? servicePackages.map((servicePackage) => servicePackage.id)
      : []);
  };

  const handleSelectOneServicePackage = (event, servicePackageId) => {
    if (!selectedServicePackages.includes(servicePackageId)) {
      setSelectedServicePackages((prevSelected) => [...prevSelected, servicePackageId]);
    } else {
      setSelectedServicePackages((prevSelected) => prevSelected.filter((id) => id !== servicePackageId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('ServicePackages deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete ServicePackages.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedServicePackages([]);
    if (customer === null) {
      getServicePackages();
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
    asyncForEach(selectedServicePackages, async (selectedServicePackage) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/service-package/${selectedServicePackage}`);
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

  const handleEdit = async (servicePackageId) => {
    setModalEditIsOpenToTrue(servicePackageId);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedServicePackages.length > 0;
  const selectedSomeServicePackages = selectedServicePackages.length > 0 && selectedServicePackages.length < servicePackages.length;
  const selectedAllServicePackages = selectedServicePackages.length === servicePackages.length;

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
            placeholder="Search servicePackages"
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
                checked={selectedAllServicePackages}
                indeterminate={selectedSomeServicePackages}
                onChange={handleSelectAllServicePackages}
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
                      checked={selectedAllServicePackages}
                      indeterminate={selectedSomeServicePackages}
                      onChange={handleSelectAllServicePackages}
                    />
                  </TableCell>
                  <TableCell>
                    Description
                  </TableCell>
                  <TableCell>
                    UnitPrice
                  </TableCell>
                  <TableCell>
                    Note
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
                        There are no Service Packages.
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
                      Loading Service Packages...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {servicePackages.map((servicePackage) => {
                  const isServicePackageSelected = selectedServicePackages.includes(servicePackage.id);
                  return (
                    <TableRow
                      hover
                      key={servicePackage.id}
                      selected={isServicePackageSelected}
                      className={classes.tableRowTag}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isServicePackageSelected}
                          onChange={(event) => handleSelectOneServicePackage(event, servicePackage.id)}
                          value={isServicePackageSelected}
                        />
                      </TableCell>
                      <TableCell>
                        {servicePackage.description}
                      </TableCell>
                      <TableCell>
                        $&nbsp;
                        {servicePackage.unitPrice}
                      </TableCell>
                      <TableCell>
                        {convertToPlain(servicePackage.note)}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(servicePackage.id)}
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
  oldServicePackages: PropTypes.array,
  oldTotalCount: PropTypes.number,
  setModalEditIsOpenToTrue: PropTypes.func,
};

Results.defaultProps = {
};

export default Results;
