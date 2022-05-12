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
import { SET_USERS } from 'src/actions/userActions';
import { API_BASE_URL } from 'src/config';

/**
   * 1. Alphabetical A-Z
   * 2. Default User
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
    label: 'Default User'
  },
  {
    value: 3,
    label: 'Admin'
  },
  {
    value: 4,
    label: 'Active'
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
  className, oldUsers, oldTotalCount, ...rest
}) {
  const classes = useStyles();
  const isMountedRef = useIsMountedRef();
  const [users, setUsers] = useState(oldUsers);
  const [totalCount, setTotalCount] = useState(oldTotalCount);
  // const [users, setUsers] = useState([]);
  // const [totalCount, setTotalCount] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  const getUsers = async () => {
    const data = {
      page: page || 0,
      limit: limit || 50,
      sort: sort || 1,
      isActive: sort === 4,
      searchText,
    };

    if (source) {
      source.cancel('Cancelled the request');
    }
    source = axiosOrigin.CancelToken.source();

    axios.post(`${API_BASE_URL}/admin/user/load`, data, {
      cancelToken: source.token
    })
      .then(async (response) => {
        if (isMountedRef.current) {
          source = null;
          setLoading(false);
          setLoadingSecond(false);
          // set user data
          setUsers(response.data.users);
          setTotalCount(response.data.totalCount);
          setNoData(response.data.totalCount < 1);

          dispatch({
            type: SET_USERS,
            payload: {
              users: response.data.users,
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
    if (users.length < 1) {
      setLoading(true);
      getUsers();
    }
  }, []);

  useEffect(() => {
    if (users.length < 1) {
      setLoading(true);
      getUsers();
    } else {
      setLoadingSecond(true);
      getUsers();
    }
  }, [limit, sort, page, searchText]);

  if (!users) {
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

  const handleSelectAllUsers = (event) => {
    setSelectedUsers(event.target.checked
      ? users.map((user) => user.id)
      : []);
  };

  const handleSelectOneUser = (event, userId) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers((prevSelected) => [...prevSelected, userId]);
    } else {
      setSelectedUsers((prevSelected) => prevSelected.filter((id) => id !== userId));
    }
  };

  const processAfterDeleteDone = (rtn_status) => {
    if (rtn_status) {
      enqueueSnackbar('Users deleted', {
        variant: 'success',
        action: <Button>See all</Button>
      });
    } else {
      enqueueSnackbar('Error Occured! Can not delete all the selected Users.', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
    setSelectedUsers([]);
    getUsers();
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
    asyncForEach(selectedUsers, async (selectedUser) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/user/${selectedUser}`);
      if (!response.data.status) {
        return false;
      }
      return true;
    });
  };

  // Usually query is done on backend with indexing solutions
  const enableBulkOperations = selectedUsers.length > 0;
  const selectedSomeUsers = selectedUsers.length > 0 && selectedUsers.length < users.length;
  const selectedAllUsers = selectedUsers.length === users.length;

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
            placeholder="Search users"
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
                checked={selectedAllUsers}
                indeterminate={selectedSomeUsers}
                onChange={handleSelectAllUsers}
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
                      checked={selectedAllUsers}
                      indeterminate={selectedSomeUsers}
                      onChange={handleSelectAllUsers}
                    />
                  </TableCell>
                  <TableCell>
                    Name
                  </TableCell>
                  <TableCell>
                    Address
                  </TableCell>
                  <TableCell>
                    Phone
                  </TableCell>
                  <TableCell>
                    Active Status
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
                      Loading users...
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
                        There are no users in your account.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (<></>)}
              <TableBody>
                {users.map((user) => {
                  const isUserSelected = selectedUsers.includes(user.id);

                  return (
                    <TableRow
                      hover
                      key={user.id}
                      selected={isUserSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isUserSelected}
                          onChange={(event) => handleSelectOneUser(event, user.id)}
                          value={isUserSelected}
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          alignItems="center"
                        >
                          <Avatar
                            className={classes.avatar}
                            src={user.avatar}
                          >
                            {getInitials(`${user.firstName} ${user.lastName}`)}
                          </Avatar>
                          <div>
                            <Link
                              color="inherit"
                              component={RouterLink}
                              to={`/app/admin/users/${user.id}`}
                              variant="h6"
                            >
                              {user.firstName}
                              {' '}
                              {user.lastName}
                            </Link>
                            <Typography
                              variant="body2"
                              color="textSecondary"
                            >
                              <Link
                                color="inherit"
                                component={RouterLink}
                                to={`/app/admin/users/${user.id}`}
                                variant="h6"
                              >
                                {user.email}
                              </Link>
                            </Typography>
                          </div>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {user.fullAddr}
                      </TableCell>
                      <TableCell>
                        {user.phone}
                      </TableCell>
                      <TableCell>
                        <Label color="success">
                          { user.isActive ? 'Activated' : '' }
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          component={RouterLink}
                          to={`/app/admin/users/${user.id}`}
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
            Would you like to delete selected users?
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
  oldUsers: PropTypes.array,
  oldTotalCount: PropTypes.number
};

export default Results;
