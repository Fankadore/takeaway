import React from 'react';
import './UpDown.scss';

function UpDown(props) {
	const { id, up, down } = props;

	return (
		<div id={id} className={id + " up-down"}>
			<span onClick={up} className={id + "-up up-down__arrow fas fa-caret-up"} />
			<span onClick={down} className={id + "-down up-down__arrow fas fa-caret-down"} />
		</div>
	);
}

export default UpDown;
