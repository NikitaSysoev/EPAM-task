import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/action_creators';
import './index.css';
import TextInput from '../textInput';
import Category from '../category';
import { FORM_ADD } from '../../lib/const';

const CategoryList = (props) => {
    const { data, addNewCategory, formState } = props;
    const handleAddCategory = text => addNewCategory({ text, data });
    return (
        <div className="category-list">
            {
                formState.state === FORM_ADD &&
                <div style={{ margin: '0 20px 20px 0' }}>
                    <TextInput
                        name='category'
                        onClick={handleAddCategory}
                        placeholder="Enter category title"
                        buttonName="Add"
                    />
                </div>
            }
            {
                data && data.length ?
                    data.map(item =>
                        <Category
                            key={item.id}
                            formState={formState}
                            item={item}
                        />) :
                    <div>No categories</div>
            }
        </div>
    )
}

const mapStateToProps = store => ({
    data: store.app.data,
    formState: store.app.formState
})

const mapDispatchToProps = dispatch => ({
    addNewCategory: payload => dispatch(actions.addNewCategory(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);