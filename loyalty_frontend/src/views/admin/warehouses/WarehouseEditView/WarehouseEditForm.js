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
  Divider,
  Grid,
  Switch,
  TextField,
  Typography,
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import { buildCommaSeparatedString } from 'src/utils/helper';

const useStyles = makeStyles(() => ({
  root: {},
  googlePlacesAutocomplete: {
    width: '100%',
    height: '100%',
    paddingLeft: '13px',
    fontSize: '16px',
    '& div[class$="-control"]': {
      height: '56px',
    },
    zIndex: 10,
  }
}));

function WarehouseEditForm({
  className,
  warehouse,
  ...rest
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [address, setAddress] = useState();
  const [setFieldValueFunc, setSetFieldValueFunc] = useState(() => {});

  const changePlaceHolderOfGPA = () => {
    const elems = document.querySelectorAll("div[class*='-placeholder']");
    if (elems.length >= 1) {
      if (elems[0].innerHTML === 'Select...') {
        elems[0].innerHTML = 'Begin typing address here...';
      }
    }
  };

  useEffect(() => {
    changePlaceHolderOfGPA();
    setInterval(() => changePlaceHolderOfGPA(), 200);
  }, []);

  const getAddressObject = (address_components, fullAddr) => {
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
      for (let shouldBe in ShouldBeComponent) {
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
    console.log(rtn_address);
    setFieldValueFunc('aptSuite', '');
    setFieldValueFunc('city', '');
    setFieldValueFunc('state', '');
    setFieldValueFunc('country', '');
    setFieldValueFunc('postalCode', '');

    setFieldValueFunc('aptSuite', rtn_address.address);
    setFieldValueFunc('city', rtn_address.city);
    setFieldValueFunc('state', rtn_address.state);
    setFieldValueFunc('country', rtn_address.country);
    setFieldValueFunc('postalCode', rtn_address.postal_code);
    setFieldValueFunc('fullAddr', fullAddr);
    return rtn_address;
  };

  useEffect(() => {
    const func = async () => {
      const geocodeObj = address
        && address.value
        && (await geocodeByPlaceId(address.value.place_id));
      const fullAddr = address && address.label;
      const addressObject = geocodeObj
        && getAddressObject(geocodeObj[0].address_components, fullAddr);
    };
    func();
  }, [address]);

  return (
    <Formik
      initialValues={warehouse}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Name is required'),
        fullAddr: Yup.string().max(255),
        aptSuite: Yup.string().max(255),
        city: Yup.string().max(255),
        state: Yup.string().max(255),
        country: Yup.string().max(255),
        postalCode: Yup.string().max(255),
        contactName: Yup.string().max(255).required('Contact Name is required'),
        contactEmail: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        contactPhone: Yup.string().max(15),
        isDefault: Yup.bool()
      })}
      onSubmit={async (values, {
        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const arrAddress = [values.aptSuite, values.city, values.state, values.country];
          values.fullAddr = buildCommaSeparatedString(arrAddress);

          const response = await axios.put(`${API_BASE_URL}/admin/warehouse/${warehouse.id}`, values);

          setStatus({ success: response.data.status });
          setSubmitting(false);
          enqueueSnackbar('Warehouse updated', {
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
        touched,
        values,
        setFieldValue
      }) => (
        <form
          className={clsx(classes.root, className)}
          onSubmit={handleSubmit}
          {...rest}
        >
          <input type="hidden" value={values.fullAddr} name="fullAddr" />
          <Card>
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Warehouse Name"
                    name="name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.contactName && errors.contactName)}
                    fullWidth
                    helperText={touched.contactName && errors.contactName}
                    label="Contact name"
                    name="contactName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.contactName}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.contactEmail && errors.contactEmail)}
                    fullWidth
                    helperText={touched.contactEmail && errors.contactEmail}
                    label="Contact Email address"
                    name="contactEmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.contactEmail}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.contactPhone && errors.contactPhone)}
                    fullWidth
                    helperText={touched.contactPhone && errors.contactPhone}
                    label="Contact Phone number"
                    name="contactPhone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.contactPhone}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                />
                <Grid item />
                <Grid
                  item
                  md={6}
                  xs={12}
                  className={classes.googlePlacesAutocomplete}
                >
                  <Divider />
                  <GooglePlacesAutocomplete
                    placeholder="Address >>"
                    apiKey="AIzaSyCQSVnawfZJbkOQTVpcMnhfFsxdsud3fps"
                    selectProps={{
                      isClearable: true,
                      // value: address,
                      onChange: (val) => {
                        setSetFieldValueFunc(() => setFieldValue);
                        setAddress(val);
                      }
                    }}
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.aptSuite && errors.aptSuite)}
                    fullWidth
                    helperText={touched.aptSuite && errors.aptSuite}
                    label="Apt, Suite, etc (optional)"
                    name="aptSuite"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.aptSuite}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.city && errors.city)}
                    fullWidth
                    helperText={touched.city && errors.city}
                    label="City"
                    name="city"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.city}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.state && errors.state)}
                    fullWidth
                    helperText={touched.state && errors.state}
                    label="State/Region"
                    name="state"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.state}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.country && errors.country)}
                    fullWidth
                    helperText={touched.country && errors.country}
                    label="Country"
                    name="country"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.country}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.postalCode && errors.postalCode)}
                    fullWidth
                    helperText={touched.postalCode && errors.postalCode}
                    label="Zip/Postal code"
                    name="postalCode"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.postalCode}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <Typography
                    variant="h5"
                    color="textPrimary"
                  >
                    Default Warehouse
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    Enabling this will automatically enable the warehouse as a default one
                  </Typography>
                  <Switch
                    checked={values.isDefault}
                    color="secondary"
                    edge="start"
                    name="isDefault"
                    onChange={handleChange}
                    value={values.isDefault}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Warehouse
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
}

WarehouseEditForm.propTypes = {
  className: PropTypes.string,
  warehouse: PropTypes.object.isRequired
};

export default WarehouseEditForm;
