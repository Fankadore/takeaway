import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import './App.scss';

import Header from './Header/Header';
import Nav from './Nav/Nav';
import Footer from './Footer/Footer';

import Home from '../pages/Home/Home';
import Menu from '../pages/Menu/Menu';
import AddMenu from '../pages/Menu/AddMenu';
import FindUs from '../pages/FindUs/FindUs';
import Loading from '../pages/Loading/Loading';

import Popup from '../components/Popup/Popup';

import content from '../data/content';

const App = () => {
	const { name, nav, copyright, locations } = content;
	const [popup, setPopup] = useState("");
	const admin = true;

	const [selectedMenu, setSelectedMenu] = useState(0);
	const previousMenu = () => {
		if (selectedMenu <= 0) setSelectedMenu(menus.length - 1);
		else setSelectedMenu(selectedMenu - 1);
	};
	const nextMenu = () => {
		if (selectedMenu >= menus.length - 1) setSelectedMenu(0);
		else setSelectedMenu(selectedMenu + 1);
	};
	useEffect(() => {
		if (!menus || menus.length === 0) return;

		setMenu(menus[selectedMenu]);
	}, [selectedMenu]);

	const [selectedLocation, setSelectedLocation] = useState(0);
	const previousLocation = () => {
		if (selectedLocation <= 0) setSelectedLocation(locations.length - 1);
		else setSelectedLocation(selectedLocation - 1);
	};
	const nextLocation = () => {
		if (selectedLocation >= locations.length - 1) setSelectedLocation(0);
		else setSelectedLocation(selectedLocation + 1);
	};

	const [isLoading, setIsLoading] = useState(true);
	const [menus, setMenus] = useState(null);
	const [menu, setMenu] = useState(null);
	useEffect(() => {
		setIsLoading(true);

		axios.get('http://localhost:2000/menu')
		.then(response => {
			setMenus(response.data);
			setMenu(response.data[selectedMenu]);
			setIsLoading(false);
		})
		.catch(err => console.log(err));
	}, []);

	// useEffect(() => {
	// 	if (firstUpdate.current) return;
	// 	axios.put('http://localhost:2000/menu/' + menu._id, menu)
	// 	.then(response => console.log(response))
	// 	.catch(err => console.log(err));
	// }, [menu]);

	const renderHome = () => {
		return <Home />
	};
	const renderMenu = () => {
		if (isLoading) {
			return <Loading />
		}
		else if (!menu) {
			return <AddMenu
				admin={admin}
				setMenu={setMenu}
				setPopup={setPopup}	
			/>
		}
		else {
			return (
				<Menu
					admin={admin}
					menu={menu}
					previousMenu={previousMenu}
					nextMenu={nextMenu}
					setMenu={setMenu}
					setPopup={setPopup}
				/>
			);
		}
	};
	const renderFindUs = () => {
		return (
			<FindUs
				id="find-us"
				location={locations[selectedLocation]}
				previousLocation={previousLocation}
				nextLocation={nextLocation}
			/>
		);
	};

	return (
		<div className="App">
			<Header title={name} />
			<Router>
				<Nav links={nav} />
				<Route exact path="/" render={renderHome} />
				<Route exact path="/order" render={renderMenu} />
				<Route exact path="/find-us" render={renderFindUs} />
			</Router>
			<Popup id="popup" message={popup} />
			<Footer copyright={copyright} />
		</div>
	);
}

export default App;
