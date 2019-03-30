import React from 'react';
import MenuItem from './MenuItem';

function MenuSection(props) {
	const { title, items } = props.content;

	return (
		<section className="menu__section">
			<h3 className="menu__section-title">{title}</h3>
			{items.map((item, index) => <MenuItem key={index} content={item} />)}
		</section>
	)
}

export default MenuSection;
