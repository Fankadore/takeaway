import React from 'react';
import './Header.scss';

function Header(props) {
	return (
		<header className="header">
			<h1 className="header__title">{props.title}</h1>
		</header>
	)
}

export default Header;
