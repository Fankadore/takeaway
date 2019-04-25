import React from 'react';
import './ConfirmBar.scss';

function ConfirmBar(props) {
	const { id, cancel, confirm, hide } = props;

	if (hide) return null;
	
	return (
		<div id={id} className="confirm-bar">
			<span onClick={cancel} className="confirm-bar__icon fas fa-times" />
			<span onClick={confirm} className="confirm-bar__icon fas fa-check" />
		</div>
	);
}

export default ConfirmBar;
