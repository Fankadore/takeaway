import React from 'react';
import './ActionButton.scss';

function ActionButton(props) {
	const { id, action, callback, hide } = props;

	if (hide) return null;
	
	const onDragStart = (e) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
		e.dataTransfer.setDragImage(e.target.parentNode, e.target.parentNode.width, e.target.parentNode.height / 2);
		if (callback) callback();
	};

	switch (action) {
		case "remove":
			return <span id={id} onClick={callback} className="action-button fas fa-trash-alt" />
		case "move":
			return <span id={id} onDragStart={onDragStart} className="action-button fas fa-crosshairs" draggable />
		case "edit":
			return <span id={id} onClick={callback} className="action-button fas fa-edit" />
		default:
			return <span id={id} onClick={callback} className="action-button fas fa-plus-square" />
	}
}

export default ActionButton;
