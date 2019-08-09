import React from 'react';

import TextInput from '../textInput';
import Category from '../category';

const CategoryList = (props) => {
    const { data, onShowItems, onAddCategory } = props;
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <TextInput
                    name='category'
                    onClick={onAddCategory}
                    placeholder="Enter category title"
                    buttonName="Add" />
            </div>
            {
                data.map(item => <Category key={item.id} item={item} onShowItems={onShowItems} />)
            }
        </div>
    )
}

export default CategoryList;