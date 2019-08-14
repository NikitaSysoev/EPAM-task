import React from 'react';
import { connect } from 'react-redux';
import * as actions from './store/action_creators';

import './App.css';
import CategoryList from './components/category_list';
import TaskList from './components/task_list';
import ProgressBar from './components/progressBar';
import Filter from './components/filter';

class App extends React.Component {

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

  render() {
    return (
      <div className="App container">
        <Filter />
        <ProgressBar />
        <div className="Main_body">
          <CategoryList />
          <TaskList />
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
