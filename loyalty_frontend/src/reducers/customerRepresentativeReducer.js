/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_CUSTOMER_REPRESENTATIVES,
} from 'src/actions/customerRepresentativeActions';

const initialState = {
  customerRepresentatives: [],
  totalCount: 0,
};

const customerRepresentativeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CUSTOMER_REPRESENTATIVES: {
      const { customerRepresentatives, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.customerRepresentatives = customerRepresentatives;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default customerRepresentativeReducer;
