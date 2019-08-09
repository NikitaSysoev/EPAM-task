import React from 'react';

const TextInput = props => {
    const { name, onChange, value = '', onClick, placeholder, buttonName, width = '100%' } = props;
    return (
        <div className="input-group" style={{ width }}>
            <input
                onChange={onChange}
                type="text"
                name={name}
                value={value}
                className={`form-control`}
                placeholder={placeholder}
            />
            <div
                className="input-group-append"
                value={value}
                onClick={onClick}
                style={{ cursor: 'pointer' }}
            >
                <span className="input-group-text">
                    {
                        buttonName ? buttonName : 'x'
                    }
                </span>
            </div>

        </div>
    )
}

export default TextInput;
