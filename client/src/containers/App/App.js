import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';
import './App.scss';

import Home from '../Home/Home';
import Menu from '../Menu/Menu';
import AddMenu from '../AddMenu/AddMenu';
import FindUs from '../FindUs/FindUs';

import Header from '../../components/Header/Header';
import Nav from '../../components/Nav/Nav';
import Footer from '../../components/Footer/Footer';
import Spinner from '../../components/Spinner/Spinner';

import content from '../../data/content';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: {
				admin: true,
			},
			order: {},
			menus: null,
			selectedMenu: 0,
			selectedLocation: 0,
		};
	}
	
	updateMenus = () => {
		axios.get('http://localhost:2000/menu')
		.then(res => this.setState({menus: res.data}))
		.catch(err => console.log(err));
	};

	componentDidMount() {
		this.updateMenus();
	}

	// Render
	renderHome = () => {
		return <Home />
	};

	renderMenu = () => {
		const { menus, selectedMenu, account } = this.state;
		
		if (!menus) {
			return (
				<main id="menu" className="menu--flex">
					<Spinner id="load-menu" />
				</main>
			);
		}
		
		if (menus.length === 0) return <AddMenu updateMenu={this.updateMenus} adminMode={account.admin} />
		else return <Menu updateMenu={this.updateMenus} menu={menus[selectedMenu]} adminMode={account.admin} />
	};

	renderFindUs = () => {
		const { selectedLocation } = this.state;
		const { locations } = content;

		return <FindUs location={locations[selectedLocation]} />
	};

  render() {
    return (
      <div className="App">
				<Header title={content.name} />
				<Router>
					<Nav links={content.nav} />
					<Route exact path="/" render={this.renderHome} />
					<Route exact path="/order" render={this.renderMenu} />
					<Route exact path="/find-us" render={this.renderFindUs} />
				</Router>
				<Footer copyright={content.copyright} />
      </div>
    );
  }
}

export default App;
