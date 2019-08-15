import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

function Nav(props) {
	const { links } = props;

	return (
		<nav className="nav">
			{links.map((link, index) => <NavLink key={index} className="nav__link" activeClassName="nav__link--active" exact to={link.href}>{link.name}</NavLink>)}
		</nav>
	)
}

export default Nav;
