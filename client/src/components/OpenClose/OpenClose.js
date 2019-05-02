import React from 'react';
import './OpenClose.scss';

function OpenClose(props) {
	const { id, isOpen, open, close, hide } = props;

	if (hide) return null;
	
	if (isOpen) return <span id={id} onClick={close} className={id + " open-close fas fa-minus"} />
	else return <span id={id} onClick={open} className={id + " open-close fas fa-plus"} />
}

export default OpenClose;
