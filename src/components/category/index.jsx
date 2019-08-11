import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faShoppingBasket, faDollarSign, faAngleDown, faAngleRight, faBan, faCheck }
    from '@fortawesome/free-solid-svg-icons';
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
const subCategoriesClosedIcon = <div style={{ marginRight: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faAngleRight} />
</div>
const subCategoriesOpenedIcon = <div style={{ marginRight: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faAngleDown} />
</div>
const okIcon = <div style={{ marginRight: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faCheck} />
</div>
const cancelIcon = <div style={{ marginRight: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faBan} />
</div>

const Category = props => {
    const [visible, switchVisible] = useState(false);
    const [edit, setEdit] = useState(false);
    const [text, setText] = useState('');
    const [status, setStatus] = useState(null);

    const { onShowItems, item, categoryId, onDeleteCategory,
        onEditCategoryName, onAddSubCategory } = props;
    const { name, sub, id } = item;

    const handleShowItems = () => onShowItems(id);
    const handleDeleteCategory = () => onDeleteCategory(id);
    const handleShowSubCategories = () => switchVisible(state => !state);
    const handleChangeText = e => setText(e.target.value);
    const handleCancel = () => {
        setText('');
        setEdit(false);
        setStatus(null);
    }
    const handleEdit = (e) => {
        const value = e.currentTarget.getAttribute('name');
        setEdit(true);
        setStatus(value);
    }
    const handleAccept = () => {
        if (edit && text) {
            if (status === 'editCategoryName') {
                onEditCategoryName(id, text);
            } else if (status === 'addSubCategory') {
                onAddSubCategory(id, text);
            }
        }
        setText('');
        setEdit(false);
        setStatus(null);
    }

    return (
        <div className="category">
            <div className={`card ${categoryId === id && 'alert-primary'}`}>
                <div className="category_title card-body">
                    <div style={{ display: 'flex' }}>
                        <div onClick={handleShowSubCategories}>
                            {visible && sub && sub.length ?
                                subCategoriesOpenedIcon : subCategoriesClosedIcon}
                        </div>
                        {
                            edit ? <input type="text" value={text} onChange={handleChangeText} />
                                : <span style={{ color: '#007bff' }}
                                    onClick={handleShowItems}>
                                    {name}
                                </span>
                        }
                        {
                            !edit && <div name="editCategoryName" onClick={handleEdit}>
                                {detailsIcon}
                            </div>
                        }
                        {
                            edit && <div onClick={handleAccept}>{okIcon}</div>
                        }
                        {
                            edit && <div onClick={handleCancel}>
                                {cancelIcon}
                            </div>
                        }
                    </div>
                    {
                        !edit && <div style={{ display: 'flex' }}>
                            <div name="addSubCategory"
                                onClick={handleEdit}>
                                {plusIcon}
                            </div>
                            <div onClick={handleDeleteCategory}>
                                {deleteIcon}
                            </div>
                        </div>
                    }
                </div>

            </div>
            <div className="category_content">
                {
                    sub && visible && sub.map(item =>
                        <Category
                            key={item.id}
                            item={item}
                            categoryId={categoryId}
                            onAddSubCategory={onAddSubCategory}
                            onEditCategoryName={onEditCategoryName}
                            onDeleteCategory={onDeleteCategory}
                            onShowItems={onShowItems} />)
                }
            </div>
        </div>
    )
}

export default Category;