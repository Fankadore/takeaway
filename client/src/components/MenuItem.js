import React from 'react';
import './MenuItem.scss';

function MenuItem({ name, description, price }) {
	if (name === "") name = "Title...";
	
	price = parseFloat(price);
	if (price >= 0) price = price.toFixed(2);
	else price = 0;

	return (
		<div className="menu__item">
			<h4 className="menu__item-name">{name}</h4>
			<p className="menu__item-price">{"£" + price}</p>
			<span className="menu__item-add fas fa-plus-square"></span>
			<p className="menu__item-description">{description}</p>
		</div>
	)
}

export default MenuItem;
