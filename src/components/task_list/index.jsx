import React from 'react';
import TextInput from '../textInput';
import Task from '../task';

export default class TaskList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        }
    }

    handleChangeText = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    render() {
        return (
            <div>
                <div style={{ marginRight: '60px', marginBottom: '20px' }}>
                    <TextInput
                        buttonName="Add"
                        onChange={this.handleChangeText}
                        onClick={this.props.onAddItem}
                        value={this.state.text}
                        placeholder="Text input with button" />
                </div>
                {
                    this.props.taskList.length ?
                        this.props.taskList.map(item => <Task
                            key={item.title}
                            item={item}
                            onToggleReady={this.props.onToggleReady} />)
                        : 'no data'
                }
            </div>
        )
    }
}