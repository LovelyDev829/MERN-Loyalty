/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_TRANSACTION_INVENTORIES,
} from 'src/actions/inventoryTransactionActions';

const initialState = {
  inventories: [],
  totalCount: 0,
};

const inventoryTransactionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TRANSACTION_INVENTORIES: {
      const { inventories, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.inventories = inventories;
        draft.totalCount = totalCount;
      });
    }
    default: {
      return state;
    }
  }
};

export default inventoryTransactionReducer;
