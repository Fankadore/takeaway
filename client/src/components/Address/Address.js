import React from 'react';
import './Address.scss';

function Address(props) {
	const { id, address } = props;
	const addressItems = Object.keys(address).map(key => address[key]);

	return (
		<div id={id} className={id + " address"}>
			{addressItems.map((item, index) => <p key={index} className={id + "-item address-item"}>{item}</p>)}
		</div>
	);
}

export default Address;
