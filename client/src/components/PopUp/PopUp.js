import React from 'react';
import './PopUp.scss';

function PopUp(props) {
	const { id, value } = props;

	if (!value) return null;
	
	return (
		<div id={id} className="pop-up">
			{value}
		</div>
	);
}

export default PopUp;
