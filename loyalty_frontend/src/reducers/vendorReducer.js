/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_VENDORS,
} from 'src/actions/vendorActions';

const initialState = {
  vendors: [],
  totalCount: 0,
};

const vendorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_VENDORS: {
      const { vendors, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.vendors = vendors;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default vendorReducer;
