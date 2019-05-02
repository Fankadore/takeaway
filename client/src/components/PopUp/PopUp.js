import React from 'react';
import './Popup.scss';

function PopUp(props) {
	const { id, value } = props;

	if (!value) return null;
	
	return (
		<div id={id} className="popup">
			{value}
		</div>
	);
}

export default PopUp;
