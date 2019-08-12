import React, { useRef } from 'react';

const TaskEdit = ({ editItem, onCloseDetails, onUpgradeItems, currentCategoryId }) => {
    const inputText = useRef(null);
    const inputCheckbox = useRef(null);
    const textArea = useRef(null);

    const { id, title, done, description } = editItem;
    const handleSaveChanges = () => {
        const newTitle = inputText.current.value;
        const done = inputCheckbox.current.checked;
        const description = textArea.current.value;
        if (newTitle) {
            const newItem = { id, title: newTitle, done, description };
            onUpgradeItems(id, currentCategoryId, newItem);
            onCloseDetails();
        }
    }
    const handleCloseDetails = () => onCloseDetails();

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
                    className="btn btn-light">
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

export default TaskEdit;