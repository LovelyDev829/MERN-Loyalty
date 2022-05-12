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
  // Typography,
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

function ServicePackageEditForm({
  className,
  servicePackage,
  isPopup,
  setModalIsOpenToFalse,
  ...rest
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      initialValues={servicePackage}
      validationSchema={Yup.object().shape({
        description: Yup.string().max(255).required('Title is required'),
        unitPrice: Yup.number().test(
          'is-decimal',
          'invalid decimal',
          (value) => (`${value}`).match(/^[0-9]\d*(\.\d+)?$/),
        ),
        currency: Yup.string().max(255),
        note: Yup.string().max(255),
        isActive: Yup.bool(),
      })}
      onSubmit={async (values, {
        // resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        try {
          const response = await axios.put(`${API_BASE_URL}/admin/service-package/${servicePackage.id}`, values);

          setStatus({ success: response.data.status });
          setSubmitting(false);
          enqueueSnackbar('ServicePackage updated', {
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
          <input type="hidden" value={values.currency} name="currency" />
          <Card>
            <CardContent>
              <Box mt={2} className={classes.buttonWraper}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Update Service Package
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
                  className={classes.ServicePackageID}
                >
                  <TextField
                    error={Boolean(touched.description && errors.description)}
                    fullWidth
                    helperText={touched.description && errors.description}
                    label="Description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.description}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    error={Boolean(touched.unitPrice && errors.unitPrice)}
                    fullWidth
                    helperText={touched.unitPrice && errors.unitPrice}
                    label="UnitPrice"
                    name="unitPrice"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    required
                    value={values.unitPrice}
                    variant="outlined"
                  />
                </Grid>
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <QuillEditor
                    className={classes.editor}
                    placeholder="Note"
                    value={values.note}
                    onChange={(value) => setFieldValue('note', value)}
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

ServicePackageEditForm.propTypes = {
  className: PropTypes.string,
  servicePackage: PropTypes.object,
  isPopup: PropTypes.bool,
  setModalIsOpenToFalse: PropTypes.func,
};

export default ServicePackageEditForm;
