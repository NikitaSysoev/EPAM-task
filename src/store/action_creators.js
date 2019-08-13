import * as ACT from './actions';
import { flatten, deepClone, findObj } from '../lib';
import { findAndModifyFirst, findFirst, findAndDeleteFirst } from 'obj-traverse/lib/obj-traverse';

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
      return findAndModifyFirst(item, 'sub', { id }, { ...cell, sub: [newCategory, ...cell.sub] });
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
