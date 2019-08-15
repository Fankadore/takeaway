import React from 'react';
import './Arrow.scss';

const Arrow = ({ id, direction, onClick }) => {
	const renderArrow = () => {
		switch (direction) {
			case 'left':
				return <span onClick={onClick} className={id + "__arrow-icon arrow-icon fas fa-caret-left"} />
			case 'right':
				return <span onClick={onClick} className={id + "__arrow-icon arrow-icon fas fa-caret-right"} />
			case 'up':
				return <span onClick={onClick} className={id + "__arrow-icon arrow-icon fas fa-caret-up"} />
			case 'down':
				return <span onClick={onClick} className={id + "__arrow-icon arrow-icon fas fa-caret-down"} />
			default:
				return null;
		}
	};
	
	return (
		<div id={id} className={id + "__arrow arrow"}>
			{renderArrow()}
		</div>
	);
};

export default Arrow;
