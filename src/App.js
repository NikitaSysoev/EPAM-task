import React from 'react';
import { findAndModifyFirst, findFirst } from 'obj-traverse/lib/obj-traverse';
import { connect } from 'react-redux';
import * as actions from './store/action_creators';

import { findObj, deepClone } from './lib';
import { FORM_ADD, FORM_EDIT } from './lib/const';
import './App.css';
import CategoryList from './components/category_list';
import TaskList from './components/task_list';
import ProgressBar from './components/progressBar';
import Filter from './components/filter';

class App extends React.Component {
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
    const { calculatePercentage, data } = this.props;
    calculatePercentage({ data });
  }

  componentDidUpdate(prevProps) {
    const { showDone, data, rerenderItems, calculatePercentage, categoryId } = this.props;
    if (JSON.stringify(data) !== JSON.stringify(prevProps.data)) {
      calculatePercentage({ data });
      rerenderItems({ categoryId, showDone, data });
    }
    if (prevProps.showDone !== showDone) {
      rerenderItems({ categoryId, showDone, data });
    }
    if (prevProps.categoryId !== categoryId) {
      rerenderItems({ categoryId, showDone, data });
    }
  }

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
      this.setState({ data: newStateData });
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
      this.setState({ data: newStateData });
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

  render() {
    const { formState } = this.state;
    return (
      <div className="App container">
        <Filter formState={formState} />
        <ProgressBar />
        <div className="Main_body">
          <CategoryList
            formState={formState}
            onMoveTaskIntoAnotherCategory={this.handleMoveTaskIntoAnotherCategory}
            onEditCategoryName={this.handleEditCategoryName}
          />
          <TaskList
            onUpgradeItems={this.handleUpgradeItems}
            onShowDetails={this.handleShowDetails}
            onCloseDetails={this.handleCloseDetails}
            formState={formState}
            onAddItem={this.handleAddItem}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  showDone: store.app.showDone,
  data: store.app.data,
  categoryId: store.app.category && store.app.category.id
});

const mapDispatchToProps = dispatch => ({
  calculatePercentage: payload => dispatch(actions.calculatePercentage(payload)),
  rerenderItems: payload => dispatch(actions.rerenderItems(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
