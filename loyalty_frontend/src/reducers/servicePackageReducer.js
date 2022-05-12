/* eslint-disable no-param-reassign */
import produce from 'immer';
import {
  SET_SERVICE_PACKAGES,
} from 'src/actions/servicePackageActions';

const initialState = {
  servicePackages: [],
  totalCount: 0,
};

const servicePackageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_PACKAGES: {
      const { servicePackages, totalCount } = action.payload;
      return produce(state, (draft) => {
        draft.servicePackages = servicePackages;
        draft.totalCount = totalCount;
      });
    }

    default: {
      return state;
    }
  }
};

export default servicePackageReducer;
