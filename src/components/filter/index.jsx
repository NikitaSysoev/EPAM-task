import React from 'react';
import TextInput from '../textInput';

const Filter = (props) => {
    const { onSwitchShowDone, showDone } = props;
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
                    <input type="checkbox"
                        onChange={onSwitchShowDone}
                        defaultChecked={showDone} />
                    Show done
                    </label>
                <TextInput
                    placeholder="Search"
                    width="300px"
                />
            </div>
        </div>
    )
}

export default Filter;