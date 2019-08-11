import { combineReducers } from 'redux';
import * as ACT from './actions';

const initialState = {
  data: [],
  category: null,
  percentage: 0,
  taskList: [],
  taskId: null,
  showDone: false
};

function rootReducer(store = initialState, action) {
  switch (action.type) {
    case ACT.DATA_TASK_EDIT:
      return { ...store, ...action.payload };

    case ACT.DATA_TASK_ADD:
      return { ...store, ...action.payload };

    case ACT.DATA_TASK_DELETE:
      return { ...store, ...action.payload };

    case ACT.DATA_TASK_UPDATE:
      return { ...store, ...action.payload };

    case ACT.FORM_STATE_SET:
      return { ...store, ...action.payload };
    default:
      return store;
  }
}

export default history =>
  combineReducers({
    app: rootReducer
  });
