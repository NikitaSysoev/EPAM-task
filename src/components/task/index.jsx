import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import * as actions from '../../store/action_creators';

const detailsIcon = <div style={{ marginLeft: '5px', cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faEdit} />
</div>

const Task = props => {
    const { item, toggleDone, data, category, showDetails } = props;
    const { title, done, id } = item;
    const handleChecked = () => toggleDone({ id, data, category });
    const handleShowDetails = () => showDetails({ itemId: id, data, categoryId: category.id });
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

const mapStateToProps = store => ({
    data: store.app.data,
    category: store.app.category,
});

const mapDispatchToProps = dispatch => ({
    toggleDone: payload => dispatch(actions.toggleDone(payload)),
    showDetails: payload => dispatch(actions.showDetails(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Task);