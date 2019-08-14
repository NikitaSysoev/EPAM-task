import React from 'react';
import TextInput from '../textInput';
import { FORM_EDIT } from '../../lib/const';
import { connect } from 'react-redux';
import * as actions from '../../store/action_creators';

const Filter = (props) => {
    const { showDone, formState, handleSwitchDone } = props;
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
                        onChange={handleSwitchDone}
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

const mapStateToProps = store => ({
    showDone: store.app.showDone,
    formState: store.app.formState
})

const mapDispatchToProps = dispatch => ({
    handleSwitchDone: () => dispatch(actions.switchShowDone())
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter);