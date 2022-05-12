/* eslint-disable max-len */
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import ReactLoading from 'react-loading';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useIsMountedRef from 'src/hooks/useIsMountedRef';
import {
  Box,
  Card,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  // TablePagination,
  TableRow,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import axiosOrigin from 'axios';
import {
  CheckSquare as CheckSquareIcon,
  // PlusCircle as PlusCircleIcon,
  // Edit as EditIcon,
  // ArrowRight as ArrowRightIcon,
  // Search as SearchIcon
} from 'react-feather';
// import getInitials from 'src/utils/getInitials';
import { API_BASE_URL } from 'src/config';
import { SET_TRANSACTION_INVENTORIES } from 'src/actions/inventoryTransactionActions';
// import wait from 'src/utils/wait';

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
  asyncSelect: {
    height: '56px',
    minHeight: '56px',
    '&> div[class$="-control"]': {
      height: '56px',
      '&> div[class$="-ValueContainer"]': {
        height: '56px'
      }
    },
    width: 350,
  },
  searchHeaderWrapper: {
    marginTop: '20px',
    marginLeft: '20px',
    marginBottom: '20px',
  }
}));

let source;

const Results = forwardRef(({
  className,
  oldBaseInventory,
  oldInventories = [],
  oldTotalCount = 0,
  isPopup = false,
  baseInventory,
  ...rest
}, ref) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(isPopup ? 5 : 10);
  const [searchText, setSearchText] = useState();
  // const [baseInventory, setBaseInventory] = useState(oldBaseInventory);
  const [inventories, setInventories] = useState(oldInventories);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();

  const getInventories = async () => {
    if (source) {
      source.cancel('Cancelled the request');
    }

    source = axiosOrigin.CancelToken.source();
    const data = {
      page: page || 0,
      limit: limit || (isPopup ? 5 : 10),
      searchText,
      inventory_id: baseInventory.id,
      onhand: baseInventory.pieces
    };
    axios.post(`${API_BASE_URL}/inventory/load-transaction`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set inventory data
          setInventories(response.data.inventories);
          console.log('>>> response.data.inventories', response.data.inventories);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_TRANSACTION_INVENTORIES,
            payload: {
              inventories: response.data.inventories,
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
    if (inventories.length < 1) {
      setLoading(true);
      getInventories();
    }
  }, []);

  useEffect(() => {
    if (inventories.length < 1) {
      setLoading(true);
      getInventories();
    } else {
      setLoadingSecond(true);
      getInventories();
    }
  }, [limit, searchText, page]);

  useImperativeHandle(ref, () => ({
    updateList() {
      getInventories();
    }
  }));

  // const handlePageChange = (event, newPage) => {
  //   event.persist();
  //   setPage(newPage);
  // };

  // const handleLimitChange = (event) => {
  //   event.persist();
  //   setLimit(event.target.value);
  //   setPage(0);
  // };

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <PerfectScrollbar>
          <Box
            minWidth={700}
            className={classes.tableWrapper}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Item Number
                  </TableCell>
                  <TableCell>
                    Transaction ID
                  </TableCell>
                  <TableCell>
                    Change
                  </TableCell>
                  <TableCell>
                    On Hand
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
                        There are no Transaction Inventories.
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
                      Loading Transaction Inventories...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {baseInventory && (
                  <TableRow
                    hover
                    key={baseInventory.id}
                    className={classes.tableRowTag}
                  >
                    <TableCell>
                      {baseInventory.itemNumber}
                    </TableCell>
                    <TableCell>
                      &nbsp;
                    </TableCell>
                    <TableCell>
                      {baseInventory.pieces}
                    </TableCell>
                    <TableCell>
                      {baseInventory.pieces}
                    </TableCell>
                  </TableRow>
                )}
                {inventories.map((inventory) => (
                  <TableRow
                    hover
                    key={inventory.id}
                    className={classes.tableRowTag}
                  >
                    <TableCell>
                      {baseInventory.itemNumber}
                    </TableCell>
                    <TableCell>
                      <Link
                        color="inherit"
                        component={RouterLink}
                        to={`/app/management/shipments/${inventory.shipment[0]._id}`}
                        variant="h6"
                      >
                        {inventory.shipment[0].title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      -
                      {inventory.pieces}
                    </TableCell>
                    <TableCell>
                      {inventory.onhand}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </PerfectScrollbar>
        {/* <TablePagination
          component="div"
          count={totalCount}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 50]}
        /> */}
        {isLoadingSecond ? (
          <Box
            className={classes.loadingPopup}
          >
            LOADING
          </Box>
        ) : (<></>)}
      </Card>
    </>
  );
});

Results.propTypes = {
  className: PropTypes.string,
  oldBaseInventory: PropTypes.object,
  oldInventories: PropTypes.array,
  oldTotalCount: PropTypes.number,
  isPopup: PropTypes.bool,
  baseInventory: PropTypes.object,
};

Results.defaultProps = {
};

export default Results;
