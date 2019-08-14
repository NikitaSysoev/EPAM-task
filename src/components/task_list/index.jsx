import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/action_creators';
import { FORM_ADD } from '../../lib/const';
import TextInput from '../textInput';
import Task from '../task';
import './index.css';
import TaskEdit from '../task_edit';

const TaskList = (props) => {
    const { taskList, addItem, categoryId, data, formState } = props;
    const onAddItem = (text) => {
        if (text && taskList && categoryId && data) {
            addItem({ text, taskList, categoryId, data });
        }
    }
    return (
        <div className="task-list">
            {
                formState.state === FORM_ADD &&
                <div style={{ margin: '0 10px 20px 160px' }}>
                    <TextInput
                        buttonName="Add"
                        onClick={onAddItem}
                        placeholder="Text input with button"
                    />
                </div>
            }
            {
                formState.state === FORM_ADD ?
                    (taskList && taskList.length ?
                        taskList.map(item =>
                            <Task key={item.id} item={item} />)
                        : <div style={{ textAlign: 'end' }}>
                            No tasks
                    </div>) : <TaskEdit />
            }
        </div>
    )
}

const mapStateToProps = store => ({
    taskList: store.app.taskList,
    formState: store.app.formState,
    data: store.app.data,
    categoryId: store.app.category && store.app.category.id
});

const mapDispatchToProps = dispatch => ({
    addItem: payload => dispatch(actions.addItem(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);