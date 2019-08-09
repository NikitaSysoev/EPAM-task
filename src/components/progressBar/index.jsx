import React from 'react';
import './index.css';
import Filler from './filler';

const ProgressBar = props => {
    return <div className="progress-bar0">
        <Filler percentage={props.percentage || 0} />
    </div>
}

export default ProgressBar;