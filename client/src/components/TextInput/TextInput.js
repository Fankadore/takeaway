import React from 'react';
import Textarea from 'react-textarea-autosize';
import './TextInput.scss';

function TextInput(props) {
	const { id, update, value, placeholder, edit } = props;
	if (edit) return <Textarea id={id} resize={null} className={id + " text-input text-input--input"} onChange={update} value={value} placeholder={placeholder} />
	else return <p id={id} className={id + " text-input text-input--display"}>{value}</p>
}

export default TextInput;
