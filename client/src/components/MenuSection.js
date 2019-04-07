import React from 'react';
import MenuItem from './MenuItem';
import './MenuSection.scss';

function MenuSection({ title, description, items, openAddDish }) {
	return (
		<section className="menu__section">
			<div className="menu__section-title">
				<span className="menu__section-title-spacer fas fa-plus"></span>
				<h3 className="menu__section-title-text">{title}</h3>
				<span onClick={openAddDish} className="menu__section-title-add fas fa-plus"></span>
			</div>
			<p className="menu__section-description">{description}</p>
			{items.map((item, index) => <MenuItem key={index} name={item.name} price={item.price} description={item.description} />)}
		</section>
	)
}

export default MenuSection;
