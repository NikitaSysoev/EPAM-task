import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faShoppingBasket, faDollarSign, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const plusIcon = <div style={{ cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faPlusSquare} />
</div>;
const deleteIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faShoppingBasket} />
</div>;
const detailsIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faDollarSign} />
</div>
const subcategoriesIcon = <div style={{ marginRight: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faAngleDown} />
</div>

const Category = props => {
    const { onShowItems, item } = props;
    const { name, sub, id } = item;
    const handleShowItems = () => onShowItems(id);
    return (
        <div className="category">
            <div className="card" onClick={handleShowItems}>
                <div className="category_title card-body"  >
                    <div style={{ display: 'flex' }}>
                        {subcategoriesIcon}
                        <span style={{ color: '#007bff' }} >{name}</span>
                        {detailsIcon}
                    </div>
                    <div style={{ display: 'flex' }}>
                        {plusIcon}
                        {deleteIcon}
                    </div>
                </div>

            </div>
            <div className="category_content">
                {
                    sub && sub.map(item => <Category
                        key={item.id}
                        item={item}
                        onShowItems={onShowItems} />)
                }
            </div>
        </div>
    )
}

export default Category;