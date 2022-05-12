/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
import clsx from 'clsx';
import {
  pdf, PDFDownloadLink, PDFViewer
} from '@react-pdf/renderer';
import { useSnackbar } from 'notistack';
import {
  Breadcrumbs,
  Box,
  Button,
  Grid,
  Link,
  Dialog,
  Typography,
  makeStyles,
  Divider
} from '@material-ui/core';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import validator from 'validator';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import ShipmentPDF from './Details/ShipmentPDF';
import AddAnotherAddress from './AddAnotherAddress';
import { escapeSpecialUnicodeCharacters, isPhoneNumber } from 'src/utils/helper';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  actionIcon: {
    marginRight: theme.spacing(1)
  },
  actionButtonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  topButtonWrapper: {
    display: 'flex',
    justifyContent: 'flex-start'
  },
  backButtonWrapper: {

  },
  actionButton: {
    minWidth: 130,
    '@media (max-width: 767px)': {
      minWidth: 95,
    },
    '@media (max-width: 1200px)': {
      minWidth: 110,
    },
  },
  confirmPopupHeader: {
    minWidth: '500px',
  }
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

function Header({ className, shipment, ...rest }) {
  const classes = useStyles();
  const [viewPDF, setViewPDF] = useState(false);
  const [viewConfirm, setViewConfirm] = useState(false);
  const [confirmType, setConfirmType] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
  }, []);

  const processConfirm = () => {
    const arr = addresses.slice();
    const addresses_validated = [];
    for (let i = 0; i < arr.length; i++) {
      const value = escapeSpecialUnicodeCharacters(arr[i]);

      if (confirmType === 'Email') {
        if (validator.isEmail(value)) {
          addresses_validated.push(value);
        }
      } else if (confirmType === 'Text') {
        if (isPhoneNumber(value)) {
          addresses_validated.push(value);
        }
      } else if (confirmType === 'Fax') {
        if (isPhoneNumber(value)) {
          addresses_validated.push(value);
        }
      }
    }

    if (confirmType === 'Print') {
      const iframe = document.getElementsByTagName('iframe')[0];
      iframe.contentWindow.print();
    } else if (confirmType === 'Email') {
      pdf(<ShipmentPDF shipment={shipment} />).toBlob().then((blob) => {
        const formData = new FormData();
        formData.append('addresses', addresses_validated);
        formData.append('pdfFile', blob);
        axios.post(`${API_BASE_URL}/shipment/send-email/${shipment.id}`, formData)
          .then((response) => {
            if (response.data.status) {
              enqueueSnackbar('Sent the Email successfully.', {
                variant: 'success',
              });
            } else {
              enqueueSnackbar('Can\'t send the Email.', {
                variant: 'error',
              });
            }
          })
          .catch(() => {
            enqueueSnackbar('Can\'t send the Email.', {
              variant: 'error',
            });
          });
      });
    } else if (confirmType === 'Text') {
      pdf(<ShipmentPDF shipment={shipment} />).toBlob().then((blob) => {
        const formData = new FormData();
        formData.append('addresses', addresses_validated);
        formData.append('pdfFile', blob);
        axios.post(`${API_BASE_URL}/shipment/send-text/${shipment.id}`, formData)
          .then((response) => {
            if (response.data.status) {
              enqueueSnackbar('Sent the Text successfully.', {
                variant: 'success',
              });
            } else {
              enqueueSnackbar('Can\'t send the Text.', {
                variant: 'error',
              });
            }
          })
          .catch(() => {
            enqueueSnackbar('Can\'t send the Text.', {
              variant: 'error',
            });
          });
      });
    } else if (confirmType === 'Fax') {
      pdf(<ShipmentPDF shipment={shipment} />).toBlob().then((blob) => {
        const formData = new FormData();
        formData.append('addresses', addresses_validated);
        formData.append('pdfFile', blob);
        axios.post(`${API_BASE_URL}/shipment/send-fax/${shipment.id}`, formData)
          .then((response) => {
            if (response.data.status) {
              enqueueSnackbar('Sent the Fax successfully.', {
                variant: 'success',
              });
            } else {
              enqueueSnackbar('Can\'t send the Fax.', {
                variant: 'error',
              });
            }
          })
          .catch(() => {
            enqueueSnackbar('Can\'t send the Fax.', {
              variant: 'error',
            });
          });
      });
    }

    setConfirmType('');
  };

  const sendEmail = async () => {
    setConfirmMessage('Would you like to send Email to customer?');
    setConfirmType('Email');
  };

  const sendText = async () => {
    setConfirmMessage('Would you like to send Text to customer?');
    setConfirmType('Text');
  };

  const sendFax = async () => {
    setConfirmMessage('Would you like to send Fax to customer?');
    setConfirmType('Fax');
  };

  const onPrint = async () => {
    setConfirmType('Print');
  };

  const onConfirmYes = () => {
    processConfirm();
    setViewConfirm(false);
  };

  const onConfirmNo = () => {
    setViewConfirm(false);
    setConfirmType('');
  };

  useEffect(() => {
    if (confirmType === '') {
      return;
    }
    if (confirmType === 'Print') {
      processConfirm();
    } else {
      setViewConfirm(true);
    }
  }, [confirmType]);

  return (
    <>
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        className={clsx(classes.root, className)}
        {...rest}
      >
        <Grid item>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              variant="body1"
              color="inherit"
              to="/app"
              component={RouterLink}
            >
              Dashboard
            </Link>
            <Link
              variant="body1"
              color="inherit"
              to="/app/management"
              component={RouterLink}
            >
              Management
            </Link>
            <Typography
              variant="body1"
              color="textPrimary"
            >
              Shipment Details
            </Typography>
          </Breadcrumbs>
          <Typography
            variant="h3"
            color="textPrimary"
          >
            {shipment.title}
          </Typography>
          <Dialog fullScreen open={viewPDF} className={classes.viewPDFDlg}>
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Box
                bgcolor="common.white"
                p={2}
              >
                <Grid
                  container
                  className={classes.topButtonWrapper}
                  spacing={2}
                >
                  <Grid
                    item
                    className={classes.backButtonWrapper}
                    md={4}
                    xs={12}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => setViewPDF(false)}
                    >
                      <NavigateBeforeIcon />
                      Back
                    </Button>
                  </Grid>
                  <Grid
                    item
                    className={classes.actionButtonWrapper}
                    md={8}
                    xs={12}
                  >
                    <Grid
                      container
                      spacing={5}
                    >
                      <Grid
                        item
                        md={2}
                        xs={3}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={onPrint}
                          className={classes.actionButton}
                        >
                          Print
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={3}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={sendEmail}
                          className={classes.actionButton}
                        >
                          Email
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={3}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={sendFax}
                          className={classes.actionButton}
                        >
                          Fax
                        </Button>
                      </Grid>
                      <Grid
                        item
                        md={2}
                        xs={3}
                      >
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={sendText}
                          className={classes.actionButton}
                        >
                          Text
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>

              <Box flexGrow={1}>
                <PDFViewer
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                >
                  <ShipmentPDF shipment={shipment} />
                </PDFViewer>
              </Box>
            </Box>
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
                  {confirmMessage}
                </Typography>
              </Box>
              {confirmType === 'Email' && (
                <AddAnotherAddress
                  type="Email"
                  shipment={shipment}
                  setAddressesForParent={setAddresses}
                />
              )}
              {confirmType === 'Text' && (
                <AddAnotherAddress
                  type="Text"
                  shipment={shipment}
                  setAddressesForParent={setAddresses}
                />
              )}
              {confirmType === 'Fax' && (
                <AddAnotherAddress
                  type="Fax"
                  shipment={shipment}
                  setAddressesForParent={setAddresses}
                />
              )}
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
          </Dialog>
        </Grid>
        <Grid item>
          {/* <Hidden smDown> */}
          <Button
            className={classes.action}
            onClick={() => setViewPDF(true)}
          >
            Preview PDF
          </Button>
          {/* </Hidden> */}
          <PDFDownloadLink
            document={<ShipmentPDF shipment={shipment} />}
            fileName="invoice"
            style={{ textDecoration: 'none' }}
          >
            <Button
              color="secondary"
              variant="contained"
              className={classes.action}
            >
              Download PDF
            </Button>
          </PDFDownloadLink>
        </Grid>
      </Grid>
    </>
  );
}

Header.propTypes = {
  className: PropTypes.string,
  shipment: PropTypes.object.isRequired
};

export { Header, sortOptions };
