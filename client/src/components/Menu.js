import React from 'react';
import MenuSection from './MenuSection';
import './Menu.scss';

function Menu(props) {
	const { menu } = props;

	return (
		<div className="menu">
			<h2 className="menu__title">Menu</h2>
			{menu.map((section, index) => <MenuSection key={index} content={section} />)}			
		</div>
	)
}

export default Menu;
