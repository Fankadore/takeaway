import React from 'react';
import './Spinner.scss';

function Spinner(props) {
	const { id } = props;
	const textId = id + "-text";

	return (
		<div id={id} className={id + " spinner"}>
			<p id={textId} className={id + "-text spinner-text"}>Loading</p>
		</div>
	);
}

export default Spinner;
