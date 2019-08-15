import React from 'react';
import './Popup.scss';

const Popup = ({ id, message }) => {
	if (!message) return null;
	
	return (
		<div id={id} className="popup">
			{message}
		</div>
	);
};

export default Popup;
