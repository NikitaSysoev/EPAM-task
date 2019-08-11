import React from 'react';
import TextInput from '../textInput';
import Task from '../task';
import './index.css';

const TaskList = (props) => {
    const { onToggleReady, taskList, onAddItem } = props;
    return (
        <div className="task-list">
            <div style={{ margin: '0 10px 20px 160px' }}>
                <TextInput
                    buttonName="Add"
                    onClick={onAddItem}
                    placeholder="Text input with button" />
            </div>
            {
                taskList.length ?
                    taskList.map(item => <Task
                        key={item.id}
                        item={item}
                        onToggleReady={onToggleReady} />)
                    : <div style={{ textAlign: 'end' }}>No tasks</div>
            }
        </div>
    )
}

export default TaskList;