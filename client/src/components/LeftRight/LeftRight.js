import React from 'react';
import './LeftRight.scss';

function LeftRight(props) {
	const { id, left, right } = props;

	return (
		<div id={id} className={id + " left-right"}>
			<span onClick={left} className={id + "-left left-right__arrow fas fa-caret-left"} />
			<span onClick={right} className={id + "-right left-right__arrow fas fa-caret-right"} />
		</div>
	);
}

export default LeftRight;
