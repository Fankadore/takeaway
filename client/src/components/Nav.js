import React from 'react';
import { NavLink } from 'react-router-dom';
import './Nav.scss';

function Nav() {
	return (
		<nav className="nav">
			<NavLink className="nav__link" activeClassName="nav__link--active" exact to="/">Home</NavLink>
			<NavLink className="nav__link" activeClassName="nav__link--active" exact to="/order">Order</NavLink>
			<NavLink className="nav__link" activeClassName="nav__link--active" exact to="/map">Map</NavLink>
		</nav>
	)
}

export default Nav;
