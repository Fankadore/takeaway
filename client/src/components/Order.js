import React from 'react';
import Menu from './Menu';

function Order(props) {
	const { menu } = props;

	return (
		<main className="main">
			<h1 className="main__title">Order Online</h1>
			<Menu menu={menu} />
		</main>
	)
}

export default Order;
