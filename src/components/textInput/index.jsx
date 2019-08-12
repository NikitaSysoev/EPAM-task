import React, { useState } from 'react';

const TextInput = props => {
    const [text, setText] = useState('');
    const handleChange = (e) => setText(e.target.value);
    const { name, onClick, placeholder, buttonName, width = '100%' } = props;
    const handleClick = () => {
        onClick(text);
        setText('');
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
                        buttonName ? buttonName : 'x'
                    }
                </span>
            </div>

        </div>
    )
}

export default TextInput;
