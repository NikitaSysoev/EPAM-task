import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { findAndModifyFirst, findFirst } from "obj-traverse/lib/obj-traverse";
import { flatten, findObj, deepClone } from "./methods";

import "./App.css";
import CategoryList from "./components/category_list";
import TaskList from "./components/task_list";
import ProgressBar from "./components/progressBar";
import Filter from "./components/filter";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          id: 1,
          name: "category1",
          items: [
            { title: "to do item 1", done: true },
            { title: "to do item 2", done: true }
          ],
          sub: []
        },
        {
          id: 2,
          name: "category2",
          items: [
            { title: "to do item 3", done: true },
            { title: "to do item 4", done: true }
          ],
          sub: []
        },
        {
          id: 3,
          name: "category3",
          items: [
            { title: "to do item 5", done: false },
            { title: "to do item 6", done: false }
          ],
          sub: [
            { id: 4, name: "category3 1", items: [] },
            {
              id: 5,
              name: "category3 2",
              items: [
                { title: "to do item 7", done: false },
                { title: "to do item 8", done: false }
              ],
              sub: [
                { id: 55, name: "ok", items: [{ title: "ok", done: false }] }
              ]
            },
            {
              id: 6,
              name: "category3 3",
              items: [{ title: "to do item 9", done: false }]
            }
          ]
        }
      ],
      category: null,
      percentage: 0,
      taskList: []
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
    const allItems = flatten(this.state.data)
      .map(item => item.items)
      .reduce((acc, item) => acc.concat(item));
    const { length } = allItems;
    const { length: doneLength } = allItems.filter(item => item.done);
    const percentage = (doneLength / length) * 100;
    this.setState({ percentage });
  };

  handleShowItems = id => {
    const tree = deepClone(this.state.data);
    const category = findObj(tree, id);
    this.setState({ taskList: category.items, category });
  };

  handleAddCategory = e => {
    const newCategoryName = e.currentTarget.getAttribute("value");
    if (newCategoryName) {
      const newCategory = {
        id: Date.now(),
        name: newCategoryName,
        items: [],
        sub: []
      };
      this.setState({
        data: [newCategory, ...this.state.data]
      });
    }
  };

  handleAddSubcategory = e => {};

  handleAddItem = e => {
    const { category, taskList, data } = this.state;
    const newItemName = e.currentTarget.getAttribute("value");
    if (newItemName) {
      const newItem = {
        title: newItemName,
        done: false
      };
      const tree = deepClone(data);
      const newStateData = tree.map(item => {
        const cell = findFirst(item, "sub", { id: category.id });
        if (cell) {
          return findAndModifyFirst(
            item,
            "sub",
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

  handleToggleReady = title => {
    const { data, category } = this.state;
    const tree = deepClone(data);
    const newStateData = tree.map(item => {
      const cell = findFirst(item, "sub", { id: category.id });
      if (cell) {
        const newCellItems = cell.items.map(item => {
          if (item.title === title) item.done = !item.done;
          return item;
        });
        return findAndModifyFirst(
          item,
          "sub",
          { id: category.id },
          { ...cell, items: newCellItems }
        );
      } else {
        return item;
      }
    });
    this.setState({
      data: newStateData
    });
  };

  // handleDeleteCategory = () => {};

  // handleAddItem = () => {};

  render() {
    const { percentage, data, taskList } = this.state;
    return (
      <div className="App">
        <Filter />
        <ProgressBar percentage={percentage} />
        <div className="Main_body">
          <CategoryList
            data={data}
            onShowItems={this.handleShowItems}
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
