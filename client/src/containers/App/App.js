import React, { useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.scss';

import Home from '../Home/Home';
import Menu from '../Menu/Menu';
import FindUs from '../FindUs/FindUs';

import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';

import content from '../../data/content';

function App(props) {
	const [admin, setAdmin] = useState(true);
	const [selectedLocation, setSelectedLocation] = useState(0);

	const addToOrder = (itemId) => {

	};

	// Render
	const renderHome = () => {
		return <Home />
	};
	const renderMenu = () => {
		return <Menu id="menu" addToOrder={addToOrder} admin={admin} />
	};
	const renderFindUs = () => {
		const { locations } = content;

		return <FindUs location={locations[selectedLocation]} />
	};

	return (
		<div className="App">
			<Header title={content.name} />
			<Router>
				<Nav links={content.nav} />
				<Route exact path="/" render={renderHome} />
				<Route exact path="/order" render={renderMenu} />
				<Route exact path="/find-us" render={renderFindUs} />
			</Router>
			<Footer copyright={content.copyright} />
		</div>
	);
}

export default App;
