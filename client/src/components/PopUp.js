import React from 'react';
import './PopUp.scss';

function PopUp(props) {
	if (props.active) {
		return (
			<div className="popup">
				{this.props.children}
			</div>
		)
	}
	else {
		return null;
	}
}

export default PopUp;
