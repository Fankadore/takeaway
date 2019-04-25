import React from 'react';
import './Address.scss';

function Address(props) {
	const { id, address } = props;
	const addressItems = Object.keys(address).map(key => address[key]);

	return (
		<div id={id} className="address">
			{addressItems.map((item, index) => <p key={index} className="address__item">{item}</p>)}
		</div>
	);
}

export default Address;
