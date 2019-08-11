import React from 'react';

import './index.css';
import TextInput from '../textInput';
import Category from '../category';

const CategoryList = (props) => {
    const { data, onShowItems, onAddCategory, categoryId,
        onDeleteCategory, onAddSubCategory, onEditCategoryName } = props;
    return (
        <div className="category-list">
            <div style={{ margin: '0 20px 20px 0' }}>
                <TextInput
                    name='category'
                    onClick={onAddCategory}
                    placeholder="Enter category title"
                    buttonName="Add" />
            </div>
            {
                data.length ? data.map(item =>
                    <Category
                        key={item.id}
                        categoryId={categoryId}
                        item={item}
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