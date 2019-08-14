import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const delIcon = <div style={{ cursor: 'pointer' }}>
    <FontAwesomeIcon icon={faWindowClose} />
</div>;

const TextInput = props => {
    const [text, setText] = useState('');
    const { name, onClick, placeholder, buttonName, width = '100%', onChange = null } = props;
    const handleChange = (e) => {
        const { value } = e.target;
        setText(value);
        onChange && onChange(value);
    }
    const handleClick = () => {
        if (text && buttonName) {
            onClick(text);
            setText('');
        }
        if (!buttonName) {
            setText('');
            onClick();
        }
    }

    return (
        <div className="input-group" style={{ width }}>
            <input
                onChange={handleChange}
                type="text"
                name={name}
                value={text}
                className="form-control"
                placeholder={placeholder}
            />
            <div
                className="input-group-append"
                onClick={handleClick}
                style={{ cursor: 'pointer' }}
            >
                <span className="input-group-text">
                    {
                        buttonName ? buttonName : delIcon
                    }
                </span>
            </div>

        </div>
    )
}

export default TextInput;
