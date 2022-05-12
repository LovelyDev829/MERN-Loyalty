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

function CustomerEditForm({
  className,
  customer,
  ...rest
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [address, setAddress] = useState();
  const [setFieldValueFunc, setSetFieldValueFunc] = useState(() => {});

  useEffect(() => {
    const elems = document.querySelectorAll("div[class*='-placeholder']");
    if (elems.length >= 1) {
      elems[0].innerHTML = 'Begin typing address here...';
    }
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
      initialValues={{
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        company: customer.company || '',
        email: customer.email || '',
        phone: customer.phone || '',
        fax: customer.fax || '',
        fullAddr: customer.fullAddr || '',
        aptSuite: customer.aptSuite || '',
        city: customer.city || '',
        state: customer.state || '',
        country: customer.country || '',
        postalCode: customer.postalCode || '',
        isActive: customer.isActive || false,
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().max(255).required('First Name is required'),
        lastName: Yup.string().max(255).required('Last Name is required'),
        company: Yup.string().max(255),
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        phone: Yup.string().max(15),
        fax: Yup.string().max(30),
        fullAddr: Yup.string().max(255),
        aptSuite: Yup.string().max(255),
        city: Yup.string().max(255),
        state: Yup.string().max(255),
        country: Yup.string().max(255),
        postalCode: Yup.string().max(255),
        isActive: Yup.bool()
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

          const response = await axios.put(`${API_BASE_URL}/customer/${customer.id}`, values);

          setStatus({ success: response.data.status });
          setSubmitting(false);
          enqueueSnackbar('Customer updated', {
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
                    error={Boolean(touched.firstName && errors.firstName)}
                    fullWidth
                    helperText={touched.firstName && errors.firstName}
                    label="First name"
                    name="firstName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.firstName}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.lastName && errors.lastName)}
                    fullWidth
                    helperText={touched.lastName && errors.lastName}
                    label="Last name"
                    name="lastName"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.lastName}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.company && errors.company)}
                    fullWidth
                    helperText={touched.company && errors.company}
                    label="Company"
                    name="company"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.company}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email address"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.phone && errors.phone)}
                    fullWidth
                    helperText={touched.phone && errors.phone}
                    label="Phone number"
                    name="phone"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={6}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.fax && errors.fax)}
                    fullWidth
                    helperText={touched.fax && errors.fax}
                    label="Fax number"
                    name="fax"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.fax}
                    variant="outlined"
                  />
                </Grid>
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
                    Active Customer
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                  >
                    Disabling this will automatically disable the customer
                  </Typography>
                  <Switch
                    checked={values.isActive}
                    color="secondary"
                    edge="start"
                    name="isActive"
                    onChange={handleChange}
                    value={values.isActive}
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
                  Update Customer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
}

CustomerEditForm.propTypes = {
  className: PropTypes.string,
  customer: PropTypes.object.isRequired
};

export default CustomerEditForm;