import React from 'react';
import { connect } from 'react-redux';

import TextInput from '../textInput';
import { FORM_EDIT } from '../../lib/const';
import * as actions from '../../store/action_creators';

const Filter = (props) => {
    const { showDone, formState, handleSwitchDone,
        filterTaskList, data, categoryId, selectCategory } = props;

    const handleFilter = text => {
        if (categoryId) {
            filterTaskList({ text, data, categoryId })
        }
    }
    const handleCancelFilter = () => {
        if (categoryId) {
            selectCategory({ data, id: categoryId })
        }
    }

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
                    onChange={handleFilter}
                    onClick={handleCancelFilter}
                />
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    showDone: store.app.showDone,
    formState: store.app.formState,
    data: store.app.data,
    categoryId: store.app.category && store.app.category.id
})

const mapDispatchToProps = dispatch => ({
    handleSwitchDone: () => dispatch(actions.switchShowDone()),
    filterTaskList: (payload) => dispatch(actions.filterTaskList(payload)),
    selectCategory: payload => dispatch(actions.selectCategory(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(Filter);