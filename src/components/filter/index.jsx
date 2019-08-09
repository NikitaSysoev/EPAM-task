import React from 'react';
import TextInput from '../textInput';

export default class Filter extends React.Component {
    render() {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
            }}>
                <div>To-Do List</div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'baseline'
                }}>
                    <label style={{ marginRight: '20px', cursor: 'ponter' }}>
                        <input type="checkbox" /> Show done</label>
                    <TextInput
                        placeholder="Search"
                        width="300px"
                    />
                </div>
            </div>
        )
    }
}