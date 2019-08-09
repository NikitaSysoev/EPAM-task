import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';

const detailsIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faDollarSign} />
</div>

const Task = props => {
    const { title, done } = props.item;
    // вместо title передавать id
    const handleChecked = () => props.onToggleReady(title);
    return (
        <div className="card">
            <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <input type="checkbox"
                        defaultChecked={done}
                        onClick={handleChecked}
                        style={{ marginRight: '30px' }} />
                    {title}
                </div>
                {detailsIcon}
            </div>
        </div>
    )
}

export default Task;