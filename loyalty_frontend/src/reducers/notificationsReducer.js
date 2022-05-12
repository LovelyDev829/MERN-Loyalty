/* eslint-disable no-param-reassign */
import produce from 'immer';
import { GET_NOTIFICATIONS } from 'src/actions/notificationsActions';

const initialState = {
  notifications: [],
  countUnRead: 0,
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS: {
      const { notifications } = action.payload;
      const { countUnRead } = action.payload;

      return produce(state, (draft) => {
        draft.notifications = notifications;
        draft.countUnRead = countUnRead;
      });
    }

    default: {
      return state;
    }
  }
};

export default notificationsReducer;
