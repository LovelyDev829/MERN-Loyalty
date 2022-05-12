/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_INVENTORIES,
} from 'src/actions/inventoryActions';

const initialState = {
  inventories: [],
  totalCount: 0,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_INVENTORIES: {
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

export default inventoryReducer;
