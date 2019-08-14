import React, { useRef } from 'react';
import { connect } from 'react-redux';

import * as actions from '../../store/action_creators';

const TaskEdit = (props) => {
    const inputText = useRef(null);
    const inputCheckbox = useRef(null);
    const textArea = useRef(null);

    const { saveChanges, closeDetails, formState, data } = props;
    const { editItem, currentCategoryId } = formState;
    const { id, title, done, description } = editItem;

    const handleSaveChanges = () => {
        const newTitle = inputText.current.value;
        const done = inputCheckbox.current.checked;
        const description = textArea.current.value;
        if (newTitle) {
            const newItem = { id, title: newTitle, done, description };
            saveChanges({ data, formState, newItem, categoryId: currentCategoryId })
            closeDetails()
        }
    }
    const handleCloseDetails = () => closeDetails();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    type="button"
                    onClick={handleSaveChanges}
                    className="btn btn-light">
                    Save Changes
                </button>
                <button
                    type="button"
                    onClick={handleCloseDetails}
                    className="btn btn-light"
                >
                    Cancel
                </button>
            </div>
            <div>
                <div className="form-group">
                    <input type="text"
                        defaultValue={title}
                        ref={inputText}
                    />
                </div>
                <div className="form-group">
                    <input type="checkbox"
                        defaultChecked={done}
                        ref={inputCheckbox}
                    />
                    Done
                </div>
                <div className="form-group">
                    <textarea
                        className="form-control"
                        rows="10"
                        defaultValue={description}
                        ref={textArea}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = store => ({
    taskList: store.app.taskList,
    formState: store.app.formState,
    data: store.app.data,
    categoryId: store.app.category && store.app.category.id
});

const mapDispatchToProps = dispatch => ({
    addItem: payload => dispatch(actions.addItem(payload)),
    closeDetails: () => dispatch(actions.closeDetails()),
    saveChanges: payload => dispatch(actions.saveChanges(payload))
})

export default connect(mapStateToProps, mapDispatchToProps)(TaskEdit);