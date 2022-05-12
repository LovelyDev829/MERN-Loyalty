/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_USERS,
} from 'src/actions/userActions';

const initialState = {
  users: [],
  totalCount: 0,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERS: {
      const { users, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.users = users;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default userReducer;
