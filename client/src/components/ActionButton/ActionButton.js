import React from 'react';
import './ActionButton.scss';

function ActionButton(props) {
	const { id, action, callback, hide } = props;

	if (hide) return null;

	switch (action) {
		case "remove":
			return <span id={id} onClick={callback} className="action-button fas fa-trash-alt" />
		case "move":
			return <span id={id} onDragStart={(e) => callback(e)} className="action-button fas fa-crosshairs" draggable />
		case "edit":
			return <span id={id} onClick={callback} className="action-button fas fa-edit" />
		default:
			return <span id={id} onClick={callback} className="action-button fas fa-plus-square" />
	}
}

export default ActionButton;
