/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_DRIVERS,
} from 'src/actions/driverActions';

const initialState = {
  drivers: [],
  totalCount: 0,
};

const driverReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRIVERS: {
      const { drivers, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.drivers = drivers;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default driverReducer;
