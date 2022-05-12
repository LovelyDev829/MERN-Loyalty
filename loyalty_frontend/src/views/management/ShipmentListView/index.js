/* eslint-disable no-nested-ternary */
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
import ShipmentCreateForm from '../ShipmentCreateView/ShipmentCreateForm';
import ShipmentEditForm from '../ShipmentEditView/ShipmentEditForm';
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
  const {
    shipmentsByCustomerID,
    totalCountByCustomerID
  } = useSelector((state) => state.shipment);
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [shipmentForPopup, setShipmentForPopup] = useState(null);
  const childRef = useRef();
  const [type, setType] = useState(typeOptions[0].value);
  const [typeFromButton, setTypeFromButton] = useState(typeOptions[0].value);

  const setModalCreateIsOpenToTrue = () => {
    setModalCreateIsOpen(true);
  };

  const setModalCreateIsOpenToFalse = () => {
    setModalCreateIsOpen(false);
    if (childRef.current) {
      childRef.current.updateList();
    }
  };

  const setModalEditIsOpenToTrue = async (shipmentId) => {
    const response = await axios.get(`${API_BASE_URL}/shipment/${shipmentId}`);
    setShipmentForPopup(response.data.shipment);
    setModalEditIsOpen(true);
  };

  const setModalEditIsOpenToFalse = () => {
    setModalEditIsOpen(false);
  };

  const handleTypeChange = (newType) => {
    if (childRef.current) {
      childRef.current.updateType(newType);
    }
    setType(newType);
  };

  return (
    <>
      {(customer === null) && (
      <Page
        className={classes.root}
        title={type === '0' ? 'Shipment/Servie List' : (type === '1' ? 'Shipment List' : 'Service List')}
      >
        <Container maxWidth={false}>
          <Header
            isShowHeader
            handleTypeChangeParent={handleTypeChange}
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
      )}
      {(customer !== null) && (
        <Card>
          <Box>
            <Results
              customer={customer}
              oldShipments={shipmentsByCustomerID}
              oldTotalCount={totalCountByCustomerID}
              setModalCreateIsOpenToTrue={setModalCreateIsOpenToTrue}
              setTypeFromButton={setTypeFromButton}
              setModalEditIsOpenToTrue={setModalEditIsOpenToTrue}
              handleTypeChangeParent={handleTypeChange}
              ref={childRef}
            />
          </Box>
        </Card>
      )}
      <Modal isOpen={modalCreateIsOpen} className={classes.popupModal}>
        <Button onClick={setModalCreateIsOpenToFalse}>X</Button>
        <br />
        <br />
        <h3>{typeFromButton === '1' ? 'Create New Shipment' : 'Create New Service'}</h3>
        <br />
        <ShipmentCreateForm
          isPopup
          setModalIsOpenToFalse={setModalCreateIsOpenToFalse}
          customerFromParent={customer}
          type={typeFromButton}
        />
      </Modal>
      <Modal isOpen={modalEditIsOpen} className={classes.popupModal}>
        <Button onClick={setModalEditIsOpenToFalse}>X</Button>
        <br />
        <br />
        <h3>{typeFromButton === '1' ? 'Edit Shipment' : 'Edit Service'}</h3>
        <br />
        <ShipmentEditForm
          isPopup
          setModalIsOpenToFalse={setModalEditIsOpenToFalse}
          customer={customer}
          shipment={shipmentForPopup}
          type={typeFromButton}
        />
      </Modal>
    </>
  );
}

ShipmentListView.propTypes = {
  customer: PropTypes.object,
  // setModalCreateIsOpenToTrue: PropTypes.func,
  // setModalEditIsOpenToTrue: PropTypes.func,
};

export default ShipmentListView;
