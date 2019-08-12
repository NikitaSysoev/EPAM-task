import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

const detailsIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faEdit} />
</div>

const Task = props => {
    const { item, onToggleReady, onShowDetails } = props;
    const { title, done, id } = item;
    const handleChecked = () => onToggleReady(id);
    const handleShowDetails = () => onShowDetails(id);
    return (
        <div className="card">
            <div className="card-body"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                <div>
                    <input type="checkbox"
                        checked={done}
                        onChange={handleChecked}
                        style={{ marginRight: '30px' }} />
                    {title}
                </div>
                <div onClick={handleShowDetails}>
                    {detailsIcon}
                </div>
            </div>
        </div>
    )
}

export default Task;