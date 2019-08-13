import React from 'react';
import { connect } from 'react-redux';

const Filler = ({ percentage }) => {
    return <div className="filler" style={{ width: `${percentage}%` }} />
}

const mapStateToProps = store => ({
    percentage: store.app.percentage
})

export default connect(mapStateToProps)(Filler);