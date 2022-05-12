/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import {
  makeStyles,
  Box,
  Button,
} from '@material-ui/core';
import { useTable, usePagination } from 'react-table';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  tableTag: {
    borderSpacing: 0,
    border: '1px solid black',
    borderBottom: 0,
    borderRight: 0,
  },
  trTag: {
    // '& > :last-child': {
    //   borderBottom: 0,
    // }
  },
  thTdTag: {
    margin: 0,
    padding: '0.5rem',
    borderBottom: '1px solid black',
    borderRight: '1px solid black',
    // '& > :last-child': {
    //   borderRight: 0,
    // },
  },
  inputTag: {
    fontSize: '1rem',
    padding: 0,
    margin: 0,
    border: 0,
  },
  cellBtn: {
    borderRadius: '0',
    backgroundColor: '#efefef',
    color: '#000',
  },
  cellWrapper: {
    display: 'flex',
  },
  cellLabelWH: {
    width: '150px',
    paddingTop: '8px',
  }
}));
function newRecord(columns) {
  const rtn = {};
  // eslint-disable-next-line array-callback-return
  columns.map((item) => {
    rtn[item.accessor] = '';
  });
  return rtn;
}

const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

function makeData(columns, ...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    // eslint-disable-next-line no-unused-vars
    return range(len).map((d) => ({
      ...newRecord(columns),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  selectMyData,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    const strInventory = selectMyData(index, 'inventoryStr');
    if (strInventory && strInventory.length > 0 && id !== 'pieces') {
      // row from Packing List
      return;
    }

    if (id === 'pieces') {
      if (e.target.value === '') {
        setValue('');
      } else {
        const strTmp = e.target.value;
        const matchArr = strTmp.match(/[\d]+/);
        if (matchArr) {
          const strTmp02 = matchArr[0];
          if (strInventory && strInventory.length > 0) {
            // check pieces validation, should be less than origin pieces.
            let pieces = '';
            let idValue = '';
            let contentValue = '';
            if (strInventory) {
              const arr = strInventory.split(',');
              if (arr.length >= 3) {
                [pieces, idValue, contentValue] = arr;
              }
            }
            let piecesIntVal = parseInt(pieces, 10);
            if (isNaN(piecesIntVal)) {
              piecesIntVal = 0;
            }

            let piecesIntValCurrent = parseInt(strTmp02, 10);
            if (isNaN(piecesIntValCurrent)) {
              piecesIntValCurrent = 0;
            }

            if (piecesIntValCurrent <= piecesIntVal) {
              setValue(strTmp02);
            }
          } else {
            // row is not from Packing List
            setValue(strTmp02);
          }
        }
      }
    } else {
      setValue(e.target.value);
    }
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={classes.inputTag}
      id={`id_${index}_${id}`}
    />
  );
};

// Create an editable cell renderer
const NonEditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let pieces = '';
  let idValue = '';
  let contentValue = '';
  if (initialValue) {
    const arr = initialValue.split(',');
    if (arr.length >= 3) {
      [pieces, idValue, contentValue] = arr;
    }
  }

  return (
    <div
      value={value}
      id={`id_${index}_${id}`}
    >
      <a href={`http://localhost:3000/app/management/inventories/${idValue}`}>{contentValue}</a>
    </div>
  );
};

// Create an editable cell renderer
const NonEditableWHCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  onSelectClick,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  let idValue = '';
  let contentValue = '';
  if (initialValue && initialValue.length > 0) {
    const arr = initialValue.split('***');
    if (arr.length >= 2) {
      [idValue, contentValue] = arr;
    }
  }

  return (
    <Box
      className={classes.cellWrapper}
    >
      <div
        value={value}
        id={`id_${index}_${id}`}
        className={classes.cellLabelWH}
      >
        <a href={`http://localhost:3000/app/management/warehouses/${idValue}`}>{contentValue}</a>
      </div>
      <Button
        className={classes.cellBtn}
        onClick={() => onSelectClick(index)}
      >
        ...
      </Button>
    </Box>
  );
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
  NonEditableCell,
  NonEditableWHCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
function EditableTable({
  columns, data, updateMyData, skipPageReset, onSelectClick, customPageSize = 50, handleDeleteRow, selectMyData
}) {
  const classes = useStyles();
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    // canPreviousPage,
    // canNextPage,
    // pageOptions,
    // pageCount,
    // gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    // eslint-disable-next-line no-unused-vars
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      // use the skipPageReset option to disable page resetting temporarily
      autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      onSelectClick,
      selectMyData
    },
    usePagination
  );

  React.useEffect(() => {
    setPageSize(customPageSize);
  }, []);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className={classes.tableTag}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={classes.trTag}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={classes.thTdTag}>{column.render('Header')}</th>
              ))}
              <th className={classes.thTdTag}>Action</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={classes.trTag}>
                {row.cells.map(
                  (cell, colIdx) => {
                    if (colIdx === 0) {
                      return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('NonEditableCell')}</td>;
                    }
                    if (colIdx === 2) {
                      return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('NonEditableWHCell')}</td>;
                    }
                    return <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('Cell')}</td>;
                  }
                )}
                <td className={classes.thTdTag}>
                  <Button
                    className={classes.cellBtn}
                    onClick={() => handleDeleteRow(i)}
                  >
                    del
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

EditableCell.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
  selectMyData: PropTypes.func,
};

NonEditableCell.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
};

NonEditableWHCell.propTypes = {
  value: PropTypes.number,
  row: PropTypes.number,
  column: PropTypes.number,
  updateMyData: PropTypes.func,
  onSelectClick: PropTypes.func,
};
EditableTable.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  updateMyData: PropTypes.func,
  skipPageReset: PropTypes.bool,
  customPageSize: PropTypes.number,
  onSelectClick: PropTypes.func,
  handleDeleteRow: PropTypes.func,
  selectMyData: PropTypes.func,
};

export {
  EditableTable, makeData, newRecord
};
