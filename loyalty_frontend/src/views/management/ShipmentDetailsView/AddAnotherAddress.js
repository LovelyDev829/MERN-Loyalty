/* eslint-disable object-curly-newline */
import React, {
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import MultipleValueTextInput from 'react-multivalue-text-input';
import validator from 'validator';
import { escapeSpecialUnicodeCharacters, isPhoneNumber } from 'src/utils/helper';

const useStyles = makeStyles(() => ({
  root: {},
  emailTextField: {
    marginLeft: '20px',
    marginRight: '20px',
    width: '90%',
  },
  addAnotherButton: {
    marginTop: '10px',
    width: '90%',
    marginLeft: '20px',
  },
  errorTypography: {
    marginLeft: '23px',
    color: 'red',
    fontWeight: '500',
    fontSize: '12px',
  },
  addressesWrapper: {
    '& p[role="list"]': {
      marginBottom: '8px',
      marginLeft: '20px',
    },
    '& label[data-testid="label"]': {
      marginBottom: '10px',
    },
    '& input': {
    }
  },
  multipleValueTextInputAddresses: {
    marginLeft: '20px',
    marginBottom: '20px',
    width: '80% !important',
    fontSize: '15px',
    height: '30px',
    paddingLeft: '5px',
  }
}));

function AddAnotherAddress({ type, shipment, setAddressesForParent }) {
  const classes = useStyles();
  const [invalidAddressIdx, setInvalidAddressIdx] = useState(-1);

  useEffect(() => {
    if (type === 'Email') {
      setAddressesForParent([shipment.customer[0].email]);
    } else if (type === 'Text') {
      setAddressesForParent([shipment.customer[0].phone]);
    } else if (type === 'Fax') {
      setAddressesForParent([shipment.customer[0].fax]);
    }
  }, []);

  const checkIfDuplicateExists = (w) => new Set(w).size !== w.length;

  const checkValidationItem = (item, allItems) => {
    setInvalidAddressIdx(-1);

    if (allItems.length > 0 && checkIfDuplicateExists(allItems)) {
      setInvalidAddressIdx(allItems.length - 1);
      return false;
    }

    const value = escapeSpecialUnicodeCharacters(item);

    if (type === 'Email') {
      if (!validator.isEmail(value)) {
        setInvalidAddressIdx(allItems.length - 1);
        return false;
      }
    } else if (type === 'Text') {
      if (!isPhoneNumber(value)) {
        setInvalidAddressIdx(allItems.length - 1);
        return false;
      }
    } else if (type === 'Fax') {
      if (!isPhoneNumber(value)) {
        setInvalidAddressIdx(allItems.length - 1);
        return false;
      }
    }

    setInvalidAddressIdx(-1);
    return true;
  };

  const handleChangeMultipleValueInput = (item, allItems) => {
    const rtn = checkValidationItem(item, allItems);
    if (rtn) {
      setAddressesForParent(allItems);
    }
  };

  const handleDeleteMultipleValueInput = (item, allItems) => {
    setAddressesForParent(allItems);
  };

  if (!shipment) {
    return null;
  }

  return (
    <>
      <Grid
        container
        spacing={1}
      >
        <Grid
          item
          md={12}
          xs={12}
          className={classes.addressesWrapper}
        >
          <MultipleValueTextInput
            onItemAdded={(item, allItems) => handleChangeMultipleValueInput(item, allItems)}
            onItemDeleted={(item, allItems) => handleDeleteMultipleValueInput(item, allItems)}
            label=""
            name="item-input"
            placeholder={type === 'Email' ? 'email' : 'phone number'}
            values={type === 'Email' ? [shipment.customer[0].email] : [shipment.customer[0].phone]}
            className={classes.multipleValueTextInputAddresses}
          />
          {invalidAddressIdx > -1 && (
          <Typography
            className={classes.errorTypography}
            variant="h4"
            gutterBottom
          >
            Remove the last one added - invalid address or duplicated address.
          </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}

AddAnotherAddress.propTypes = {
  type: PropTypes.string,
  shipment: PropTypes.object,
  setAddressesForParent: PropTypes.func,
};

export default AddAnotherAddress;
