import * as ACT from './actions';
import { flatten, deepClone, findObj } from '../lib';
import { findAndModifyFirst, findFirst, findAndDeleteFirst } from 'obj-traverse/lib/obj-traverse';
import { FORM_ADD, FORM_EDIT } from '../lib/const';

export function calculatePercentage(payload) {
  const { data } = payload;
  let percentage = null;
  if (data && data.length) {
    const tree = deepClone(data);
    const allItems = flatten(tree)
      .map(item => item.items)
      .reduce((acc, item) => acc.concat(item));
    const { length } = allItems;
    const { length: doneLength } = allItems.filter(item => item.done);
    percentage = length === 0 ? 0 : (doneLength / length) * 100;
  } else {
    percentage = 0;
  }
  return {
    type: ACT.CALCULATE_PERCENTAGE,
    payload: { percentage }
  };
}

export function switchShowDone() {
  return {
    type: ACT.SWITCH_SHOW_DONE
  };
}

export function selectCategory(payload) {
  const { data, id } = payload;
  const tree = deepClone(data);
  const category = findObj(tree, id);
  return {
    type: ACT.SELECT_CATEGORY,
    payload: { category }
  };
}

export function toggleDone(payload) {
  const { data, category, id } = payload;
  const tree = deepClone(data);
  const newStateData = tree.map(item => {
    const cell = findFirst(item, 'sub', { id: category.id });
    if (cell) {
      const newCellItems = cell.items.map(item => {
        if (item.id === id) item.done = !item.done;
        return item;
      });
      return findAndModifyFirst(item, 'sub', { id: category.id }, { ...cell, items: newCellItems });
    } else {
      return item;
    }
  });
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}

export function rerenderItems(payload) {
  const { categoryId, showDone, data } = payload;
  let taskList = null;
  if (data && data.length) {
    if (categoryId) {
      const tree = deepClone(data);
      const category = findObj(tree, categoryId);
      if (category) {
        taskList = showDone ? category.items.filter(item => item.done) : category.items;
      } else {
        taskList = [];
      }
    }
  } else if (data && !data.length) {
    taskList = [];
  }
  return {
    type: ACT.UPDATE_ITEMS,
    payload: { taskList }
  };
}

export function addNewCategory(payload) {
  const { text, data } = payload;
  const tree = deepClone(data);
  const newCategory = {
    id: Date.now(),
    name: text,
    items: [],
    sub: []
  };
  const newStateData = [newCategory, ...tree];
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}

export function addSubCategory(payload) {
  const { text, data, id } = payload;
  const tree = deepClone(data);
  const newCategory = {
    id: Date.now(),
    name: text,
    items: [],
    sub: []
  };
  const newStateData = tree.map(item => {
    const cell = findFirst(item, 'sub', { id });
    if (item.id === id) {
      return { ...item, sub: [newCategory, ...item.sub] };
    } else if (cell) {
      const cellItems = cell.sub ? [newCategory, ...cell.sub] : [newCategory];
      return findAndModifyFirst(item, 'sub', { id }, { ...cell, sub: cellItems });
    } else {
      return item;
    }
  });
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}

export function deleteCategory(payload) {
  const { data, id } = payload;
  const tree = deepClone(data);
  const newStateData = tree
    .map(item => {
      const cell = findFirst(item, 'sub', { id });
      if (item.id === id) {
        return false;
      } else if (cell) {
        return findAndDeleteFirst(item, 'sub', { id });
      } else {
        return item;
      }
    })
    .filter(item => !!item);
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}

export function editCategoryName(payload) {
  const { id, text, data } = payload;
  const tree = deepClone(data);
  const newStateData = tree.map(item => {
    const cell = findFirst(item, 'sub', { id });
    if (item.id === id) {
      return { ...item, name: text };
    } else if (cell) {
      return findAndModifyFirst(item, 'sub', { id }, { ...cell, name: text });
    } else {
      return item;
    }
  });
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}

export function addItem(payload) {
  const { categoryId, taskList, data, text } = payload;
  const newItem = {
    id: Date.now(),
    title: text,
    done: false,
    description: ''
  };
  const tree = deepClone(data);
  const newStateData = tree.map(item => {
    const cell = findFirst(item, 'sub', { id: categoryId });
    if (cell) {
      return findAndModifyFirst(
        item,
        'sub',
        { id: categoryId },
        { ...cell, items: [newItem, ...cell.items] }
      );
    } else {
      return item;
    }
  });
  const newTaskList = [newItem, ...taskList];
  return {
    type: ACT.ADD_ITEM,
    payload: { newStateData, newTaskList }
  };
}

export function showDetails(payload) {
  const { data, itemId, categoryId } = payload;
  const tree = deepClone(data);
  const category = findObj(tree, categoryId);
  const item = category.items.find(item => item.id === itemId);
  const formState = {
    state: FORM_EDIT,
    editItem: item,
    currentCategoryId: categoryId
  };
  return {
    type: ACT.SHOW_DETAILS,
    payload: { formState, category }
  };
}

export function closeDetails() {
  const formState = {
    state: FORM_ADD,
    editItem: null,
    moveTask: false,
    currentCategoryId: 0,
    prevCategoryId: 0
  };
  return {
    type: ACT.CLOSE_DETAILS,
    payload: { formState }
  };
}

export function changeCategoryForTask(payload) {
  const formState = {
    currentCategoryId: payload.id,
    moveTask: true
  };
  return {
    type: ACT.CHANGE_CATEGORY_FOR_TASK,
    payload: { formState }
  };
}

export function saveChanges(payload) {
  const { data, formState, categoryId, newItem } = payload;
  const tree = deepClone(data);
  let newStateData = null;

  if (formState.moveTask) {
    newStateData = tree
      .map(category => {
        const cell = findFirst(category, 'sub', { id: formState.prevCategoryId });
        if (category.id === formState.prevCategoryId) {
          return { ...category, items: category.items.filter(i => i.id !== newItem.id) };
        } else if (cell) {
          return findAndModifyFirst(
            category,
            'sub',
            { id: formState.prevCategoryId },
            {
              ...cell,
              items: cell.items.filter(i => i.id !== newItem.id)
            }
          );
        } else {
          return category;
        }
      })
      .map(category => {
        const cell = findFirst(category, 'sub', { id: categoryId });
        if (category.id === categoryId) {
          return {
            ...category,
            items: [newItem, ...category.items]
          };
        } else if (cell) {
          return findAndModifyFirst(
            category,
            'sub',
            { id: categoryId },
            {
              ...cell,
              items: [newItem, ...cell.items]
            }
          );
        } else {
          return category;
        }
      });
  } else {
    newStateData = tree.map(category => {
      const cell = findFirst(category, 'sub', { id: categoryId });
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === newItem.id) {
              return newItem;
            } else {
              return item;
            }
          })
        };
      } else if (cell) {
        return findAndModifyFirst(
          category,
          'sub',
          { id: categoryId },
          {
            ...cell,
            items: cell.items.map(item => {
              if (item.id === newItem.id) {
                return newItem;
              } else {
                return item;
              }
            })
          }
        );
      } else {
        return category;
      }
    });
  }
  return {
    type: ACT.UPDATE_DATA,
    payload: { newStateData }
  };
}
