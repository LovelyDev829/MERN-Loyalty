/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_SHIPMENTS,
  SET_SHIPMENTS_BY_CUSTOMER_ID,
} from 'src/actions/shipmentActions';

const initialState = {
  shipments: [],
  totalCount: 0,
  shipmentsByCustomerID: [],
  totalCountByCustomerID: 0,
};

const shipmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SHIPMENTS: {
      const { shipments, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.shipments = shipments;
        draft.totalCount = totalCount;
      });
    }

    case SET_SHIPMENTS_BY_CUSTOMER_ID: {
      const { shipmentsByCustomerID, totalCountByCustomerID } = action.payload;
      return produce(state, (draft) => {
        draft.shipmentsByCustomerID = shipmentsByCustomerID;
        draft.totalCountByCustomerID = totalCountByCustomerID;
      });
    }

    default: {
      return state;
    }
  }
};

export default shipmentReducer;
