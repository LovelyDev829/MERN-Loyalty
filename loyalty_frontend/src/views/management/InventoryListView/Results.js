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
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AsyncSelect from 'react-select/async';
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
  // PlusCircle as PlusCircleIcon,
  Edit as EditIcon,
  // ArrowRight as ArrowRightIcon,
  Search as SearchIcon
} from 'react-feather';
import getInitials from 'src/utils/getInitials';
import { API_BASE_URL } from 'src/config';
import { SET_INVENTORIES } from 'src/actions/inventoryActions';
// import wait from 'src/utils/wait';
import InventoryTransactionListView from '../InventoryTransactionListView/Results';

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
  },

  popupModalTransactionList: {
    // width: '897px',
    minWidth: '500px',
    maxHeight: '85%',
    zIndex: '60000',
    position: 'fixed',
    top: '100px',
    left: '50%',
    overflow: 'auto',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    width: '60%',
  },
  zIndex0: {
    zIndex: 0,
  },
  popupTransactionListSelectBtn: {

  },
  popupTransactionListContentTop: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-53px',
    marginBottom: '5px',
  },
  popupTransactionListHeadeBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '16px',
  },
  popupTransactionListCloseButton: {
  },
  popupTransactionListTitle: {
    marginTop: '7px',
  },
}));

const loadOptions = (inputValue, callback) => {
  axios.post(`${API_BASE_URL}/customer/easy-search`, { search_text: inputValue, page: '0', limit: '10' })
    .then((response) => {
      const options = [];
      options.push({ label: 'All Customers', value: '' });
      for (let i = 0; i < response.data.customers.length; i++) {
        const element = response.data.customers[i];
        const option = {};
        option.value = element.id;
        option.label = (
          `${element.firstName} ${element.lastName} (${element.email})`
        );
        options.push(option);
      }
      callback(options);
    });
};

let source;

const Results = forwardRef(({
  className,
  oldInventories = [],
  oldTotalCount = 0,
  setModalEditIsOpenToTrue,
  isPopup = false,
  setImportedInventories,
  unsetImportedInventories,
  ...rest
}, ref) => {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [viewConfirmBulkDelete, setViewConfirmBulkDelete] = useState(false);
  const [selectedInventories, setSelectedInventories] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(isPopup ? 5 : 10);
  const [searchText, setSearchText] = useState();
  const [sort, setSort] = useState(sortOptions[0].value);
  const { enqueueSnackbar } = useSnackbar();
  const [inventories, setInventories] = useState(oldInventories);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingSecond, setLoadingSecond] = useState(false);
  const [isNoData, setNoData] = useState(false);
  const dispatch = useDispatch();
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [baseInventory, setBaseInventory] = useState(null);

  const getInventories = async () => {
    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    const data = {
      page: page || 0,
      limit: limit || (isPopup ? 5 : 10),
      sort,
      searchText,
      customer_id: selectedCustomer,
    };

    axios.post(`${API_BASE_URL}/inventory/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set inventory data
          setInventories(response.data.inventories);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_INVENTORIES,
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
  }, [limit, searchText, sort, page, selectedCustomer]);

  useImperativeHandle(ref, () => ({
    updateList() {
      getInventories();
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

  const handleSelectAllInventories = (event) => {
    setSelectedInventories(event.target.checked
      ? inventories.map((inventory) => inventory.id)
      : []);

    // from "Create Packing List"
    if (isPopup) {
      if (!event.target.checked) {
        unsetImportedInventories(inventories.map((inventory) => inventory.id), inventories.slice(0));
      } else {
        setImportedInventories(inventories.map((inventory) => inventory.id), inventories.slice(0));
      }
    }
  };

  const handleSelectOneInventory = (event, inventoryId) => {
    console.log('>>> inventoryId, selectedInventories, event', inventoryId, selectedInventories, event.target.value);
    // from "Create Packing List"
    if (isPopup) {
      if (!event.target.checked) {
        unsetImportedInventories([inventoryId], inventories.slice(0));
      } else {
        setImportedInventories([inventoryId], inventories.slice(0));
      }
    }

    if (!selectedInventories.includes(inventoryId)) {
      setSelectedInventories((prevSelected) => [...prevSelected, inventoryId]);
    } else {
      setSelectedInventories((prevSelected) => prevSelected.filter((id) => id !== inventoryId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Inventories deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete Inventories.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedInventories([]);
    getInventories();
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
    asyncForEach(selectedInventories, async (selectedInventory) => {
      const response = await axios.delete(`${API_BASE_URL}/inventory/${selectedInventory}`);
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

  const handleEdit = async (inventoryId) => {
    setModalEditIsOpenToTrue(inventoryId);
  };
  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedInventories.length > 0;
  const selectedSomeInventories = selectedInventories.length > 0 && selectedInventories.length < inventories.length;
  const selectedAllInventories = selectedInventories.length === inventories.length;

  const handleCustomerSelectChange = (opt) => {
    setSelectedCustomer(opt.value);
  };

  // Create Packing List
  const [modalTransactionListIsOpen, setModalTransactionListIsOpen] = useState(false);
  const setModalTransactionListIsOpenToTrue = () => {
    setModalTransactionListIsOpen(true);
  };

  const setModalTransactionListIsOpenToFalse = () => {
    setModalTransactionListIsOpen(false);
  };

  const handleTransactionView = async (inventory) => {
    if (!isPopup) {
      setBaseInventory(inventory);
      setModalTransactionListIsOpenToTrue();
    }
  };

  return (
    <>
      <Card
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Grid
          container
          spacing={3}
          className={classes.searchHeaderWrapper}
        >
          <Grid item>
            <AsyncSelect
              className={classes.asyncSelect}
              cacheOptions
              loadOptions={loadOptions}
              defaultOptions
              // value={selectedCustomer}
              onChange={(opt) => handleCustomerSelectChange(opt)}
              // placeholder="Select Customer ..."
              placeholder="All Customers"
            />
          </Grid>
          <Grid item>
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
              placeholder="Search inventories"
              value={searchText}
              variant="outlined"
            />
          </Grid>
          {!isPopup && (
          <Grid item>
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
          </Grid>
          )}
        </Grid>
        {enableBulkOperations && !isPopup && (
          <div className={classes.bulkOperations}>
            <div className={classes.bulkActions}>
              <Checkbox
                checked={selectedAllInventories}
                indeterminate={selectedSomeInventories}
                onChange={handleSelectAllInventories}
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
                      checked={selectedAllInventories}
                      indeterminate={selectedSomeInventories}
                      onChange={handleSelectAllInventories}
                    />
                  </TableCell>
                  <TableCell>
                    LGL Number
                  </TableCell>
                  <TableCell>
                    Item Number
                  </TableCell>
                  <TableCell>
                    Customer
                  </TableCell>
                  <TableCell>
                    Warehouse
                  </TableCell>
                  <TableCell>
                    Pieces
                  </TableCell>
                  <TableCell>
                    Type
                  </TableCell>
                  <TableCell>
                    Description
                  </TableCell>
                  <TableCell>
                    l
                  </TableCell>
                  <TableCell>
                    w
                  </TableCell>
                  <TableCell>
                    h
                  </TableCell>
                  <TableCell>
                    weight
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
                        There are no Inventories.
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
                      Loading Inventories...
                    </Typography>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {inventories.map((inventory) => {
                  const isInventorySelected = selectedInventories.includes(inventory.id);
                  return (
                    <TableRow
                      hover
                      key={inventory.id}
                      selected={isInventorySelected}
                      className={classes.tableRowTag}
                      // onClick={() => handleRowClick(inventory)}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isInventorySelected}
                          onChange={(event) => handleSelectOneInventory(event, inventory.id)}
                          value={isInventorySelected}
                        />
                      </TableCell>
                      <TableCell
                        onClick={() => handleEdit(inventory.id)}
                      >
                        {inventory.lglNumber}
                      </TableCell>
                      <TableCell
                        onClick={() => handleEdit(inventory.id)}
                      >
                        {inventory.itemNumber}
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            className={classes.avatar}
                            src={inventory.customer.avatar}
                          >
                            {getInitials(`${inventory.customer[0].firstName} ${inventory.customer[0].lastName}`)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/app/management/customers/${inventory.customer[0]._id}`}
                              variant="h6"
                            >
                              {inventory.customer[0].company}
                            </Link>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/app/management/customers/${inventory.customer[0]._id}`}
                                variant="h6"
                              >
                                {inventory.customer[0].firstName}
                                {' '}
                                {inventory.customer[0].lastName}
                                {', '}
                                {inventory.customer[0].email}
                              </Link>
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.warehouse.length > 0 && (
                          inventory.warehouse[0].name
                        )}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.pieces}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.type}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.description}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.l}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.w}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.h}
                      </TableCell>
                      <TableCell
                        onClick={() => handleTransactionView(inventory)}
                      >
                        {inventory.weight}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEdit(inventory.id)}
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

      <Modal
        isOpen={modalTransactionListIsOpen}
        className={classes.popupModalTransactionList}
      >
        <Box className={classes.popupTransactionListHeadeBox}>
          <Button onClick={setModalTransactionListIsOpenToFalse} className={classes.popupTransactionListCloseButton}>X</Button>
          <h3 className={classes.popupTransactionListTitle}>Inventory Transactions</h3>
        </Box>
        <Box className={classes.popupContent}>
          <InventoryTransactionListView
            isPopup
            baseInventory={baseInventory}
          />
        </Box>
      </Modal>
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
  oldInventories: PropTypes.array,
  oldTotalCount: PropTypes.number,
  setModalEditIsOpenToTrue: PropTypes.func,
  isPopup: PropTypes.bool,
  setImportedInventories: PropTypes.func,
  unsetImportedInventories: PropTypes.func,
};

Results.defaultProps = {
};

export default Results;
