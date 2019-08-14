import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlusSquare, faShoppingBasket, faEdit, faAngleDown,
    faAngleRight, faBan, faCheck, faArrowCircleLeft
} from '@fortawesome/free-solid-svg-icons';

import './index.css';
import { FORM_ADD } from '../../lib/const';
import { connect } from 'react-redux';
import * as actions from '../../store/action_creators';

const plusIcon = <div style={{ cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faPlusSquare} />
</div>;
const deleteIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faShoppingBasket} />
</div>;
const detailsIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faEdit} />
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

    const { item, categoryId, deleteCategory,
        addSubCategory, formState, changeCategoryForTask,
        editCategoryName, selectCategory, data } = props;
    const { name, sub, id } = item;

    const handleShowItems = () => selectCategory({ data, id });
    const handleDeleteCategory = () => deleteCategory({ data, id });
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
                editCategoryName({ id, text, data });
            } else if (status === 'addSubCategory') {
                addSubCategory({ text, id, data });
            }
        }
        setText('');
        setEdit(false);
        setStatus(null);
    }
    const handleChangeCategoryForTask = () => changeCategoryForTask({ id });

    return (
        <div className="category">
            <div className={`card ${categoryId === id && 'alert-primary'}`}>
                <div className="category_title card-body">
                    <div style={{ display: 'flex' }}>
                        <div onClick={handleShowSubCategories}>
                            {(sub && !sub.length) || (!sub) ? '' : sub && sub.length && visible ?
                                subCategoriesOpenedIcon : subCategoriesClosedIcon}
                        </div>
                        {
                            edit ? <input
                                type="text"
                                value={text}
                                onChange={handleChangeText}
                                style={{ margin: '0 10px' }}
                            />
                                : <span
                                    style={{ color: '#007bff', cursor: 'pointer', margin: '0 10px' }}
                                    onClick={handleShowItems}>
                                    {name}
                                </span>
                        }
                        {
                            !edit && formState.state === FORM_ADD &&
                            <div name="editCategoryName" onClick={handleEdit}>
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
                        !edit && formState.state === FORM_ADD ?
                            <div style={{ display: 'flex' }}>
                                <div name="addSubCategory"
                                    onClick={handleEdit}>
                                    {plusIcon}
                                </div>
                                <div onClick={handleDeleteCategory}>
                                    {deleteIcon}
                                </div>
                            </div>
                            : !edit ?
                                <div onClick={handleChangeCategoryForTask}
                                    style={{
                                        marginRight: '5px', cursor: 'pointer',
                                        color: formState.currentCategoryId === id ? 'grey' : "black"
                                    }}
                                >
                                    <FontAwesomeIcon icon={faArrowCircleLeft} />
                                </div> : ''
                    }
                </div>

            </div>
            <div className="category_content">
                {
                    sub && visible && sub.map(item =>
                        <Category
                            key={item.id}
                            item={item}
                            formState={formState}
                            categoryId={categoryId}
                            data={data}
                            selectCategory={selectCategory}
                            changeCategoryForTask={changeCategoryForTask}
                            addSubCategory={addSubCategory}
                            editCategoryName={editCategoryName}
                            deleteCategory={deleteCategory}
                        />)
                }
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    data: store.app.data,
    categoryId: store.app.category && store.app.category.id
});

const mapDispatchToProps = dispatch => ({
    selectCategory: payload => dispatch(actions.selectCategory(payload)),
    addSubCategory: payload => dispatch(actions.addSubCategory(payload)),
    deleteCategory: payload => dispatch(actions.deleteCategory(payload)),
    editCategoryName: payload => dispatch(actions.editCategoryName(payload)),
    changeCategoryForTask: payload => dispatch(actions.changeCategoryForTask(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);