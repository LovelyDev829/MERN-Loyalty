/* eslint-disable max-len */
import React from 'react';
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
  makeStyles
} from '@material-ui/core';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import QuillEditor from 'src/components/QuillEditor';

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
  }
}));

function DriverCreateForm({
  className,
  isPopup = false,
  setModalIsOpenToFalse,
  ...rest
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={{
        name: '',
        phone: '',
        isActive: true,
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().max(255).required('Title is required'),
        phone: Yup.string().max(15),
        isActive: Yup.bool(),
      })}
      onSubmit={async (values, {
        // resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const response = await axios.post(`${API_BASE_URL}/admin/driver`, values);

          setStatus({ success: response.data.status });
          setSubmitting(false);
          enqueueSnackbar('Driver created', {
            variant: 'success',
            action: <Button>See all</Button>
          });

          if (!isPopup) {
            // history.push('/app/management/drivers');
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
                  Create Driver
                </Button>
              </Box>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                  className={classes.DriverID}
                >
                  <TextField
                    error={Boolean(touched.name && errors.name)}
                    fullWidth
                    helperText={touched.name && errors.name}
                    label="Name"
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
                  md={12}
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
              </Grid>
            </CardContent>
          </Card>
        </form>
      )}
    </Formik>
  );
}

DriverCreateForm.propTypes = {
  className: PropTypes.string,
  isPopup: PropTypes.bool,
  setModalIsOpenToFalse: PropTypes.func,
};

export default DriverCreateForm;
