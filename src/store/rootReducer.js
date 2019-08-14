import { combineReducers } from 'redux';
import * as ACT from './actions';
import { FORM_ADD } from '../lib/const';

const initialState = {
  data: [
    // {
    //   id: 3,
    //   name: 'category3',
    //   items: [
    //     { id: 31, title: 'to do item 5', done: true, description: 'okey' },
    //     { id: 32, title: 'to do item 6', done: false, description: 'lets go' }
    //   ],
    //   sub: [
    //     {
    //       id: 5,
    //       name: 'category3 2',
    //       items: [
    //         { id: 41, title: 'to do item 7', done: false },
    //         { id: 42, title: 'to do item 8', done: false }
    //       ],
    //       sub: [
    //         {
    //           id: 55,
    //           name: 'ok',
    //           items: [{ id: 551, title: 'ok', done: true }]
    //         }
    //       ]
    //     }
    //   ]
    // }
  ],
  showDone: false,
  taskList: [],
  percentage: 0,
  category: null,
  formState: {
    state: FORM_ADD,
    editItem: null,
    moveTask: false,
    currentCategoryId: 0,
    prevCategoryId: 0
  }
};

function rootReducer(store = initialState, action) {
  switch (action.type) {
    case ACT.CALCULATE_PERCENTAGE:
      return { ...store, percentage: action.payload.percentage };
    case ACT.SWITCH_SHOW_DONE:
      return { ...store, showDone: !store.showDone };
    case ACT.SELECT_CATEGORY:
      return {
        ...store,
        category: action.payload.category,
        taskList: action.payload.category.items,
        categoryId: action.payload.category.id
      };
    case ACT.UPDATE_DATA:
      return { ...store, data: action.payload.newStateData };
    case ACT.UPDATE_ITEMS:
      return { ...store, taskList: action.payload.taskList };
    case ACT.ADD_ITEM:
      return {
        ...store,
        taskList: action.payload.newTaskList,
        data: action.payload.newStateData
      };
    case ACT.SHOW_DETAILS:
      return {
        ...store,
        formState: { ...store.formState, ...action.payload.formState },
        category: action.payload.category
      };
    case ACT.CLOSE_DETAILS:
      return { ...store, formState: action.payload.formState };
    case ACT.CHANGE_CATEGORY_FOR_TASK:
      return {
        ...store,
        formState: {
          ...store.formState,
          ...action.payload.formState,
          prevCategoryId: store.formState.currentCategoryId
        }
      };
    default:
      return store;
  }
}

export default () =>
  combineReducers({
    app: rootReducer
  });
