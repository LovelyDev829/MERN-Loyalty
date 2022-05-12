/* eslint-disable max-len */
/* eslint-disable no-restricted-globals */
/* eslint-disable use-isnan */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { useTable, usePagination } from 'react-table';
import {
  Box,
  Button,
  makeStyles,
} from '@material-ui/core';

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
  cellWrapper: {
    display: 'flex',
  },
  cellBtn: {
    borderRadius: '0',
    backgroundColor: '#efefef',
    color: '#000',
  },
  cellBtnSvg: {
    fill: '#ccc',
    marginLeft: '6px',
    '&:hover': {
      fill: '#aaa',
    }
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

const columnWidths = {
  name: '150px',
  email: '200px',
  phone: '150px',
  fax: '150px',
  address: '450px',
};
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
  onSelectClick,
  selectMyData,
}) => {
  const classes = useStyles();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    if (id === 'qty' || id === 'rate' || id === 'extCost') {
      const strTmp = e.target.value;
      // const fTmp = parseFloat(strTmp.match(/[\d\.]+/));
      const matchArr = strTmp.match(/[\d\.]+/);
      if (matchArr) {
        let strTmp02 = matchArr[0];
        if (strTmp02.indexOf('.') !== strTmp02.lastIndexOf('.')) {
          // for ex: 123.131.23
          strTmp02 = parseFloat(strTmp02).toString();
        }
        setValue(strTmp02);
        if (id === 'qty') {
          const strRate = selectMyData(index, 'rate');
          const fRate = parseFloat(strRate);
          const fQty = parseFloat(strTmp02);
          if (!isNaN(fRate) && !isNaN(fQty)) {
            updateMyData(index, 'extCost', (fQty * fRate).toString());
          }
        } else if (id === 'rate') {
          const strQty = selectMyData(index, 'qty');
          const fQty = parseFloat(strQty);
          const fRate = parseFloat(strTmp02);
          if (!isNaN(fRate) && !isNaN(fQty)) {
            updateMyData(index, 'extCost', (fRate * fQty).toString());
          }
        }
      } else {
        setValue('');
      }
    } else {
      setValue(e.target.value);
    }
    // console.log('>>> EditableCell onChange() called!');
    // updateMyData(index, id, value);
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
    <>
      {(id === 'name')
        && (
        <Box
          className={classes.cellWrapper}
        >
          <input
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={classes.inputTag}
            id={`id_${index}_${id}`}
            style={{ width: columnWidths[id] }}
          />
          <Button
            className={classes.cellBtn}
            onClick={() => onSelectClick(index)}
          >
            ...
          </Button>
        </Box>
        )}
      {(id !== 'name')
        && (
        <input
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={classes.inputTag}
          id={`id_${index}_${id}`}
          style={{ width: columnWidths[id] }}
        />
        )}
    </>
  );
};

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
};

// Be sure to pass our updateMyData and the skipPageReset option
function EditableTableWithSelectVendor({
  columns, data, updateMyData, skipPageReset, onSelectClick, selectMyData, customPageSize = 50,
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
      selectMyData,
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
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={classes.trTag}>
                {row.cells.map((cell) => <td {...cell.getCellProps()} className={classes.thTdTag}>{cell.render('Cell')}</td>)}
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
  onSelectClick: PropTypes.func,
  selectMyData: PropTypes.func,
};

EditableTableWithSelectVendor.propTypes = {
  columns: PropTypes.any,
  data: PropTypes.any,
  updateMyData: PropTypes.func,
  skipPageReset: PropTypes.func,
  customPageSize: PropTypes.number,
  onSelectClick: PropTypes.func,
  selectMyData: PropTypes.func,
};

export {
  EditableTableWithSelectVendor, makeData as makeDataWithSelectVendor, newRecord as newRecordWithSelectVendor
};
