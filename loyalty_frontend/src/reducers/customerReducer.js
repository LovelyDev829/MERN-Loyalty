/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_CUSTOMERS,
} from 'src/actions/customerActions';

const initialState = {
  customers: [],
  totalCount: 0,
};

const customerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMERS: {
      const { customers, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.customers = customers;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default customerReducer;
