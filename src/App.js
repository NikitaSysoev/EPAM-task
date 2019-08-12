import React from 'react';
import { findAndModifyFirst, findFirst, findAndDeleteFirst } from 'obj-traverse/lib/obj-traverse';

import { flatten, findObj, deepClone } from './lib';
import { FORM_ADD, FORM_EDIT } from './lib/const';
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
          id: 3,
          name: 'category3',
          items: [
            { id: 31, title: 'to do item 5', done: true, description: 'okey' },
            { id: 32, title: 'to do item 6', done: false, description: 'lets go' }
          ],
          sub: [
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
            }
          ]
        }
      ],
      category: null,
      categoryId: 0,
      percentage: 0,
      taskList: [],
      showDone: false,
      formState: {
        state: FORM_ADD,
        editItem: null,
        moveTask: false
      }
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
          { ...cell, sub: [newCategory, ...cell.sub] }
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

  handleShowDetails = id => {
    const tree = deepClone(this.state.data);
    const category = findObj(tree, this.state.categoryId);
    const item = category.items.find(item => item.id === id);
    this.setState({
      formState: {
        state: FORM_EDIT,
        editItem: item,
        currentCategoryId: this.state.categoryId
      },
      category
    });
  };

  handleCloseDetails = () => {
    this.setState({
      formState: {
        state: FORM_ADD,
        editItem: null,
        moveTask: false
      }
    });
  };

  handleUpgradeItems = (itemId, categoryId, newItem) => {
    const { data, formState } = this.state;
    const tree = deepClone(data);
    if (formState.moveTask) {
      const newStateData = tree
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
      this.setState({ data: newStateData }, () => {
        this.state.showDone ? this.showOnlyDoneItems() : this.showAllItems();
      });
    } else {
      const newStateData = tree.map(category => {
        const cell = findFirst(category, 'sub', { id: categoryId });
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.map(item => {
              if (item.id === itemId) {
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
                if (item.id === itemId) {
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
      this.setState({ data: newStateData }, () => {
        this.state.showDone ? this.showOnlyDoneItems() : this.showAllItems();
      });
    }
  };

  handleMoveTaskIntoAnotherCategory = id => {
    this.setState(prevState => ({
      formState: {
        ...prevState.formState,
        currentCategoryId: id,
        moveTask: true,
        prevCategoryId: prevState.formState.currentCategoryId
      }
    }));
  };

  handleAddItem = text => {
    const { category, taskList, data } = this.state;
    if (text && category) {
      const newItem = {
        id: Date.now(),
        title: text,
        done: false,
        description: ''
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
    const { percentage, data, taskList, showDone, categoryId, formState } = this.state;
    return (
      <div className="App container">
        <Filter
          formState={formState}
          onSwitchShowDone={this.handleSwitchShowDone}
          showDone={showDone}
        />
        <ProgressBar percentage={percentage} />
        <div className="Main_body">
          <CategoryList
            data={data}
            categoryId={categoryId}
            formState={formState}
            onMoveTaskIntoAnotherCategory={this.handleMoveTaskIntoAnotherCategory}
            onAddSubCategory={this.handleAddSubcategory}
            onShowItems={this.handleShowItems}
            onEditCategoryName={this.handleEditCategoryName}
            onDeleteCategory={this.handleDeleteCategory}
            onAddCategory={this.handleAddCategory}
          />
          <TaskList
            taskList={taskList}
            onUpgradeItems={this.handleUpgradeItems}
            onShowDetails={this.handleShowDetails}
            onCloseDetails={this.handleCloseDetails}
            formState={formState}
            onAddItem={this.handleAddItem}
            onToggleReady={this.handleToggleReady}
          />
        </div>
      </div>
    );
  }
}
