import React from 'react';

import TextInput from '../textInput';
import Category from '../category';

export default class CategoryList extends React.Component {
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
        const { data, onShowItems, onAddCategory } = this.props;
        return (
            <div>
                <div style={{ marginBottom: '20px' }}>
                    <TextInput
                        name='category'
                        onChange={this.handleChangeText}
                        onClick={onAddCategory}
                        value={this.state.text}
                        placeholder="Enter category title"
                        buttonName="Add" />
                </div>
                {
                    data.map(item => <Category key={item.id} item={item} onShowItems={onShowItems} />)
                }
            </div>
        )
    }
}