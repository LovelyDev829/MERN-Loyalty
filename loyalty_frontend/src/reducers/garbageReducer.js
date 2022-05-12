/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_GARBAGE,
} from 'src/actions/garbageActions';

const initialState = {
  garbage: {
    isEmailAllowed: false,
    isNotificationAllowed: false,
    isTextAllowed: false
  },
};

const garbageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GARBAGE: {
      const { garbage } = action.payload;
      return produce(state, (draft) => {
        draft.garbage = garbage;
      });
    }
    default: {
      return state;
    }
  }
};

export default garbageReducer;
