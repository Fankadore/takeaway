import React from 'react';
import './UpDown.scss';

function UpDown(props) {
	const { up, down } = props;

	return (
		<div className="up-down">
			<span onClick={up} className="up-down__arrow fas fa-caret-up" />
			<span onClick={down} className="up-down__arrow fas fa-caret-down" />
		</div>
	);
}

export default UpDown;
