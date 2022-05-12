/* eslint-disable max-len */
import React, {
  useState,
  useRef,
} from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Container,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Modal from 'react-modal';
import axios from 'src/utils/axios';
import { API_BASE_URL } from 'src/config';
import InventoryCreateForm from '../InventoryCreateView/InventoryCreateForm';
import InventoryEditForm from '../InventoryEditView/InventoryEditForm';

// import useIsMountedRef from 'src/hooks/useIsMountedRef';
import Header from './Header';
import Results from './Results';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  },
  popupModal: {
    minWidth: '300px',
    minHeight: '62%',
    zIndex: '60000',
    position: 'fixed',
    top: '20%',
    left: '50%',
    overflow: 'auto',
    transform: 'translateX(-50%)',
    border: '1px solid grey',
    padding: '15px',
    background: '#fff',
    width: '40%',
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
}));
function InventoryTransactionListView() {
  const classes = useStyles();
  const { inventories, totalCount } = useSelector((state) => state.inventory);
  const [modalCreateIsOpen, setModalCreateIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [inventoryForPopup, setInventoryForPopup] = useState(null);
  const childRef = useRef();

  const setModalCreateIsOpenToTrue = () => {
    setModalCreateIsOpen(true);
  };

  const setModalCreateIsOpenToFalse = () => {
    setModalCreateIsOpen(false);
    if (childRef.current) {
      childRef.current.updateList();
    }
  };

  const setModalEditIsOpenToTrue = async (inventoryId) => {
    const response = await axios.get(`${API_BASE_URL}/inventory/${inventoryId}`);
    setInventoryForPopup(response.data.inventory);
    setModalEditIsOpen(true);
  };

  const setModalEditIsOpenToFalse = () => {
    setModalEditIsOpen(false);
    if (childRef.current) {
      childRef.current.updateList();
    }
  };

  return (
    <>
      <Page
        className={classes.root}
        title="Inventory List"
      >
        <Container maxWidth={false}>
          <Header
            setModalCreateIsOpenToTrue={setModalCreateIsOpenToTrue}
          />
          <Box mt={3}>
            <Results
              oldInventorys={inventories}
              oldTotalCount={totalCount}
              setModalEditIsOpenToTrue={setModalEditIsOpenToTrue}
              ref={childRef}
            />
          </Box>
        </Container>
      </Page>
      <Modal isOpen={modalCreateIsOpen} className={classes.popupModal}>
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalCreateIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Create New Inventory</h3>
        </Box>
        <br />
        <InventoryCreateForm
          isPopup
          setModalIsOpenToFalse={setModalCreateIsOpenToFalse}
        />
      </Modal>
      <Modal isOpen={modalEditIsOpen} className={classes.popupModal}>
        <Box className={classes.popupHeadeBox}>
          <Button onClick={setModalEditIsOpenToFalse} className={classes.popupCloseButton}>X</Button>
          <h3 className={classes.popupTitle}>Edit Inventory</h3>
        </Box>
        <InventoryEditForm
          isPopup
          setModalIsOpenToFalse={setModalEditIsOpenToFalse}
          inventory={inventoryForPopup}
        />
      </Modal>
    </>
  );
}

InventoryTransactionListView.propTypes = {

};

export default InventoryTransactionListView;
