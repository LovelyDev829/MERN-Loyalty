/* eslint-disable max-len */
import React, { useState } from 'react';
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
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import AsyncSelect from 'react-select/async';
import Label from 'src/components/Label';

const useStyles = makeStyles((theme) => ({
  root: {},
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
  descriptionLabel: {
    marginLeft: '15px',
    float: 'left',
    marginBottom: '10px',
  },
  descriptionValue: {
    fontSize: '15px',
  },
  labelForValue: {
    fontSize: '15px',
    textTransform: 'initial'
  },
  buttonWraper: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '10px',
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
  asyncSelectOnError: {
    height: '56px',
    minHeight: '56px',
    '&> div[class$="-control"]': {
      height: '56px',
      border: '1px solid red',
      '&> div[class$="-ValueContainer"]': {
        height: '56px',
      },
      '&:hover': {
        boxShadow: '0 0 0 1px red',
      }
    },
  },
  errorLabel: {
    background: 'transparent',
    textTransform: 'initial',
    marginTop: '3px',
  },
  displayNone: {
    display: 'none',
  },
  zIndex0: {
    zIndex: 0,
  },
  ShipmentIDValue: {
    fontSize: '15px',
  },
  ShipmentID: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
}));

const loadOptions = (inputValue, callback) => {
  axios.post(`${API_BASE_URL}/customer/easy-search`, { search_text: inputValue, page: '0', limit: '10' })
    .then((response) => {
      const options = [];
      for (let i = 0; i < response.data.customers.length; i++) {
        const element = response.data.customers[i];
        const option = {};
        option.value = element.id;
        option.label = (
          <div>
            {element.company}
            <br />
            {element.firstName}
            &nbsp;
            {element.lastName}
            ,
            {' '}
            {element.email}
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
        option.value = `${element.id}`;
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

export const UOMOptions = [
  {
    value: 'Pallet',
    label: 'Pallet'
  },
  {
    value: 'Cases',
    label: 'Cases'
  },
  {
    value: 'Pieces',
    label: 'Pieces'
  },
];
function InventoryCreateForm({
  className,
  isPopup = false,
  setModalIsOpenToFalse,
  ...rest
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  const [isCustomerEmpty, setIsCustomerEmpty] = useState(false);
  const [isWarehouseEmpty, setIsWarehouseEmpty] = useState(false);

  const handleAsyncSelectChange = (opt, setFieldValue) => {
    setFieldValue('customer', opt.value);
    setIsCustomerEmpty(false);
  };

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    return inputValue;
  };

  const handleAsyncSelectChangeWH = (opt, setFieldValue) => {
    setFieldValue('warehouse', opt.value);
    setIsWarehouseEmpty(false);
  };

  return (
    <Formik
      initialValues={{
        lglNumber: `LGL#${genRanHex(4)}`,
        pieces: 0,
        type: '',
        description: '',
        l: '',
        w: '',
        h: '',
        weight: '',
        itemNumber: '',
        UOM: 'Pallet',
        cases: 0,
      }}
      validationSchema={Yup.object().shape({
        description: Yup.string().max(255).required('Title is required'),
        pieces: Yup.number().test(
          'is-number',
          'invalid number',
          (value) => (`${value}`).match(/^[1-9]\d*$/),
        ),
        cases: Yup.number(),
      })}
      onSubmit={async (values, {
        // resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          if (values.customer === undefined) {
            setSubmitting(false);
            setIsCustomerEmpty(true);
            return;
          }

          setIsCustomerEmpty(false);

          if (values.warehouse === undefined) {
            setSubmitting(false);
            setIsWarehouseEmpty(true);
            return;
          }

          setIsWarehouseEmpty(false);

          const response = await axios.post(`${API_BASE_URL}/inventory`, values);

          setStatus({ success: response.data.status });
          setSubmitting(false);
          enqueueSnackbar('Inventory created', {
            variant: 'success',
            action: <Button>See all</Button>
          });

          if (!isPopup) {
            // history.push('/app/management/inventory');
          } else {
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
        // setFieldTouched,
        setFieldValue,
        touched,
        values
      }) => (
        <form
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <Card>
            <CardContent>
              <Box mt={2} className={classes.buttonWraper}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Inventory
                </Button>
              </Box>
              <Grid
                container
                spacing={2}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.ShipmentID}
                >
                  <Typography
                    className={classes.ShipmentIDLabel}
                    variant="body2"
                    color="textSecondary"
                  >
                    LGL Number:
                  </Typography>
                  <Label
                    className={classes.ShipmentIDValue}
                    color="#000"
                  >
                    {values.lglNumber}
                  </Label>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <AsyncSelect
                    className={isCustomerEmpty ? classes.asyncSelectOnError : classes.asyncSelect}
                    cacheOptions
                    loadOptions={loadOptions}
                    defaultOptions
                    // onInputChange={handleInputChange}
                    // value={values.customer}
                    name="customer"
                    onChange={(opt) => handleAsyncSelectChange(opt, setFieldValue)}
                    placeholder="Select Customer ..."
                    id="customer"
                  />
                  <Label
                    color="error"
                    className={isCustomerEmpty ? classes.errorLabel : classes.displayNone}
                  >
                    Please fill out this field.
                  </Label>
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <AsyncSelect
                    className={isWarehouseEmpty ? classes.asyncSelectOnError : classes.asyncSelectWH}
                    cacheOptions
                    loadOptions={loadOptionsOfWarehouses}
                    defaultOptions
                    // onInputChange={handleInputChange}
                    // value={values.customer}
                    name="warehouse"
                    onChange={(opt) => handleAsyncSelectChangeWH(opt, setFieldValue)}
                    placeholder="Select Warehouse ..."
                    id="warehouse"
                  />
                  <Label
                    color="error"
                    className={isWarehouseEmpty ? classes.errorLabel : classes.displayNone}
                  >
                    Please fill out this field.
                  </Label>
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.pieces && errors.pieces)}
                    fullWidth
                    helperText={touched.pieces && errors.pieces}
                    label="Pieces"
                    name="pieces"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.pieces}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.type && errors.type)}
                    fullWidth
                    helperText={touched.type && errors.type}
                    label="Type"
                    name="type"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.type}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.l && errors.l)}
                    fullWidth
                    helperText={touched.l && errors.l}
                    label="l"
                    name="l"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.l}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.w && errors.w)}
                    fullWidth
                    helperText={touched.w && errors.w}
                    label="w"
                    name="w"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.w}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.h && errors.h)}
                    fullWidth
                    helperText={touched.h && errors.h}
                    label="h"
                    name="h"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.h}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.weight && errors.weight)}
                    fullWidth
                    helperText={touched.weight && errors.weight}
                    label="Weight"
                    name="weight"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.weight}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.itemNumber && errors.itemNumber)}
                    fullWidth
                    helperText={touched.itemNumber && errors.itemNumber}
                    label="Item Number"
                    name="itemNumber"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.itemNumber}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={6}
                >
                  <TextField
                    label="UOM"
                    name="UOM"
                    select
                    SelectProps={{ native: true }}
                    value={values.UOM}
                    variant="outlined"
                    onChange={handleChange}
                    className={classes.typeSelect}
                  >
                    {UOMOptions.map((option) => (
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
                  xs={6}
                >
                  <TextField
                    error={Boolean(touched.cases && errors.cases)}
                    fullWidth
                    helperText={touched.cases && errors.cases}
                    label="Cases Per Pallet"
                    name="cases"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.cases}
                    variant="outlined"
                    className={classes.zIndex0}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
}

InventoryCreateForm.propTypes = {
  className: PropTypes.string,
  isPopup: PropTypes.bool,
  setModalIsOpenToFalse: PropTypes.func,
};

export default InventoryCreateForm;
