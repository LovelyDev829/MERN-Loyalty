/* eslint-disable no-empty */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete, {
  geocodeByPlaceId
} from 'react-google-places-autocomplete';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import { DateTimePicker } from '@material-ui/pickers';
import AsyncSelect from 'react-select/async';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import QuillEditor from 'src/components/QuillEditor';
import Label from 'src/components/Label';
import Modal from 'react-modal';
import {
  Clipboard as AddressAddIcon,
} from 'react-feather';
import {
  EditableTable, makeData, newRecord
} from 'src/components/EditableTable';
import {
  EditableTableWithSelect, makeDataWithSelect, newRecordWithSelect
} from 'src/components/EditableTableWithSelect';
import {
  EditableTableWithSelectVendor, makeDataWithSelectVendor, newRecordWithSelectVendor
} from 'src/components/EditableTableWithSelectVendor';
import { buildCommaSeparatedString } from 'src/utils/helper';
import InventoryListResults from '../InventoryListView/Results';

const useStyles = makeStyles((theme) => ({
  root: {},
  datePicker: {
    '& + &': {
      marginLeft: theme.spacing(2)
    },
    width: '100%'
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
  googlePlacesAutocompleteWrapper: {
    paddingLeft: '13px',
    fontSize: '16px',
    '& div[class$="-control"]': {
      height: '56px',
    },
    // zIndex: 10,
    display: 'flex',
    flexDirection: 'columns',
    justifyContent: 'space-between',
  },
  googlePlacesAutocomplete: {
    width: '100%',
  },
  googlePlacesAutocompleteItself: {
    zIndex: 0,
  },
  companyWrapper: {
    width: '90%',
  },
  companyWrapperParentGrid: {
    display: 'flex',
    flexDirection: 'columns',
    justifyContent: 'space-between',
  },
  addressIconWrapper: {
    cursor: 'pointer',
  },
  addressIcon: {
    marginTop: '13px',
    marginRight: '15px',
    marginLeft: '15px',
  },
  ShipmentID: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemLabel: {
    marginLeft: '15px',
  },
  itemValue: {
    fontSize: '15px',
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
  editableTableWrapperOfButtons: {
    display: 'flex',
    justifyContent: 'flex-begin',
    width: '100%',
    // paddingRight: '70px',
  },
  editableTableWrapperOfButtonsPopup: {
    display: 'flex',
    justifyContent: 'flex-end',
    // paddingRight: '20px',
  },
  buttonWraper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '0px',
    marginBottom: '15px',
  },
  displayNone: {
    display: 'none',
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
  zIndex0: {
    zIndex: 0,
  },
  asyncSelectAddress: {
    height: '56px',
    minHeight: '56px',
    '&> div[class$="-control"]': {
      height: '56px',
      '&> div[class$="-ValueContainer"]': {
        height: '56px'
      }
    },
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
  // Packing List
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
    marginTop: '60px !important',
  },
  marginTopThree: {
    marginTop: '40px !important',
    marginBottom: '-37px',
  },
  marginTopFour: {
    marginTop: '60px !important',
  },
  marginTopFive: {
    marginTop: '9px !important',
  },
  marginTopSix: {
    marginTop: '21px !important',
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
    left: '2206px',
    marginTop: '3px',
  },
  addMoreButtonWithSelect: {
    position: 'relative',
    left: '1102px',
    marginTop: '3px',
  },
  labelForValue: {
    fontSize: '13px',
    fontWeight: 500,
    textTransform: 'initial'
  },
}));

const sortOptions = [
  {
    value: '1',
    label: 'New'
  },
  {
    value: '2',
    label: 'In Progress'
  },
  {
    value: '3',
    label: 'Delivered'
  },
  {
    value: '4',
    label: 'Cancelled'
  }
];

const loadOptions = (inputValue, callback) => {
  axios.post(`${API_BASE_URL}/customer/easy-search`, { search_text: inputValue, page: '0', limit: '10' })
    .then((response) => {
      const options = [];
      // options.push({label: 'All Campaigns', value: '-2'});
      for (let i = 0; i < response.data.customers.length; i++) {
        const element = response.data.customers[i];
        const option = {};
        option.value = element.id;
        option.label = (
          `${element.company} (${element.firstName} ${element.lastName}, ${element.email})`
        );
        options.push(option);
      }
      callback(options);
    });
};

const loadOptionsOfServicePackages = (inputValue, callback) => {
  const data = {
    searchText: inputValue,
    page: 0,
    limit: 10,
    status: '1',
  };
  axios.post(`${API_BASE_URL}/admin/service-package/load`, data)
    .then((response) => {
      const options = [];
      for (let i = 0; i < response.data.servicePackages.length; i++) {
        const element = response.data.servicePackages[i];
        const option = {};
        option.value = `${element.unitPrice}***${element.description}`;
        option.label = (
          <div>
            desc:
            {' '}
            {element.description}
            , Unit Price:
            {' '}
            {element.unitPrice}
            {' '}
            {element.currency}
          </div>
        );
        options.push(option);
      }
      callback(options);
    });
};

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

const loadOptionsOfVendors = (inputValue, callback) => {
  const data = {
    searchText: inputValue,
    page: 0,
    limit: 10,
    status: '1',
  };
  axios.post(`${API_BASE_URL}/admin/vendor/load`, data)
    .then((response) => {
      const options = [];
      for (let i = 0; i < response.data.vendors.length; i++) {
        const element = response.data.vendors[i];
        const option = {};
        option.value = `${element.name}***${element.email}***${element.phone}***${element.fax}***${element.fullAddr}`;
        option.label = (
          <div>
            name:
            {' '}
            {element.name}
            , email:
            {' '}
            {element.email}
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

function ShipmentEditForm({
  className,
  shipment,
  customer,
  driver,
  customerRepresentative,
  isPopup,
  setModalIsOpenToFalse,
  type,
  ...rest
}) {
  const classes = useStyles();
  const [selectedOption, setSelectedOption] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  const handleSelectChange = (opt, setFieldValue) => {
    setFieldValue('customer', opt.value);
    setSelectedOption(selectedOption, opt.value);
  };

  const [addressOrigin, setAddressOrigin] = useState();
  const [addressDest, setAddressDest] = useState();
  const [setFieldValueFunc, setSetFieldValueFunc] = useState(() => {});

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

  const getAddressObject = (address_components, fullAddr, prefix) => {
    const ShouldBeComponent = {
      street_number: ['street_number'],
      postal_code: ['postal_code'],
      street: ['street_address', 'route'],
      province: [
        'administrative_area_level_1',
        'administrative_area_level_2',
        'administrative_area_level_3',
        'administrative_area_level_4',
        'administrative_area_level_5'
      ],
      city: [
        'locality',
        'sublocality',
        'sublocality_level_1',
        'sublocality_level_2',
        'sublocality_level_3',
        'sublocality_level_4'
      ],
      country: ['country']
    };

    const rtn_address = {
      street_number: '',
      postal_code: '',
      street: '',
      province: '',
      city: '',
      country: ''
    };

    address_components.forEach((component) => {
      for (const shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === 'country') {
            rtn_address[shouldBe] = component.short_name;
          } else {
            rtn_address[shouldBe] = component.long_name;
          }
        }
      }
    });

    // Fix the shape to match our schema
    rtn_address.address = `${rtn_address.street_number} ${rtn_address.street}`;
    // delete rtn_address.street_number;
    // delete rtn_address.street;
    if (rtn_address.country === 'US') {
      rtn_address.state = rtn_address.province;
      delete rtn_address.province;
    }
    // console.log(rtn_address);
    setFieldValueFunc(`${prefix}AptSuite`, '');
    setFieldValueFunc(`${prefix}City`, '');
    setFieldValueFunc(`${prefix}State`, '');
    setFieldValueFunc(`${prefix}Country`, '');
    setFieldValueFunc(`${prefix}PostalCode`, '');

    setFieldValueFunc(`${prefix}AptSuite`, rtn_address.address);
    setFieldValueFunc(`${prefix}City`, rtn_address.city);
    setFieldValueFunc(`${prefix}State`, rtn_address.state);
    setFieldValueFunc(`${prefix}Country`, rtn_address.country);
    setFieldValueFunc(`${prefix}PostalCode`, rtn_address.postal_code);
    setFieldValueFunc(`${prefix}FullAddr`, fullAddr);
    return rtn_address;
  };

  const changePlaceHolderOfGPA = () => {
    const elems = document.querySelectorAll("div[class*='-placeholder']");
    if (elems.length >= 3) {
      if (elems[1].innerHTML === 'Select...') {
        elems[1].innerHTML = 'Begin typing address here...';
      }
      if (elems[2].innerHTML === 'Select...') {
        elems[2].innerHTML = 'Begin typing address here...';
      }
    }
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

  const [editableTableData, setEditableTableData] = React.useState(() => makeData(columns, 7));
  const [skipPageReset, setSkipPageReset] = React.useState(false);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value, setFieldValue) => {
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
    // setFieldValue('packagesTableData', editableTableData);
  };

  const [status, setStatus] = useState(sortOptions[0].value);

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const addMore = () => {
    setEditableTableData([...editableTableData, newRecord(columns)]);
  };

  const handleSortChange = (event, setFieldValue) => {
    setFieldValue('status', event.target.value);
    setStatus(event.target.value);
  };

  /* Add address from popup */
  const [addressLstVal, setAddressLstVal] = useState('');
  const [addressSelectionType, setAddressSelectionType] = useState('');
  const loadOptionsOfAddresses = (inputValue, callback) => {
    const data = {
      searchText: inputValue,
      page: 0,
      limit: 10,
      status: '1',
    };
    axios.post(`${API_BASE_URL}/shipment/search-addresses`, data)
      .then((response) => {
        const options = [];
        for (let i = 0; i < response.data.shipments.length; i++) {
          const element = response.data.shipments[i];
          if (!element.originCompany) {
            element.originCompany = '';
          }
          if (!element.destCompany) {
            element.destCompany = '';
          }
          const option = {};
          if ((element.originCompany && element.originCompany.includes(inputValue))
          || element.originFullAddr.includes(inputValue)
          || element.originPostalCode.includes(inputValue)) {
            option.value = `${element.originCompany}***$$$${element.originAptSuite}***$$$${element.originCity}***$$$${element.originState}***$$$${element.originCountry}***$$$${element.originPostalCode}`;
            let labelVal = `${element.originCompany},${element.originAptSuite},${element.originCity},${element.originState},${element.originCountry},${element.originPostalCode}`;
            labelVal = labelVal.trim();
            labelVal = labelVal.replace(',,', ',');
            labelVal = labelVal.replace(',,', ',');
            labelVal = labelVal.replace(',,', ',');
            if (labelVal.startsWith(',')) {
              labelVal = labelVal.slice(1);
            }
            option.label = (
              <div>
                {labelVal}
              </div>
            );
          } else {
            option.value = `${element.destCompany}***$$$${element.destAptSuite}***$$$${element.destCity}***$$$${element.destState}***$$$${element.destCountry}***$$$${element.destPostalCode}`;
            option.label = (
              <div>
                {`${element.destCompany},${element.destAptSuite},${element.destCity},${element.destState},${element.destCountry},${element.destPostalCode}`}
              </div>
            );
          }

          if (element.originAptSuite.length < 1
            && element.originCity.length < 1
            && element.originState.length < 1
            && element.originCountry.length < 1
            && element.originPostalCode.length < 1
          ) {} else {
            options.push(option);
          }
        }
        callback(options);
      });
  };
  const [modalAddressSelectCreateIsOpen, setModalAddressSelectCreateIsOpen] = useState(false);
  const setModalAddressSelectCreateIsOpenToTrue = (addressType) => {
    setAddressSelectionType(addressType);
    setModalAddressSelectCreateIsOpen(true);
  };

  const setModalAddressSelectCreateIsOpenToFalse = () => {
    setModalAddressSelectCreateIsOpen(false);
    setAddressLstVal('');
    setAddressSelectionType('');
  };

  const onSelectAddress = () => {
    if (addressLstVal.length > 0) {
      const sArrTmp = addressLstVal.split('***$$$');

      setModalAddressSelectCreateIsOpenToFalse();

      if (addressSelectionType === 'origin') {
        setFieldValueFunc('originCompany', sArrTmp[0]);
        setFieldValueFunc('originAptSuite', sArrTmp[1]);
        setFieldValueFunc('originCity', sArrTmp[2]);
        setFieldValueFunc('originState', sArrTmp[3]);
        setFieldValueFunc('originCountry', sArrTmp[4]);
        setFieldValueFunc('originPostalCode', sArrTmp[5]);
      } else {
        setFieldValueFunc('destCompany', sArrTmp[0]);
        setFieldValueFunc('destAptSuite', sArrTmp[1]);
        setFieldValueFunc('destCity', sArrTmp[2]);
        setFieldValueFunc('destState', sArrTmp[3]);
        setFieldValueFunc('destCountry', sArrTmp[4]);
        setFieldValueFunc('destPostalCode', sArrTmp[5]);
      }
    } else {
      enqueueSnackbar('Select a Service Package from list', {
        variant: 'error',
      });
    }
  };

  const handleAsyncSelectChangeAddress = (opt) => {
    setAddressLstVal(opt.value);
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
      console.log('>>>editTableRowIdxBtnClickedWH, warehouseLstVal', editTableRowIdxBtnClickedWH, warehouseLstVal);
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

  // Vendor
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
  const [vendorLstVal, setVendorLstVal] = useState('');
  const [editTableRowIdxBtnClickedVendor, setEditTableRowIdxBtnClickedVendor] = useState(-1);

  const [editableTableDataWithSelectVendor, setEditableTableDataWithSelectVendor] = React.useState(() => makeData(columnsWithSelectVendor, 7));
  const [skipPageResetWithSelectVendor, setSkipPageResetWithSelectVendor] = React.useState(false);
  const updateMyDataWithSelectVendor = (rowIndex, columnId, value, setFieldValue) => {
    // We also turn on the flag to not reset the page
    setSkipPageResetWithSelectVendor(true);
    setEditableTableDataWithSelectVendor((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
    // setFieldValue('packagesTableData', editableTableData);
  };

  const selectMyDataWithSelectVendor = (rowIndex, columnId) => {
    setSkipPageResetWithSelectVendor(true);
    try {
      return editableTableDataWithSelectVendor[rowIndex][columnId];
    } catch {
      return '';
    }
  };

  const updateMyDataWithSelectFromPopupVendor = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageResetWithSelectVendor(true);
    setEditableTableDataWithSelectVendor((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };
  const addMoreWithSelectVendor = () => {
    setEditableTableDataWithSelectVendor([...editableTableDataWithSelectVendor, newRecordWithSelectVendor(columnsWithSelectVendor)]);
  };
  const [modalVendorSelectCreateIsOpen, setModalVendorSelectCreateIsOpen] = useState(false);
  const setModalVendorSelectCreateIsOpenToTrue = (index) => {
    setEditTableRowIdxBtnClickedVendor(index);
    setModalVendorSelectCreateIsOpen(true);
  };

  const setModalVendorSelectCreateIsOpenToFalse = () => {
    setModalVendorSelectCreateIsOpen(false);
    setVendorLstVal('');
  };

  const onSelectVendor = () => {
    if (vendorLstVal.length > 0) {
      const sArrTmp = vendorLstVal.split('***');
      const sName = sArrTmp[0];
      const sEmail = sArrTmp[1];
      const sPhone = sArrTmp[2];
      const sFax = sArrTmp[3];
      const sAddress = sArrTmp[4];
      setModalVendorSelectCreateIsOpenToFalse();
      updateMyDataWithSelectFromPopupVendor(editTableRowIdxBtnClickedVendor, 'name', sName);
      updateMyDataWithSelectFromPopupVendor(editTableRowIdxBtnClickedVendor, 'email', sEmail);
      updateMyDataWithSelectFromPopupVendor(editTableRowIdxBtnClickedVendor, 'phone', sPhone);
      updateMyDataWithSelectFromPopupVendor(editTableRowIdxBtnClickedVendor, 'fax', sFax);
      updateMyDataWithSelectFromPopupVendor(editTableRowIdxBtnClickedVendor, 'address', sAddress);
    } else {
      enqueueSnackbar('Select a Vendor from list', {
        variant: 'error',
      });
    }
  };

  const handleAsyncSelectChangeVendor = (opt) => {
    setVendorLstVal(opt.value);
  };

  // service package
  const [servicePackageLstVal, setServicePackageLstVal] = useState('');
  const [editTableRowIdxBtnClicked, setEditTableRowIdxBtnClicked] = useState(-1);
  const [editableTableDataWithSelect, setEditableTableDataWithSelect] = React.useState(() => makeData(columnsWithSelect, 7));
  const [skipPageResetWithSelect, setSkipPageResetWithSelect] = React.useState(false);
  const updateMyDataWithSelect = (rowIndex, columnId, value, setFieldValue) => {
    // We also turn on the flag to not reset the page
    setSkipPageResetWithSelect(true);

    if (shipment.type === '2' && columnId === 'total') {
      console.log('>>> updateMyDataWithSelect() called!');
      let sumOfTotal = 0.0;
      for (let idx = 0; idx < editableTableDataWithSelect.length; idx++) {
        let tmpValue = editableTableDataWithSelect[idx].total;
        if (idx === rowIndex) {
          tmpValue = value;
        }

        sumOfTotal += isNaN(parseFloat(tmpValue)) ? 0 : parseFloat(tmpValue);
        console.log('>>> sumOfTotal', sumOfTotal);
      }
      setFieldValue('price', sumOfTotal);
    }

    setEditableTableDataWithSelect((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };

  const selectMyDataWithSelect = (rowIndex, columnId) => {
    setSkipPageResetWithSelect(true);
    return editableTableDataWithSelect[rowIndex][columnId];
  };

  const updateMyDataWithSelectFromPopup = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageResetWithSelect(true);
    setEditableTableDataWithSelect((old) => old.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...old[rowIndex],
          [columnId]: value,
        };
      }
      return row;
    }));
  };
  const addMoreWithSelect = () => {
    setEditableTableDataWithSelect([...editableTableDataWithSelect, newRecordWithSelect(columnsWithSelect)]);
  };
  const [modalSPSelectCreateIsOpen, setModalSPSelectCreateIsOpen] = useState(false);
  const setModalSPSelectCreateIsOpenToTrue = (index) => {
    setEditTableRowIdxBtnClicked(index);
    setModalSPSelectCreateIsOpen(true);
  };

  const setModalSPSelectCreateIsOpenToFalse = () => {
    setModalSPSelectCreateIsOpen(false);
    setServicePackageLstVal('');
  };

  const onSelectSP = () => {
    if (servicePackageLstVal.length > 0) {
      const sArrTmp = servicePackageLstVal.split('***');
      const sDesc = sArrTmp[1];
      const sUnitPrice = sArrTmp[0];
      const fUnitPrice = parseFloat(sUnitPrice);
      const sQty = selectMyDataWithSelect(editTableRowIdxBtnClicked, 'qty');
      const fQty = parseFloat(sQty);

      setModalSPSelectCreateIsOpenToFalse();
      updateMyDataWithSelectFromPopup(editTableRowIdxBtnClicked, 'description', sDesc);
      updateMyDataWithSelectFromPopup(editTableRowIdxBtnClicked, 'unitPrice', sUnitPrice);
      if (!isNaN(fUnitPrice) && !isNaN(fQty)) {
        updateMyDataWithSelectFromPopup(editTableRowIdxBtnClicked, 'total', (fQty * fUnitPrice).toString());
      }
    } else {
      enqueueSnackbar('Select a Service Package from list', {
        variant: 'error',
      });
    }
  };

  const handleAsyncSelectChangeSP = (opt) => {
    setServicePackageLstVal(opt.value);
  };

  const handleDeleteRowWithSelect = (rowIndex) => {
    setSkipPageReset(true);
    const oldData = editableTableDataWithSelect.slice(0);
    oldData.splice(rowIndex, 1);
    setEditableTableDataWithSelect(oldData);
  };

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset

  useEffect(() => {
    changePlaceHolderOfGPA();
    setInterval(() => changePlaceHolderOfGPA(), 200);
  }, []);

  useEffect(() => {
    const funcOrigin = async () => {
      const geocodeObj = addressOrigin
        && addressOrigin.value
        && (await geocodeByPlaceId(addressOrigin.value.place_id));
      const fullAddr = addressOrigin && addressOrigin.label;
      const addressObject = geocodeObj
        && getAddressObject(geocodeObj[0].address_components, fullAddr, 'origin');
    };
    const funcDest = async () => {
      const geocodeObj = addressDest
        && addressDest.value
        && (await geocodeByPlaceId(addressDest.value.place_id));
      const fullAddr = addressDest && addressDest.label;
      const addressObject = geocodeObj
        && getAddressObject(geocodeObj[0].address_components, fullAddr, 'dest');
    };

    funcOrigin();
    funcDest();
  }, [addressOrigin, addressDest]);

  React.useEffect(() => {
    setSkipPageReset(false);
  }, [editableTableData]);

  // editing it, the page is reset
  React.useEffect(() => {
    if (shipment.packagesTableData) {
      setEditableTableData(shipment.packagesTableData);
    }
    if (shipment.packagesTableDataSP) {
      setEditableTableDataWithSelect(shipment.packagesTableDataSP);
    }
    if (shipment.vendorsTableData) {
      setEditableTableDataWithSelectVendor(shipment.vendorsTableData);
    }
    setStatus(shipment.status);
  }, []);

  return (
    <>
      <Formik
        initialValues={shipment}
        validationSchema={Yup.object().shape({
          title: Yup.string().max(255).required('Title is required'),
          customerNote: Yup.string().max(255),
          internalNote: Yup.string().max(255),
          dueStart: Yup.date(),
          dueEnd: Yup.date(),
          originCompany: Yup.string().max(255),
          originFullAddr: Yup.string().max(255),
          originAptSuite: Yup.string().max(255),
          originCity: Yup.string().max(255),
          originState: Yup.string().max(255),
          originCountry: Yup.string().max(255),
          originPostalCode: Yup.string().max(255),
          destCompany: Yup.string().max(255),
          destFullAddr: Yup.string().max(255),
          destAptSuite: Yup.string().max(255),
          destCity: Yup.string().max(255),
          destState: Yup.string().max(255),
          destCountry: Yup.string().max(255),
          destPostalCode: Yup.string().max(255),
          isActive: Yup.bool(),
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
          setErrors,
          setStatus,
          setSubmitting
        }) => {
          try {
            values.packagesTableData = editableTableData;
            values.packagesTableDataSP = editableTableDataWithSelect;

            const arrOrigin = [values.originAptSuite, values.originCity, values.originState, values.originCountry];
            values.originFullAddr = buildCommaSeparatedString(arrOrigin);

            const arrDest = [values.destAptSuite, values.destCity, values.destState, values.destCountry];
            values.destFullAddr = buildCommaSeparatedString(arrDest);

            values.vendorsTableData = editableTableDataWithSelectVendor;

            const response = await axios.put(`${API_BASE_URL}/shipment/${shipment.id}`, values);

            setStatus({ success: response.data.status });
            setSubmitting(false);
            enqueueSnackbar(type === '1' ? 'Shipment updated' : 'Service updated', {
              variant: 'success',
              action: <Button>See all</Button>
            });
            if (isPopup) {
              setModalIsOpenToFalse();
            }
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
            <Card>
              <CardContent>
                <Box mt={2} className={classes.buttonWraper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {type === '1' ? 'Update Shipment' : 'Update Service'}
                  </Button>
                </Box>
                <Grid
                  container
                  spacing={3}
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
                        spacing={3}
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
                            className={classes.ShipmentID}
                          >
                            <Typography
                              className={classes.itemLabel}
                              variant="body2"
                              color="textSecondary"
                            >
                              {type === '1' ? 'Shipment ID:' : 'Service ID:'}
                            </Typography>
                            <Label
                              className={classes.itemValue}
                              color="#000"
                            >
                              {values.title}
                            </Label>
                          </Grid>
                          <Grid
                            item
                            md={12}
                            xs={12}
                          >
                            <AsyncSelect
                              className={classes.asyncSelect}
                              cacheOptions
                              loadOptions={loadOptions}
                              defaultOptions
                              value={values.customer.vaule}
                              onChange={(opt) => handleSelectChange(opt, setFieldValue)}
                              // placeholder="Select Customer ..."
                              placeholder={`${customer.company} (${customer.firstName} ${customer.lastName}, ${customer.email})`}
                            />
                          </Grid>
                          <Grid
                            item
                            md={6}
                            xs={12}
                          >
                            <TextField
                              label="Current Status"
                              name="sort"
                              select
                              onChange={(event) => handleSortChange(event, setFieldValue)}
                              SelectProps={{ native: true }}
                              variant="outlined"
                              value={status}
                              className={clsx(classes.zIndex0, classes.marginTopTen)}
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
                              className={clsx(classes.zIndex0, classes.marginTopTen)}
                              inputProps={
                                { readOnly: values.type === '2', }
                              }
                            />
                          </Grid>
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
                        spacing={3}
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
                              color="#000"
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
                              placeholder={driver !== '' ? buildCommaSeparatedString([driver.name, driver.phone]) : 'Unassigned'}
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
                              placeholder={customerRepresentative !== '' ? buildCommaSeparatedString([customerRepresentative.name, customerRepresentative.email, customerRepresentative.phone]) : 'House'}
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
                    spacing={3}
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
                        <Label color="#000">
                          Origin Address &gt;&gt;
                        </Label>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.companyWrapperParentGrid}
                      >
                        <Box
                          className={classes.companyWrapper}
                        >
                          <TextField
                            error={Boolean(touched.originCompany && errors.originCompany)}
                            fullWidth
                            helperText={touched.originCompany && errors.originCompany}
                            label="Company"
                            name="originCompany"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.originCompany}
                            variant="outlined"
                            className={classes.zIndex0}
                          />
                        </Box>
                        <Box
                          className={classes.addressIconWrapper}
                          onClick={() => {
                            setSetFieldValueFunc(() => setFieldValue);
                            setModalAddressSelectCreateIsOpenToTrue('origin');
                          }}
                        >
                          <AddressAddIcon
                            className={classes.addressIcon}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.googlePlacesAutocompleteWrapper}
                      >
                        <Box
                          className={classes.googlePlacesAutocomplete}
                        >
                          <GooglePlacesAutocomplete
                            placeholder='Origin Address >>'
                            // className={classes.googlePlacesAutocompleteItself}
                            apiKey="AIzaSyCQSVnawfZJbkOQTVpcMnhfFsxdsud3fps"
                            selectProps={{
                              isClearable: true,
                              // value: address,
                              onChange: (val) => {
                                setSetFieldValueFunc(() => setFieldValue);
                                setAddressOrigin(val);
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.originAptSuite && errors.originAptSuite)}
                          fullWidth
                          helperText={touched.originAptSuite && errors.originAptSuite}
                          label="Apt, Suite, etc (optional)"
                          name="originAptSuite"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originAptSuite}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.originCity && errors.originCity)}
                          fullWidth
                          helperText={touched.originCity && errors.originCity}
                          label="City"
                          name="originCity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originCity}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.originState && errors.originState)}
                          fullWidth
                          helperText={touched.originState && errors.originState}
                          label="State/Region"
                          name="originState"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originState}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.originCountry && errors.originCountry)}
                          fullWidth
                          helperText={touched.originCountry && errors.originCountry}
                          label="Country"
                          name="originCountry"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originCountry}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.originPostalCode && errors.originPostalCode)}
                          fullWidth
                          helperText={touched.originPostalCode && errors.originPostalCode}
                          label="Zip/Postal code"
                          name="originPostalCode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.originPostalCode}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
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
                    <Grid
                      container
                      spacing={3}
                    >
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <Label color="#000">
                          Destination Address &gt;&gt;
                        </Label>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.companyWrapperParentGrid}
                      >
                        <Box
                          className={classes.companyWrapper}
                        >
                          <TextField
                            error={Boolean(touched.destCompany && errors.destCompany)}
                            fullWidth
                            helperText={touched.destCompany && errors.destCompany}
                            label="Company"
                            name="destCompany"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.destCompany}
                            variant="outlined"
                            className={classes.zIndex0}
                          />
                        </Box>
                        <Box
                          className={classes.addressIconWrapper}
                          onClick={() => {
                            setSetFieldValueFunc(() => setFieldValue);
                            setModalAddressSelectCreateIsOpenToTrue('dest');
                          }}
                        >
                          <AddressAddIcon
                            className={classes.addressIcon}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                        className={classes.googlePlacesAutocompleteWrapper}
                      >
                        <Box
                          className={classes.googlePlacesAutocomplete}
                        >
                          <GooglePlacesAutocomplete
                            placeholder="Dest Address >>"
                            apiKey="AIzaSyCQSVnawfZJbkOQTVpcMnhfFsxdsud3fps"
                            className={classes.googlePlacesAutocompleteItself}
                            selectProps={{
                              isClearable: true,
                              // value: address,
                              onChange: (val) => {
                                setSetFieldValueFunc(() => setFieldValue);
                                setAddressDest(val);
                              }
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.destAptSuite && errors.destAptSuite)}
                          fullWidth
                          helperText={touched.destAptSuite && errors.destAptSuite}
                          label="Apt, Suite, etc (optional)"
                          name="destAptSuite"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destAptSuite}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.destCity && errors.destCity)}
                          fullWidth
                          helperText={touched.destCity && errors.destCity}
                          label="City"
                          name="destCity"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destCity}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.destState && errors.destState)}
                          fullWidth
                          helperText={touched.destState && errors.destState}
                          label="State/Region"
                          name="destState"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destState}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.destCountry && errors.destCountry)}
                          fullWidth
                          helperText={touched.destCountry && errors.destCountry}
                          label="Country"
                          name="destCountry"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destCountry}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
                      </Grid>
                      <Grid
                        item
                        md={12}
                        xs={12}
                      >
                        <TextField
                          error={Boolean(touched.destPostalCode && errors.destPostalCode)}
                          fullWidth
                          helperText={touched.destPostalCode && errors.destPostalCode}
                          label="Zip/Postal code"
                          name="destPostalCode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.destPostalCode}
                          variant="outlined"
                          className={classes.zIndex0}
                        />
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
                    <Box className={clsx(classes.editableTableTopSide, classes.marginTopOne)}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCreatePackingList}
                        className={classes.createPackingListBtn}
                      >
                        Create Packing List
                      </Button>
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
                        selectMyData={selectMyData}
                        onSelectClick={setModalWHSelectCreateIsOpenToTrue}
                        handleDeleteRow={handleDeleteRow}
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
                    className={classes.editableTableWrapperGrid}
                  >
                    <Box className={classes.marginTopFour}>
                      <Label color="#000" className={classes.labelOne}>
                        Service Package
                      </Label>
                    </Box>
                    <Box className={clsx(classes.editableTableWrapperWithSelect, classes.marginTopOne)}>
                      <EditableTableWithSelect
                        columns={columnsWithSelect}
                        data={editableTableDataWithSelect}
                        updateMyData={(rowIndex, columnId, value) => updateMyDataWithSelect(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageResetWithSelect}
                        onSelectClick={setModalSPSelectCreateIsOpenToTrue}
                        selectMyData={selectMyDataWithSelect}
                        handleDeleteRow={handleDeleteRowWithSelect}
                      />
                      <Button
                        variant="contained"
                        color="default"
                        onClick={addMoreWithSelect}
                        className={classes.addMoreButtonWithSelect}
                      >
                        Add More
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container>
                  <Grid
                    item
                    className={classes.editableTableWrapperGrid}
                  >
                    <Box className={classes.marginTopTwo}>
                      <Label color="#000" className={classes.labelOne}>
                        Vendor
                      </Label>
                    </Box>
                    <Box className={clsx(classes.editableTableWrapperWithSelect, classes.marginTopOne)}>
                      <EditableTableWithSelectVendor
                        columns={columnsWithSelectVendor}
                        data={editableTableDataWithSelectVendor}
                        updateMyData={(rowIndex, columnId, value) => updateMyDataWithSelectVendor(rowIndex, columnId, value, setFieldValue)}
                        skipPageReset={skipPageResetWithSelectVendor}
                        onSelectClick={setModalVendorSelectCreateIsOpenToTrue}
                        selectMyData={selectMyDataWithSelectVendor}
                      />
                      <Button
                        variant="contained"
                        color="default"
                        onClick={addMoreWithSelectVendor}
                        className={classes.addMoreButtonWithSelectVendor}
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
        isOpen={modalAddressSelectCreateIsOpen}
        className={classes.popupModal}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalAddressSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Select an address</h3>
        </Box>
        <br />
        <Box className={classes.popupContent}>
          <AsyncSelect
            className={classes.asyncSelectAddress}
            cacheOptions
            loadOptions={loadOptionsOfAddresses}
            defaultOptions
            onInputChange={handleInputChange}
            name="addressLst"
            placeholder="Select Address ..."
            id="addressLst"
            itemCount={10}
            onChange={handleAsyncSelectChangeAddress}
          />
          <Box
            className={classes.popupContentBottom}
          >
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={onSelectAddress}
              className={classes.popupSelectBtn}
            >
              Select
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal
        isOpen={modalSPSelectCreateIsOpen}
        className={classes.popupModal}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalSPSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Select a Service Package</h3>
        </Box>
        <br />
        <Box className={classes.popupContent}>
          <AsyncSelect
            className={classes.asyncSelectSP}
            cacheOptions
            loadOptions={loadOptionsOfServicePackages}
            defaultOptions
            onInputChange={handleInputChange}
            name="servicePackageLst"
            // onChange={(opt) => handleAsyncSelectChange(opt, setFieldValue)}
            placeholder="Select Service Package ..."
            id="servicePackageLst"
            itemCount={10}
            onChange={handleAsyncSelectChangeSP}
          />
          <Box
            className={classes.popupContentBottom}
          >
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={onSelectSP}
              className={classes.popupSelectBtn}
            >
              Select
            </Button>
          </Box>
        </Box>
      </Modal>

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
        isOpen={modalVendorSelectCreateIsOpen}
        className={classes.popupModal}
      >
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalVendorSelectCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Select a Vendor</h3>
        </Box>
        <br />
        <Box className={classes.popupContent}>
          <AsyncSelect
            className={classes.asyncSelectVendor}
            cacheOptions
            loadOptions={loadOptionsOfVendors}
            defaultOptions
            onInputChange={handleInputChange}
            name="vendorLst"
            // onChange={(opt) => handleAsyncSelectChange(opt, setFieldValue)}
            placeholder="Select Vendor ..."
            id="vendorLst"
            itemCount={10}
            onChange={handleAsyncSelectChangeVendor}
          />
          <Box
            className={classes.popupContentBottom}
          >
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              onClick={onSelectVendor}
              className={classes.popupSelectBtn}
            >
              Select
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

ShipmentEditForm.propTypes = {
  className: PropTypes.string,
  shipment: PropTypes.object,
  customer: PropTypes.object,
  driver: PropTypes.object,
  customerRepresentative: PropTypes.object,
  isPopup: PropTypes.bool,
  setModalIsOpenToFalse: PropTypes.func,
  type: PropTypes.string,
};

export default ShipmentEditForm;
