/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_WAREHOUSES,
} from 'src/actions/warehouseActions';

const initialState = {
  warehouses: [],
  totalCount: 0,
};

const warehouseReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WAREHOUSES: {
      const { warehouses, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.warehouses = warehouses;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default warehouseReducer;
