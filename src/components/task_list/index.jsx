import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/action_creators';

import { FORM_ADD, FORM_EDIT } from '../../lib/const';
import TextInput from '../textInput';
import Task from '../task';
import './index.css';
import TaskEdit from '../task_edit';

const TaskList = (props) => {
    const { taskList, onAddItem, onShowDetails,
        formState, onCloseDetails, onUpgradeItems } = props;
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
                formState.state === FORM_ADD &&
                (taskList && taskList.length ?
                    taskList.map(item =>
                        <Task
                            key={item.id}
                            item={item}
                            onShowDetails={onShowDetails}
                        />)
                    : <div style={{ textAlign: 'end' }}>No tasks</div>)
            }
            {
                formState.state === FORM_EDIT &&
                <TaskEdit
                    editItem={formState.editItem}
                    currentCategoryId={formState.currentCategoryId}
                    onCloseDetails={onCloseDetails}
                    onUpgradeItems={onUpgradeItems}
                />
            }
        </div>
    )
}

const mapStateToProps = store => ({
    taskList: store.app.taskList
});

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);