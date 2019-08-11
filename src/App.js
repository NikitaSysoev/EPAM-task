import React from 'react';
import { findAndModifyFirst, findFirst, findAndDeleteFirst } from 'obj-traverse/lib/obj-traverse';

import { flatten, findObj, deepClone } from './lib';
import './App.css';
import CategoryList from './components/category_list';
import TaskList from './components/task_list';
import ProgressBar from './components/progressBar';
import Filter from './components/filter';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          name: 'category1',
          items: [
            { id: 11, title: 'to do item 1', done: true },
            { id: 12, title: 'to do item 2', done: true }
          ],
          sub: []
        },
        {
          id: 2,
          name: 'category2',
          items: [
            { id: 21, title: 'to do item 3', done: true },
            { id: 22, title: 'to do item 4', done: false }
          ],
          sub: []
        },
        {
          id: 3,
          name: 'category3',
          items: [
            { id: 31, title: 'to do item 5', done: false },
            { id: 32, title: 'to do item 6', done: false }
          ],
          sub: [
            { id: 4, name: 'category3 1', items: [] },
            {
              id: 5,
              name: 'category3 2',
              items: [
                { id: 41, title: 'to do item 7', done: false },
                { id: 42, title: 'to do item 8', done: false }
              ],
              sub: [
                {
                  id: 55,
                  name: 'ok',
                  items: [{ id: 551, title: 'ok', done: true }]
                }
              ]
            },
            {
              id: 6,
              name: 'category3 3',
              items: [{ id: 61, title: 'to do item 9', done: false }]
            }
          ]
        }
      ],
      category: null,
      categoryId: 0,
      percentage: 0,
      taskList: [],
      showDone: false
    };
  }

  componentDidMount() {
    this.calculatePercentage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (JSON.stringify(this.state.data) !== JSON.stringify(prevState.data)) {
      this.calculatePercentage();
    }
  }

  calculatePercentage = () => {
    const { data } = this.state;
    if (data.length) {
      const tree = deepClone(data);
      const allItems = flatten(tree)
        .map(item => item.items)
        .reduce((acc, item) => acc.concat(item));
      const { length } = allItems;
      const { length: doneLength } = allItems.filter(item => item.done);
      const percentage = (doneLength / length) * 100;
      this.setState({ percentage });
    }
  };

  showAllItems = () => {
    const tree = deepClone(this.state.data);
    const category = findObj(tree, this.state.category.id);
    this.setState({ taskList: category.items });
  };

  showOnlyDoneItems = () => {
    const tree = deepClone(this.state.data);
    const category = findObj(tree, this.state.category.id);
    const taskList = category.items.filter(item => item.done);
    this.setState({ taskList });
  };

  handleShowItems = id => {
    const tree = deepClone(this.state.data);
    const category = findObj(tree, id);
    this.setState({ taskList: category.items, category, categoryId: id }, () => {
      this.state.showDone ? this.showOnlyDoneItems() : this.showAllItems();
    });
  };

  handleAddCategory = text => {
    if (text) {
      const newCategory = {
        id: Date.now(),
        name: text,
        items: [],
        sub: []
      };
      this.setState({
        data: [newCategory, ...this.state.data]
      });
    }
  };

  handleAddSubcategory = (id, text) => {
    const newCategory = {
      id: Date.now(),
      name: text,
      items: [],
      sub: []
    };
    const newStateData = this.state.data.map(item => {
      const cell = findFirst(item, 'sub', { id });
      if (item.id === id) {
        return { ...item, sub: [newCategory, ...item.sub] };
      } else if (cell) {
        return findAndModifyFirst(
          item,
          'sub',
          { id },
          { ...cell, sub: [newCategory, ...item.sub] }
        );
      } else {
        return item;
      }
    });
    this.setState({ data: newStateData });
  };

  handleDeleteCategory = id => {
    const { categoryId } = this.state;
    const tree = deepClone(this.state.data);
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
    this.setState({ data: newStateData });
    if (!newStateData.length || (categoryId && categoryId === id)) {
      this.setState({ taskList: [] });
    }
  };

  handleEditCategoryName = (id, text) => {
    const tree = deepClone(this.state.data);
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
    this.setState({ data: newStateData });
  };

  // handleShowDetails = () => {};

  // handleMoveTaskIntoAnotherCategory = () => {};

  handleAddItem = text => {
    const { category, taskList, data } = this.state;
    if (text && category) {
      const newItem = {
        id: Date.now(),
        title: text,
        done: false
      };
      const tree = deepClone(data);
      const newStateData = tree.map(item => {
        const cell = findFirst(item, 'sub', { id: category.id });
        if (cell) {
          return findAndModifyFirst(
            item,
            'sub',
            { id: category.id },
            { ...cell, items: [newItem, ...cell.items] }
          );
        } else {
          return item;
        }
      });
      this.setState({
        data: newStateData,
        taskList: [newItem, ...taskList]
      });
    }
  };

  handleToggleReady = id => {
    const { data, category } = this.state;
    const tree = deepClone(data);
    const newStateData = tree.map(item => {
      const cell = findFirst(item, 'sub', { id: category.id });
      if (cell) {
        const newCellItems = cell.items.map(item => {
          if (item.id === id) item.done = !item.done;
          return item;
        });
        return findAndModifyFirst(
          item,
          'sub',
          { id: category.id },
          { ...cell, items: newCellItems }
        );
      } else {
        return item;
      }
    });
    this.setState(
      {
        data: newStateData
      },
      () => {
        this.state.showDone ? this.showOnlyDoneItems() : this.showAllItems();
      }
    );
  };

  handleSwitchShowDone = () => {
    const { showDone, category } = this.state;
    this.setState({ showDone: !showDone }, () => {
      if (category) {
        this.state.showDone ? this.showOnlyDoneItems() : this.showAllItems();
      }
    });
  };

  render() {
    const { percentage, data, taskList, showDone, categoryId } = this.state;
    return (
      <div className="App container">
        <Filter onSwitchShowDone={this.handleSwitchShowDone} showDone={showDone} />
        <ProgressBar percentage={percentage} />
        <div className="Main_body">
          <CategoryList
            data={data}
            categoryId={categoryId}
            onAddSubCategory={this.handleAddSubcategory}
            onShowItems={this.handleShowItems}
            onEditCategoryName={this.handleEditCategoryName}
            onDeleteCategory={this.handleDeleteCategory}
            onAddCategory={this.handleAddCategory}
          />
          <TaskList
            taskList={taskList}
            onAddItem={this.handleAddItem}
            onToggleReady={this.handleToggleReady}
          />
        </div>
      </div>
    );
  }
}
