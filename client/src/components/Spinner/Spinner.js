import React from 'react';
import './Spinner.scss';

const Spinner = ({ id }) => {
	return (
		<div id={id} className={id + " spinner"}>
			<p id={id + "-text"} className={id + "-text spinner-text"}>Loading</p>
		</div>
	);
};

export default Spinner;
