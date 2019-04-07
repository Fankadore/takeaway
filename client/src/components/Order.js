import React from 'react';
import Menu from './Menu';
import './Order.scss';

function Order(props) {
	const { menu, dishes } = props;
	
	return (
		<main className="order">
			<h1 className="order__title">Order Online</h1>
			<Menu menu={menu} />
		</main>
	)
}

export default Order;
