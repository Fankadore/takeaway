import React from 'react';
import './Spinner.scss';

function Spinner(props) {
	const { id } = props;
	const textId = id + "-text";

	return (
		<div id={id} className="spinner">
			<p id={textId} className="spinner__text">Loading</p>
		</div>
	);
}

export default Spinner;
