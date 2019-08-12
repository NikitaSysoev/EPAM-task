import React from 'react';
import TextInput from '../textInput';
import { FORM_EDIT } from '../../lib/const';

const Filter = (props) => {
    const { onSwitchShowDone, showDone, formState } = props;
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline'
        }}>
            <div>
                {formState.state === FORM_EDIT ? formState.editItem.title : 'To-Do List'}
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'baseline'
            }}>
                <label style={{ marginRight: '20px', cursor: 'ponter' }}>
                    <input type="checkbox"
                        onChange={onSwitchShowDone}
                        defaultChecked={showDone}
                    />
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