import React from 'react';

function MenuItem(props) {
	const { name, description, price } = props.content;
	
	return (
		<div className="menu__item">
			<h4 className="menu__item-name">{name}</h4>
			<p className="menu__item-price">{"£" + price.toFixed(2)}</p>
			<span className="menu__item-add fas fa-plus-square"></span>
			<p className="menu__item-description">{description}</p>
		</div>
	)
}

export default MenuItem;
