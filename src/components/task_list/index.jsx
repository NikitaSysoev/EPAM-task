import React from 'react';
import TextInput from '../textInput';
import Task from '../task';

const TaskList = (props) => {
    const { onToggleReady, taskList, onAddItem } = props;
    return (
        <div>
            <div style={{ marginRight: '60px', marginBottom: '20px' }}>
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
                    : 'no data'
            }
        </div>
    )
}

export default TaskList;