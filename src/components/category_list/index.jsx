import React from 'react';

import './index.css';
import TextInput from '../textInput';
import Category from '../category';
import { FORM_ADD } from '../../lib/const';

const CategoryList = (props) => {
    const { data, onShowItems, onAddCategory, categoryId, onMoveTaskIntoAnotherCategory,
        onDeleteCategory, onAddSubCategory, onEditCategoryName, formState } = props;
    return (
        <div className="category-list">
            {
                formState.state === FORM_ADD &&
                <div style={{ margin: '0 20px 20px 0' }}>
                    <TextInput
                        name='category'
                        onClick={onAddCategory}
                        placeholder="Enter category title"
                        buttonName="Add" />
                </div>
            }
            {
                data.length ? data.map(item =>
                    <Category
                        key={item.id}
                        formState={formState}
                        categoryId={categoryId}
                        item={item}
                        onMoveTaskIntoAnotherCategory={onMoveTaskIntoAnotherCategory}
                        onAddSubCategory={onAddSubCategory}
                        onEditCategoryName={onEditCategoryName}
                        onShowItems={onShowItems}
                        onDeleteCategory={onDeleteCategory}
                    />) : <div>No categories</div>
            }
        </div>
    )
}

export default CategoryList;