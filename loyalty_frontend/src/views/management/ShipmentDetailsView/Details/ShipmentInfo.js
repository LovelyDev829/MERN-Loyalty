/* eslint-disable no-lonely-if */
/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Modal from 'react-modal';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  IconButton,
  SvgIcon,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import AsyncSelect from 'react-select/async';
import {
  Edit as EditIcon
} from 'react-feather';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import Label from 'src/components/Label';
import {
  EditableTable, makeData, newRecord
} from 'src/components/EditableTable';
import {
  NonEditableTable
} from 'src/components/NonEditableTable';
import {
  EditableTablePhoto, makeDataPhoto, newRecordPhoto
} from 'src/components/EditableTablePhoto';
import QuillEditor from 'src/components/QuillEditor';
import { updateUploadingPhoto } from 'src/actions/shipmentActions';
import { buildCommaSeparatedString } from 'src/utils/helper';
import { sortOptions } from '../Header';
import InventoryListResults from '../../InventoryListView/Results';

const useStyles = makeStyles((theme) => ({
  root: {},
  cardHeader: {
    paddingLeft: '0px',
    paddingRight: '0px',
  },
  fontWeightMedium: {
    fontWeight: theme.typography.fontWeightMedium
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  gridSpaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonWraper: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  displayNone: {
    display: 'none',
  },
  editor: {
    flexGrow: 1,
    '& .ql-editor': {
      minHeight: 100
    },
    '& .ql-container': {
      border: '1px solid #ccc'
    },
    background: '#f5f5f5'
  },
  datePicker: {
    '& + &': {
      marginLeft: theme.spacing(2)
    },
    width: '100%'
  },
  itemGrid: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemLabel: {
    background: 'transparent',
    // marginLeft: '10px',
    color: '#000',
    textTransform: 'initial',
    width: '50%',
    textAlign: 'left',
  },
  itemLabelSecond: {
    background: 'transparent',
    // marginLeft: '10px',
    color: '#000',
    textTransform: 'initial',
    width: '50%',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  itemValue: {
    background: 'transparent',
    fontSize: '15px',
    textTransform: 'initial',
  },
  textFieldFirst: {
    width: '100%',
    marginTop: '33px',
  },
  editableTableWrapper: {
    marginTop: '5px',
  },
  editableTableWrapperGrid: {
    width: '98%',
    overflow: 'auto',
    marginTop: '0px',
  },
  addMoreButton: {
    position: 'relative',
    left: '1777px',
    marginTop: '3px',
  },
  editableTableButtonsWrapperGrid: {
    width: '98%',
    overflow: 'auto',
    marginTop: '40px',
  },
  editableTableTopSide: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  createPackingListBtn: {
  },
  createReceiverBtn: {
    marginLeft: '10px',
  },
  popupModalPackingList: {
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
  popupPackingListSelectBtn: {

  },
  popupPackingListContentTop: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-53px',
    marginBottom: '5px',
  },
  popupPackingListHeadeBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '16px',
  },
  popupPackingListCloseButton: {
  },
  popupPackingListTitle: {
    marginTop: '7px',
  },

  popupModal: {
    minWidth: '450px',
    width: '35%',
    // minHeight: '250px',
    height: '452px',
    top: '25%',
    left: '50%',
    overflow: 'auto',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    position: 'fixed',
    zIndex: 10000,
  },
  popupHeadeBox: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '10px',
  },
  popupCloseButton: {
  },
  popupTitle: {
    marginTop: '7px',
  },
  zIndexType01: {
    zIndex: -1,
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
  },
  asyncSelectSP: {
    height: '56px',
    minHeight: '56px',
    '&> div[class$="-control"]': {
      height: '56px',
      '&> div[class$="-ValueContainer"]': {
        height: '56px'
      }
    },
    // zIndex: 100,
  },
  popupContentBottom: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  popupSelectBtn: {

  },
  popupContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '354px',
  },
  asyncSelectWH: {
    height: '56px',
    minHeight: '56px',
    '&> div[class$="-control"]': {
      height: '56px',
      '&> div[class$="-ValueContainer"]': {
        height: '56px'
      }
    },
    // zIndex: 100,
  },
  // vendor
  marginTopOne: {
    marginTop: '3px !important',
  },
  marginTopTwo: {
    marginTop: '50px !important',
  },
  marginTopThree: {
    marginTop: '0px !important',
    marginBottom: '-32px',
    paddingTop: '20px',
  },
  marginTopFour: {
    marginTop: '40px !important',
  },
  marginTopFive: {
    marginTop: '9px !important',
  },
  marginTopSix: {
    marginTop: '19px !important',
  },
  marginTopTen: {
    marginTop: '20px !important',
  },
  labelOne: {
    fontSize: '15px',
    marginBottom: '5px',
  },
  addMoreButtonWithSelectVendor: {
    position: 'relative',
    left: '1146px',
    marginTop: '3px',
  },
  // photo
  popupModalPhoto: {
    minWidth: '300px',
    width: '35%',
    // minHeight: '250px',
    maxHeight: '80%',
    top: '15%',
    left: '50%',
    overflow: 'auto',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    position: 'fixed',
    zIndex: 10000,
  },
  photoImageContainer: {
    marginTop: '10px',
    minHeight: '300px',
  },
  photoDateTime: {
  },
  photoDescription: {
    marginTop: '10px',
  },
  avatar: {
    // height: 100,
    // width: 100,
    width: '100%',
    height: '100%',
    minHeight: '300px',
    borderRadius: '0',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: '#bdbdbd',
      cursor: 'pointer',
    },
    fontSize: '28px',
  },
  avatarTwo: {
    // height: 100,
    // width: 100,
    width: '100%',
    height: '100%',
    minHeight: '300px',
    borderRadius: '0',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: '#bdbdbd',
      // cursor: 'pointer',
    },
    fontSize: '28px',
  },
  addMoreButtonPhoto: {
    position: 'relative',
    left: '811px',
    marginTop: '3px',
  },
  // photo view
  popupModalPhotoView: {
    minWidth: '300px',
    // width: '35%',
    // minHeight: '250px',
    maxHeight: '80%',
    maxWidth: '70%',
    top: '10%',
    left: '50%',
    overflow: 'auto',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    position: 'absolute',
    zIndex: 60000,
  },
  popupContentPhotoView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    // minHeight: '354px',
  },
}));

const loadOptionsOfWarehouses = (inputValue, callback) => {
  const data = {
    page: 0,
    limit: 10,
    sort: 1,
    searchText: inputValue,
  };
  axios.post(`${API_BASE_URL}/admin/warehouse/load`, data)
    .then((response) => {
      const options = [];
      for (let i = 0; i < response.data.warehouses.length; i++) {
        const element = response.data.warehouses[i];
        const option = {};
        option.value = `${element.id}***${element.name}`;
        option.label = (
          <div>
            {element.name}
            {' ('}
            {element.contactName}
            {', '}
            {element.contactEmail}
            {')'}
          </div>
        );
        options.push(option);
      }
      callback(options);
    });
};

// driver
const loadOptionsOfDrivers = (inputValue, callback) => {
  const data = {
    page: 0,
    limit: 10,
    sort: 1,
    searchText: inputValue,
  };
  axios.post(`${API_BASE_URL}/admin/driver/load`, data)
    .then((response) => {
      const options = [];

      // Unassigned
      let option = {};
      option.value = '';
      option.label = (
        <div>
          Unassigned
        </div>
      );
      options.push(option);

      for (let i = 0; i < response.data.drivers.length; i++) {
        const element = response.data.drivers[i];
        option = {};
        option.value = element.id;
        option.label = (
          <div>
            {element.name}
            {', '}
            {element.phone}
          </div>
        );
        options.push(option);
      }
      callback(options);
    });
};

// customer representative
const loadOptionsOfCustomerRepresentatives = (inputValue, callback) => {
  const data = {
    page: 0,
    limit: 10,
    sort: 1,
    searchText: inputValue,
  };
  axios.post(`${API_BASE_URL}/admin/customer-representative/load`, data)
    .then((response) => {
      const options = [];

      // Unassigned
      let option = {};
      option.value = '';
      option.label = (
        <div>
          House
        </div>
      );
      options.push(option);

      for (let i = 0; i < response.data.customerRepresentatives.length; i++) {
        const element = response.data.customerRepresentatives[i];
        option = {};
        option.value = element.id;
        option.label = (
          <div>
            {element.name}
            {', '}
            {element.email}
            {', '}
            {element.phone}
          </div>
        );
        options.push(option);
      }
      callback(options);
    });
};
function ShipmentInfo({
  shipment,
  setShipment,
  className,
  ...rest
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [isReciverCreated, setIsReciverCreated] = React.useState(shipment.isReciverCreated);

  const handleAsyncSelectChangeDriver = (opt, setFieldValue) => {
    setFieldValue('driver', opt.value);
  };

  const handleAsyncSelectChangeCustomerRepresentative = (opt, setFieldValue) => {
    setFieldValue('customerRepresentative', opt.value);
  };

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    return inputValue;
  };
  // Parcel table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Inventory',
        accessor: 'inventoryStr',
      },
      {
        Header: 'Pieces',
        accessor: 'pieces',
      },
      {
        Header: 'Warehouse',
        accessor: 'warehouse',
      },
      {
        Header: 'Type',
        accessor: 'type',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'L',
        accessor: 'l',
      },
      {
        Header: 'W',
        accessor: 'w',
      },
      {
        Header: 'h',
        accessor: 'h',
      },
      {
        Header: 'Weight',
        accessor: 'weight',
      },
    ],
  );
  const columnsPhoto = React.useMemo(
    () => [
      {
        Header: 'Photo',
        accessor: 'photoURL',
      },
      {
        Header: 'Date & Time',
        accessor: 'dateTime',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
    ],
  );

  const [editableTableData, setEditableTableData] = React.useState(() => makeData(columns, 7));
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const addMore = () => {
    setEditableTableData([...editableTableData, newRecord(columns)]);
  };

  const handleSortChange = (event, setFieldValue) => {
    setFieldValue('status', event.target.value);
  };

  const updateMyData = (rowIndex, columnId, value, setFieldValue) => {
    setSkipPageReset(true);
    setEditableTableData((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  const handleCreateReciver = async () => {
    const data = {
      inventories: editableTableData,
      inventoryType: shipment.type === '1' ? 'shipment' : 'service',
      shipment: shipment.id,
      customer: shipment.customer[0]._id,
    };
    const response = await axios.post(`${API_BASE_URL}/inventory/create-bulk`, data);
    if (response.data.status) {
      enqueueSnackbar('Receiver created', {
        variant: 'success',
        action: <Button>See all</Button>
      });
      setIsReciverCreated(true);
    } else {
      enqueueSnackbar('Receiver not created', {
        variant: 'error',
        action: <Button>See all</Button>
      });
    }
  };

  // Warehouse select
  const [warehouseLstVal, setWarehouseLstVal] = useState('');
  const [editTableRowIdxBtnClickedWH, setEditTableRowIdxBtnClickedWH] = useState(-1);

  const updateMyDataWithSelectFromPopupWH = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true);
    setEditableTableData((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };
  const [modalWHSelectCreateIsOpen, setModalWHSelectCreateIsOpen] = useState(false);
  const setModalWHSelectCreateIsOpenToTrue = (index) => {
    setEditTableRowIdxBtnClickedWH(index);
    setModalWHSelectCreateIsOpen(true);
  };

  const setModalWHSelectCreateIsOpenToFalse = () => {
    setModalWHSelectCreateIsOpen(false);
    setWarehouseLstVal('');
  };

  const onSelectWH = () => {
    if (warehouseLstVal.length > 0) {
      setModalWHSelectCreateIsOpenToFalse();
      updateMyDataWithSelectFromPopupWH(editTableRowIdxBtnClickedWH, 'warehouse', warehouseLstVal);
    } else {
      enqueueSnackbar('Select a Warehouse from list', {
        variant: 'error',
      });
    }
  };

  const handleAsyncSelectChangeWH = (opt) => {
    setWarehouseLstVal(opt.value);
  };

  // Create Packing List
  const [modalPackingListIsOpen, setModalPackingListIsOpen] = useState(false);
  const setModalPackingListIsOpenToTrue = () => {
    setModalPackingListIsOpen(true);
  };

  const setModalPackingListIsOpenToFalse = () => {
    setModalPackingListIsOpen(false);
  };

  // Packing list
  const [selectedInventories, setSelectedInventories] = useState([]);

  const handleDeleteRow = (rowIndex) => {
    setSkipPageReset(true);
    const oldData = editableTableData.slice(0);
    oldData.splice(rowIndex, 1);
    setEditableTableData(oldData);
  };

  const setImportedInventories = (selectedIDArr, inventoriesArr) => {
    const oldArr = selectedInventories.slice(0);
    for (let i = 0; i < selectedIDArr.length; i++) {
      const inventoryObj = inventoriesArr.find((element) => element.id === selectedIDArr[i]);
      const inventoryObjOld = oldArr.find((element) => element.id === selectedIDArr[i]);
      if (inventoryObjOld === undefined) {
        oldArr.push(inventoryObj);
      }
    }
    setSelectedInventories(oldArr);
  };

  const unsetImportedInventories = (unselectedIDArr) => {
    const oldArr = selectedInventories.slice(0);
    for (let i = 0; i < unselectedIDArr.length; i++) {
      const foundIdx = oldArr.findIndex((element) => element.id === unselectedIDArr[i]);
      if (foundIdx > -1) {
        oldArr.splice(foundIdx, 1);
      }
    }
    setSelectedInventories(oldArr);
  };

  const processImportedInventories = () => {
    const oldEditableTableData = editableTableData.slice(0);
    for (let i = 0; i < selectedInventories.length; i++) {
      let addedRowIdx = -1;
      for (let j = 0; j < oldEditableTableData.length; j++) {
        const row = oldEditableTableData[j];
        let isEmptyRow = true;
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(row)) {
          if (row[key] && row[key].trim() !== '') {
            isEmptyRow = false;
            break;
          }
        }
        if (isEmptyRow) {
          addedRowIdx = j;
          break;
        }
      }

      if (addedRowIdx < 0) {
        addedRowIdx = oldEditableTableData.length;
        oldEditableTableData.push(newRecord(columns));
      }

      // set row values
      const inventoryObj = selectedInventories[i];
      if (inventoryObj !== undefined) {
        const inventoryStr = `${inventoryObj.pieces},${inventoryObj.id},${inventoryObj.itemNumber}`;
        const obj = oldEditableTableData.find((o) => {
          let pieces = '';
          let idValue = '';
          let contentValue = '';
          if (o.inventoryStr) {
            const arr = o.inventoryStr.split(',');
            if (arr.length >= 3) {
              [pieces, idValue, contentValue] = arr;
            }
          }
          if (idValue === inventoryObj.id) {
            return true;
          }
          return false;
        });
        if (obj === undefined) {
          oldEditableTableData[addedRowIdx].inventoryStr = inventoryStr;
          oldEditableTableData[addedRowIdx].pieces = inventoryObj.pieces;
          const strWarehouse = inventoryObj.warehouse.length > 0 ? `${inventoryObj.warehouse[0]._id}***${inventoryObj.warehouse[0].name}` : '';
          oldEditableTableData[addedRowIdx].warehouse = strWarehouse;
          oldEditableTableData[addedRowIdx].type = inventoryObj.type;
          oldEditableTableData[addedRowIdx].description = inventoryObj.description;
          oldEditableTableData[addedRowIdx].l = inventoryObj.l;
          oldEditableTableData[addedRowIdx].w = inventoryObj.w;
          oldEditableTableData[addedRowIdx].h = inventoryObj.h;
          oldEditableTableData[addedRowIdx].weight = inventoryObj.weight;
        } else {
          enqueueSnackbar('Selected Inventory already exists', {
            variant: 'error',
            action: <Button>See all</Button>
          });
        }
      }
    }

    if (selectedInventories.length > 0) {
      setEditableTableData(oldEditableTableData);
    }
  };

  const handleCreatePackingList = () => {
    setSelectedInventories([]);
    setModalPackingListIsOpenToTrue();
  };

  const handleImportInventory = () => {
    setModalPackingListIsOpenToFalse();
    processImportedInventories();
  };

  const selectMyData = (rowIndex, columnId) => {
    setSkipPageReset(true);
    return editableTableData[rowIndex][columnId];
  };

  // vendor
  const columnsWithSelectVendor = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Cost Name',
        accessor: 'costName',
      },
      {
        Header: 'QTY',
        accessor: 'qty',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Rate',
        accessor: 'rate',
      },
      {
        Header: 'Ext Cost',
        accessor: 'extCost',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone',
        accessor: 'phone',
      },
      {
        Header: 'Fax',
        accessor: 'fax',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
    ],
  );
  const columnWidths = {
    name: '150px',
    email: '200px',
    phone: '150px',
    fax: '150px',
    address: '450px',
  };
  const [editableTableDataWithSelectVendor, setEditableTableDataWithSelectVendor] = React.useState(() => makeData(columnsWithSelectVendor, 7));
  const [skipPageResetWithSelectVendor, setSkipPageResetWithSelectVendor] = React.useState(false);

  const updateMyDataWithSelectVendor = (rowIndex, columnId, value, setFieldValue) => {
    setSkipPageResetWithSelectVendor(true);
    setEditableTableDataWithSelectVendor((old) => old.map((row, index) => {
      return row;
    }));
  };

  // service package
  const columnsWithSelect = React.useMemo(
    () => [
      {
        Header: 'QTY',
        accessor: 'qty',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Unit Price',
        accessor: 'unitPrice',
      },
      {
        Header: 'Total',
        accessor: 'total',
      },
      {
        Header: 'Notes',
        accessor: 'notes',
      },
    ],
  );
  const [editableTableDataWithSelect, setEditableTableDataWithSelect] = React.useState(() => makeData(columnsWithSelect, 7));
  const [skipPageResetWithSelect, setSkipPageResetWithSelect] = React.useState(false);
  const updateMyDataWithSelect = (rowIndex, columnId, value, setFieldValue) => {
    setSkipPageResetWithSelect(true);
    setEditableTableDataWithSelect((old) => old.map((row, index) => {
      return row;
    }));
  };

  // photo
  const [photoPhotoURLForView, setPhotoPhotoURLForView] = React.useState('');
  const [photoPhotoURL, setPhotoPhotoURL] = React.useState('');
  const [photoDateTime, setPhotoDateTime] = React.useState(new Date());
  const [photoDescription, setPhotoDescription] = React.useState('');
  const [editableTableDataPhoto, setEditableTableDataPhoto] = React.useState(() => makeData(columnsPhoto, 7));
  const [skipPageResetPhoto, setSkipPageResetPhoto] = React.useState(false);
  const [editTableRowIdxBtnClickedPhoto, setEditTableRowIdxBtnClickedPhoto] = useState(-1);
  const columnWidthsPhoto = {
    photoURL: '100px',
    dateTime: '150px',
    description: '500px',
  };
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
  const form = useRef(null);
  const [avatarHover, setAvatarHover] = useState(false);
  const avatarInputFile = useRef(null);
  const formSubmit = useRef(null);
  const formReset = useRef(null);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const addMorePhoto = () => {
    setEditableTableDataPhoto([...editableTableDataPhoto, newRecord(columnsPhoto)]);
  };

  const handleDeleteRowPhoto = (rowIndex) => {
    setSkipPageReset(true);
    const oldData = editableTableDataPhoto.slice(0);
    oldData.splice(rowIndex, 1);
    setEditableTableDataPhoto(oldData);
  };

  const selectMyDataPhoto = (rowIndex, columnId) => {
    setSkipPageResetPhoto(true);
    return editableTableDataPhoto[rowIndex][columnId];
  };

  const [modalPhotoSelectCreateIsOpen, setModalPhotoSelectCreateIsOpen] = useState(false);
  const setModalPhotoSelectCreateIsOpenToTrue = (index) => {
    try {
      // formReset.current.click();
    } catch {}

    setEditTableRowIdxBtnClickedPhoto(index);
    try {
      setPhotoDateTime(editableTableDataPhoto[index].dateTime === '' ? new Date() : editableTableDataPhoto[index].dateTime);
      setPhotoDescription(editableTableDataPhoto[index].description);
      setPhotoPhotoURL(editableTableDataPhoto[index].photoURL);
    } catch (ex) {
      setPhotoDateTime(new Date());
      setPhotoDescription('');
      setPhotoPhotoURL('');
    }

    setModalPhotoSelectCreateIsOpen(true);
  };

  const setModalPhotoSelectCreateIsOpenToFalse = () => {
    setModalPhotoSelectCreateIsOpen(false);
    // setWarehouseLstVal('');
  };

  const updateMyDataPhoto = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageResetPhoto(true);
    setEditableTableDataPhoto((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  const handleSubmission = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await axios.post(`${API_BASE_URL}/shipment/upload-photo`, formData);
      enqueueSnackbar('Photo updated', {
        variant: 'success'
      });
      setPhotoPhotoURL(response.data.photoURL);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    setIsPhotoUploading(false);
  };

  const onSelectPhoto = () => {
    // formSubmit.current.click();
    updateMyDataPhoto(editTableRowIdxBtnClickedPhoto, 'photoURL', photoPhotoURL);
    updateMyDataPhoto(editTableRowIdxBtnClickedPhoto, 'dateTime', new Date(photoDateTime));
    updateMyDataPhoto(editTableRowIdxBtnClickedPhoto, 'description', photoDescription);
    setModalPhotoSelectCreateIsOpenToFalse();
  };

  const changeHandler = (e) => {
    try {
      const file = e.target.files[0];
      console.log('file', file);
      if (file.size > 1024 * 1024 * 50) {
        console.log('Error: File size cannot exceed more than 50MB');
        return;
      }

      setSelectedFile(file);
      setIsFilePicked(true);
      setIsPhotoUploading(true);
      setTimeout(() => {
        formSubmit.current.click();
      }, 1000);
    } catch (ex) {}
  };

  // photo view
  const [modalPhotoViewSelectCreateIsOpen, setModalPhotoViewSelectCreateIsOpen] = useState(false);
  const setModalPhotoViewSelectCreateIsOpenToTrue = (index) => {
    setEditTableRowIdxBtnClickedPhoto(index);
    setPhotoPhotoURLForView(editableTableDataPhoto[index].photoURL);
    setModalPhotoViewSelectCreateIsOpen(true);
  };

  const setModalPhotoViewSelectCreateIsOpenToFalse = () => {
    setModalPhotoViewSelectCreateIsOpen(false);
  };

  // useEffect
  useEffect(() => {
  }, []);

  useEffect(() => {
    if (shipment.packagesTableData) {
      setEditableTableData(shipment.packagesTableData);
    }
    if (shipment.packagesTableDataSP) {
      setEditableTableDataWithSelect(shipment.packagesTableDataSP);
    }
    if (shipment.vendorsTableData) {
      setEditableTableDataWithSelectVendor(shipment.vendorsTableData);
    }
    if (shipment.photosTableData) {
      setEditableTableDataPhoto(shipment.photosTableData);
    }
  }, []);

  return (
    <>
      <Formik
        initialValues={shipment}
        validationSchema={Yup.object().shape({
          internalNote: Yup.string().max(255),
          customerNote: Yup.string().max(255),
          dueStart: Yup.date(),
          dueEnd: Yup.date(),
          PODDateTime: Yup.date(),
          status: Yup.string().max(255),
          insured: Yup.number().test(
            'is-decimal',
            'invalid decimal',
            (value) => (`${value}`).match(/^[0-9]\d*(\.\d+)?$/),
          ),
          declared: Yup.number().test(
            'is-decimal',
            'invalid decimal',
            (value) => (`${value}`).match(/^[0-9]\d*(\.\d+)?$/),
          ),
          price: Yup.number().test(
            'is-decimal',
            'invalid decimal',
            (value) => (`${value}`).match(/^[0-9]\d*(\.\d+)?$/),
          ),
        })}
        onSubmit={async (values, {
          // resetForm,
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            const customer_backup = { ...shipment.customer };
            // delete values.customer;
            values.customer = shipment.customer[0]._id;
            values.packagesTableData = editableTableData;
            values.photosTableData = editableTableDataPhoto;

            console.log('>>>values.driver ', values.driver);
            const oldDriverValue = values.driver;
            if (typeof values.driver === 'string') {
              if (values.driver === '') {
                values.driver = undefined;
              }
            } else {
              if (shipment.driver.length > 0) {
                values.driver = shipment.driver[0]._id;
              } else {
                values.driver = undefined;
              }
            }

            console.log('>>>values.customerRepresentative ', values.customerRepresentative);
            const oldCustomerRepresentativeValue = values.customerRepresentative;
            if (typeof values.customerRepresentative === 'string') {
              if (values.customerRepresentative === '') {
                values.customerRepresentative = undefined;
              }
            } else {
              if (shipment.customerRepresentative.length > 0) {
                values.customerRepresentative = shipment.customerRepresentative[0]._id;
              } else {
                values.customerRepresentative = undefined;
              }
            }

            const response = await axios.put(`${API_BASE_URL}/shipment/${shipment.id}`, values);

            values.customer = customer_backup;
            values.driver = oldDriverValue;
            values.customerRepresentative = oldCustomerRepresentativeValue;
            setShipment({
              // ...response.data.shipment,
              ...values,
              customer: customer_backup,
            });
            setStatus({ success: response.data.status });
            setSubmitting(false);
            enqueueSnackbar('Shipment updated', {
              variant: 'success',
              action: <Button>See all</Button>
            });
          } catch (error) {
            setStatus({ success: false });
            setErrors({ submit: error.message });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldTouched,
          setFieldValue,
          touched,
          values
        }) => (
          <form
            className={clsx(classes.root, className)}
            onSubmit={handleSubmit}
            {...rest}
          >
            <input type="hidden" value={values.originFullAddr} name="originFullAddr" />
            <input type="hidden" value={values.destFullAddr} name="destFullAddr" />
            <input type="hidden" value={shipment.customer[0]._id} name="customer" />
            <Card>
              <CardContent>
                <Grid
                  container
                  className={classes.gridSpaceBetween}
                >
                  <Grid item>
                    <CardHeader
                      className={classes.cardHeader}
                      title="Shipment info"
                    />
                  </Grid>
                  <Grid
                    item
                  >
                    <IconButton
                      component={RouterLink}
                      to={`/app/management/shipments/${shipment.id}/edit/${shipment.type}`}
                    >
                      <SvgIcon fontSize="small">
                        <EditIcon />
                      </SvgIcon>
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider />
                <Box mt={2} className={classes.buttonWraper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Update Shipment
                  </Button>
                </Box>
                <Grid
                  container
                  spacing={3}
                  id="element-to-print"
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    // spacing={3}
                  >
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        // spacing={3}
                        xs={12}
                        sm={12}
                        md={6}
                      >
                        <Grid
                          container
                          spacing={3}
                        >
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className={classes.itemGrid}
                          >
                            <Typography
                              className={classes.itemLabel}
                              variant="body2"
                              color="textSecondary"
                            >
                              Shipment ID:&nbsp;
                            </Typography>
                            <Typography
                              className={classes.itemValue}
                              variant="body2"
                              color="textSecondary"
                            >
                              {values.title}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            xs={12}
                            className={classes.itemGrid}
                          >
                            <Typography
                              className={classes.itemLabel}
                              variant="body2"
                              color="textSecondary"
                            >
                              Customer:
                            </Typography>
                            <Typography
                              className={classes.itemValue}
                              variant="body2"
                              color="textSecondary"
                            >
                              {`${shipment.customer[0].company}`}
                              <br />
                              {`(${shipment.customer[0].firstName} ${shipment.customer[0].lastName}, ${shipment.customer[0].email})`}
                            </Typography>
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <TextField
                              className={clsx(classes.textFieldFirst, classes.zIndex0)}
                              label="Current Status"
                              name="sort"
                              onChange={(event) => handleSortChange(event, setFieldValue)}
                              select
                              SelectProps={{ native: true }}
                              variant="outlined"
                              value={values.status}
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
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <TextField
                              error={Boolean(touched.price && errors.price)}
                              fullWidth
                              helperText={touched.price && errors.price}
                              label="Price"
                              name="price"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.price}
                              variant="outlined"
                              className={clsx(classes.zIndex0, classes.textFieldFirst)}
                              inputProps={
                                { readOnly: values.type === '2', }
                              }
                            />
                          </Grid>
                          {values.status === '3' && (
                          <>
                            {/* <Grid
                              item
                              md={12}
                              xs={12}
                            >
                              <Typography
                                className={classes.itemLabelSecond}
                                variant="body2"
                                color="textSecondary"
                              >
                                POD (Proof Of Delivery) &gt;&gt;
                              </Typography>
                            </Grid> */}
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <DateTimePicker
                                fullWidth
                                inputVariant="outlined"
                                label="POD Date Time"
                                name="PODDateTime"
                                format="MM/DD/YYYY HH:mm:ss"
                                onClick={() => setFieldTouched('PODDateTime')}
                                onChange={(date) => setFieldValue('PODDateTime', date)}
                                value={values.PODDateTime}
                              />
                            </Grid>
                            <Grid
                              item
                              md={6}
                              xs={12}
                            >
                              <TextField
                                error={Boolean(touched.declared && errors.declared)}
                                fullWidth
                                helperText={touched.declared && errors.declared}
                                label="Consignee"
                                name="PODWho"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.PODWho}
                                variant="outlined"
                                className={classes.zIndex0}
                              />
                            </Grid>
                            <Grid
                              item
                              md={12}
                              xs={12}
                            >
                              &nbsp;
                            </Grid>
                          </>
                          )}
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <TextField
                              error={Boolean(touched.insured && errors.insured)}
                              fullWidth
                              helperText={touched.insured && errors.insured}
                              label="Insured"
                              name="insured"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.insured}
                              variant="outlined"
                              className={clsx(classes.zIndex0, classes.marginTopSix)}
                            />
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <TextField
                              error={Boolean(touched.declared && errors.declared)}
                              fullWidth
                              helperText={touched.declared && errors.declared}
                              label="Declared"
                              name="declared"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.declared}
                              variant="outlined"
                              className={clsx(classes.zIndex0, classes.marginTopSix)}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        // spacing={3}
                        xs={12}
                        sm={12}
                        md={6}
                      >
                        <Grid
                          container
                          spacing={3}
                        >
                          <Grid
                            item
                            md={12}
                            xs={12}
                          >
                            <Label
                              className={classes.itemValue}
                            >
                              &nbsp;
                            </Label>
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <DateTimePicker
                              fullWidth
                              inputVariant="outlined"
                              label="Pick Up Date"
                              name="dueStart"
                              format="MM/DD/YYYY HH:mm:ss"
                              onClick={() => setFieldTouched('dueStart')}
                              onChange={(date) => setFieldValue('dueStart', date)}
                              value={values.dueStart}
                            />
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <DateTimePicker
                              fullWidth
                              inputVariant="outlined"
                              label="Delivery Date"
                              name="dueEnd"
                              format="MM/DD/YYYY HH:mm:ss"
                              onClick={() => setFieldTouched('dueEnd')}
                              onChange={(date) => setFieldValue('dueEnd', date)}
                              value={values.dueEnd}
                            />
                          </Grid>

                          <Grid
                            item
                            md={12}
                            xs={12}
                          >
                            <Label color="#000" className={classes.labelForValue}>
                              Driver
                            </Label>
                            <AsyncSelect
                              className={classes.asyncSelect}
                              cacheOptions
                              loadOptions={loadOptionsOfDrivers}
                              defaultOptions
                              onInputChange={handleInputChange}
                              name="driver"
                              onChange={(opt) => handleAsyncSelectChangeDriver(opt, setFieldValue)}
                              placeholder={shipment.driver && shipment.driver.length > 0 ? buildCommaSeparatedString([shipment.driver[0].name, shipment.driver[0].phone]) : 'Unassigned'}
                              id="driver"
                            />
                          </Grid>
                          <Grid
                            item
                            md={12}
                            xs={12}
                          >
                            <Label color="#000" className={classes.labelForValue}>
                              Customer Representative
                            </Label>
                            <AsyncSelect
                              className={classes.asyncSelect}
                              cacheOptions
                              loadOptions={loadOptionsOfCustomerRepresentatives}
                              defaultOptions
                              onInputChange={handleInputChange}
                              name="customerRepresentative"
                              onChange={(opt) => handleAsyncSelectChangeCustomerRepresentative(opt, setFieldValue)}
                              placeholder={shipment.customerRepresentative && shipment.customerRepresentative.length > 0 ? buildCommaSeparatedString([shipment.customerRepresentative[0].name, shipment.customerRepresentative[0].email, shipment.customerRepresentative[0].phone]) : 'House'}
                              id="customerRepresentative"
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    spacing={3}
                  >
                    <Label color="#000" className={classes.labelForValue}>
                      Customer Notes
                    </Label>
                    <QuillEditor
                      className={classes.editor}
                      placeholder="Notes"
                      value={values.customerNote}
                      onChange={(value) => setFieldValue('customerNote', value)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    spacing={3}
                  >
                    <Label color="#000" className={classes.labelForValue}>
                      Internal Notes
                    </Label>
                    <QuillEditor
                      className={classes.editor}
                      placeholder="Notes"
                      value={values.internalNote}
                      onChange={(value) => setFieldValue('internalNote', value)}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    // spacing={3}
                  >
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <Typography
                          className={classes.itemLabelSecond}
                          variant="body2"
                          color="textSecondary"
                        >
                          Origin Address &gt;&gt;
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Company:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originCompany}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Apt, Suite, etc (optional):&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originAptSuite}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          City:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originAptSuite}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          State:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originState}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Country:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originCountry}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Zip/Postal code:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.originPostalCode}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    // spacing={3}
                  >
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <Typography
                          className={classes.itemLabelSecond}
                          variant="body2"
                          color="textSecondary"
                        >
                          Destination Address &gt;&gt;
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Company:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destCompany}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Apt, Suite, etc (optional):&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destAptSuite}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          City:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destCity}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          State:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destState}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Country:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destCountry}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.itemGrid}
                      >
                        <Typography
                          className={classes.itemLabel}
                          variant="body2"
                          color="textSecondary"
                        >
                          Zip/Postal code:&nbsp;
                        </Typography>
                        <Typography
                          className={classes.itemValue}
                          variant="body2"
                          color="textSecondary"
                        >
                          {shipment.destPostalCode}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={classes.editableTableButtonsWrapperGrid}
                  >
                    <Box className={classes.marginTopThree}>
                      <Label color="#000" className={classes.labelOne}>
                        Packing List
                      </Label>
                    </Box>
                    <Box className={classes.editableTableTopSide}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCreatePackingList}
                        className={classes.createPackingListBtn}
                      >
                        Create Packing List
                      </Button>
                      {/* {isReciverCreated && (
                        <Button
                          variant="contained"
                          color="secondary"
                          disabled
                          className={classes.createReceiverBtn}
                        >
                          Create Reciver
                        </Button>
                      )}
                      {!isReciverCreated && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleCreateReciver}
                          className={classes.createReceiverBtn}
                        >
                          Create Reciver
                        </Button>
                      )} */}
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={classes.editableTableWrapperGrid}
                  >
                    <Box className={classes.editableTableWrapper}>
                      <EditableTable
                        columns={columns}
                        data={editableTableData}
                        updateMyData={(rowIndex, columnId, value) => updateMyData(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageReset}
                        handleDeleteRow={handleDeleteRow}
                        selectMyData={selectMyData}
                        onSelectClick={setModalWHSelectCreateIsOpenToTrue}
                      />
                      <Button
                        variant="contained"
                        color="default"
                        onClick={addMore}
                        className={classes.addMoreButton}
                      >
                        Add More
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={clsx(classes.editableTableWrapperGrid, classes.marginTopThree)}
                  >
                    <Box className={classes.marginTopFour}>
                      <Label color="#000" className={classes.labelOne}>
                        Service Package
                      </Label>
                    </Box>
                    <Box className={classes.editableTableWrapper}>
                      <NonEditableTable
                        columns={columnsWithSelect}
                        data={editableTableDataWithSelect}
                        updateMyData={(rowIndex, columnId, value) => updateMyDataWithSelect(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageResetWithSelect}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={clsx(classes.editableTableWrapperGrid, classes.marginTopOne)}
                  >
                    <Box className={classes.marginTopTwo}>
                      <Label color="#000" className={classes.labelOne}>
                        Vendor
                      </Label>
                    </Box>
                    <Box className={classes.editableTableWrapper}>
                      <NonEditableTable
                        columns={columnsWithSelectVendor}
                        data={editableTableDataWithSelectVendor}
                        updateMyData={(rowIndex, columnId, value) => updateMyDataWithSelectVendor(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageResetWithSelectVendor}
                        columnWidths={columnWidths}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={clsx(classes.editableTableWrapperGrid, classes.marginTopOne)}
                  >
                    <Box className={classes.marginTopTwo}>
                      <Label color="#000" className={classes.labelOne}>
                        Photos
                      </Label>
                    </Box>
                    <Box className={classes.editableTableWrapper}>
                      <EditableTablePhoto
                        columns={columnsPhoto}
                        columnWidths={columnWidthsPhoto}
                        data={editableTableDataPhoto}
                        updateMyData={(rowIndex, columnId, value) => updateMyDataPhoto(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageResetPhoto}
                        handleDeleteRow={handleDeleteRowPhoto}
                        selectMyData={selectMyDataPhoto}
                        onSelectClick={setModalPhotoSelectCreateIsOpenToTrue}
                        onPhotoViewClick={setModalPhotoViewSelectCreateIsOpenToTrue}
                      />
                      <Button
                        variant="contained"
                        color="default"
                        onClick={addMorePhoto}
                        className={classes.addMoreButtonPhoto}
                      >
                        Add More
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        )}
      </Formik>

      <Modal
        isOpen={modalPackingListIsOpen}
        className={classes.popupModalPackingList}
      >
        <Box className={classes.popupPackingListHeadeBox}>
          <Button onClick={setModalPackingListIsOpenToFalse} className={classes.popupPackingListCloseButton}>X</Button>
          <h3 className={classes.popupPackingListTitle}>Select Inventories</h3>
        </Box>
        <Box className={classes.popupContent}>
          <Box
            className={classes.popupPackingListContentTop}
          >
            <Button
              variant="contained"
              color="secondary"
              // type="submit"
              onClick={handleImportInventory}
              className={classes.popupPackingListSelectBtn}
            >
              Import Inventory
            </Button>
          </Box>
          <InventoryListResults
            isPopup
            setImportedInventories={setImportedInventories}
            unsetImportedInventories={unsetImportedInventories}
          />
        </Box>
      </Modal>

      <Modal
        isOpen={modalWHSelectCreateIsOpen}
        className={classes.popupModal}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalWHSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Select a Warehouse</h3>
        </Box>
        <br />
        <Box className={classes.popupContent}>
          <AsyncSelect
            className={classes.asyncSelectWH}
            cacheOptions
            loadOptions={loadOptionsOfWarehouses}
            defaultOptions
            onInputChange={handleInputChange}
            name="warehouseLst"
            // onChange={(opt) => handleAsyncSelectChange(opt, setFieldValue)}
            placeholder="Select Warehouse ..."
            id="warehouseLst"
            itemCount={10}
            onChange={handleAsyncSelectChangeWH}
          />
          <Box
            className={classes.popupContentBottom}
          >
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={onSelectWH}
              className={classes.popupSelectBtn}
            >
              Select
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        isOpen={modalPhotoSelectCreateIsOpen}
        className={classes.popupModalPhoto}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalPhotoSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Photo Details</h3>
        </Box>
        <Box
          className={classes.popupContentBottom}
        >
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={onSelectPhoto}
            className={classes.popupSelectBtn}
          >
            Update
          </Button>
        </Box>
        <br />
        <Box className={classes.popupContent}>
          <DateTimePicker
            fullWidth
            inputVariant="outlined"
            label="Date & Time"
            name="dateTime"
            format="MM/DD/YYYY HH:mm:ss"
            // onClick={() => setFieldTouched('dateTime')}
            onChange={(date) => setPhotoDateTime(date)}
            value={photoDateTime}
            className={classes.photoDateTime}
          />
          <TextField
            // error={Boolean(touched.description && errors.description)}
            fullWidth
            // helperText={touched.description && errors.description}
            label="Description"
            name="description"
            // onBlur={handleBlur}
            onChange={(event) => setPhotoDescription(event.target.value)}
            value={photoDescription}
            variant="outlined"
            className={clsx(classes.zIndex0, classes.photoDescription)}
          />
          <Box>
            <div>
              <form ref={form} onSubmit={handleSubmission}>
                <input type="file" id="avatarFile" ref={avatarInputFile} style={{ display: 'none' }} onChange={changeHandler} />
                <div>
                  <Button type="submit" id="formSubmit" ref={formSubmit} style={{ display: 'none' }}>Submit</Button>
                  <Button type="reset" id="formReset" ref={formReset} style={{ display: 'none' }}>Reset</Button>
                </div>
              </form>
            </div>
          </Box>
          <Box className={classes.photoImageContainer}>
            <Avatar
              className={photoPhotoURL === '' ? classes.avatar : classes.avatarTwo}
              onMouseEnter={() => {
                setAvatarHover(true);
              }}
              onMouseLeave={() => {
                setAvatarHover(false);
              }}
              src={photoPhotoURL}
              onClick={() => {
                if (photoPhotoURL === '') {
                  avatarInputFile.current.click();
                }
              }}
              width="100%"
            >
              {!isPhotoUploading && (
                <span>Upload</span>
              )}
              {isPhotoUploading && (
                <span>Uploading photo ...</span>
              )}
            </Avatar>
            {/* <Button
              fullWidth
              variant="text"
              onClick={() => { formSubmit.current.click(); }}
            >
              Upload Picture
            </Button> */}
          </Box>
        </Box>
      </Modal>

      <Modal
        isOpen={modalPhotoViewSelectCreateIsOpen}
        className={classes.popupModalPhotoView}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalPhotoViewSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Photo View</h3>
        </Box>
        <br />
        <Box className={classes.popupContentPhotoView}>
          <img
            src={photoPhotoURLForView}
            alt=""
            className={classes.imgPhotoView}
          />
        </Box>
      </Modal>
    </>
  );
}

ShipmentInfo.propTypes = {
  className: PropTypes.string,
  shipment: PropTypes.object.isRequired,
  setShipment: PropTypes.func,
};

export default ShipmentInfo;
