import React, {
  useState,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Container,
  makeStyles,
} from '@material-ui/core';
import Modal from 'react-modal';
import Page from 'src/components/Page';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import ShipmentCreateForm from '../../ShipmentCreateView/ShipmentCreateForm';
import ShipmentEditForm from '../../ShipmentEditView/ShipmentEditForm';
import Header, { typeOptions } from './Header';

// import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  popupModal: {
    // width: '897px',
    minWidth: '500px',
    height: '80%',
    zIndex: '60000',
    position: 'fixed',
    top: '100px',
    left: '50%',
    overflow: 'scroll',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    width: '60%',
  },
}));
function ShipmentListView({
  customer = null
}) {
  const classes = useStyles();
  const { shipments, totalCount } = useSelector((state) => state.shipment);
  const childRef = useRef();
  const [type, setType] = useState(typeOptions[0].value);

  const handleTypeChange = (newType) => {
    if (childRef.current) {
      childRef.current.updateType(newType);
    }
    setType(newType);
  };

  const handleExportToCSV = async () => {
    if (childRef.current) {
      childRef.current.handleExportToCSV();
    }
  };

  return (
    <>
      <Page
        className={classes.root}
        title="Reports"
      >
        <Container maxWidth={false}>
          <Header
            isShowHeader
            handleTypeChangeParent={handleTypeChange}
            handleExportToCSV={handleExportToCSV}
          />
          <Box mt={3}>
            <Results
              oldShipments={shipments}
              oldTotalCount={totalCount}
              ref={childRef}
            />
          </Box>
        </Container>
      </Page>
    </>
  );
}

ShipmentListView.propTypes = {
  customer: PropTypes.object,
  // setModalCreateIsOpenToTrue: PropTypes.func,
  // setModalEditIsOpenToTrue: PropTypes.func,
};

export default ShipmentListView;
