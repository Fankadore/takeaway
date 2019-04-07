import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import content from './data/content';
import axios from 'axios';
import './App.scss';

import Header from './components/Header';
import Nav from './components/Nav';
import Home from './components/Home';
import Order from './components/Order';
import ViewMap from './components/ViewMap';
import Footer from './components/Footer';
import PopUp from './components/PopUp';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			account: {},
			dishes: [],
			order: []
		};
	}
	
	componentDidMount() {
		axios.get('http://localhost:2000/dish')
		.then(res => {
			const dishes = res.data;
			this.setState({dishes});
		});
	}

  render() {
    return (
      <div className="App">
				<Header title={content.name} />
				<Router>
					<Nav />
					<Route exact path="/" render={() => <Home />} />
					<Route exact path="/order" render={() => <Order menu={content.menu} dishes={this.state.dishes} />} />
					<Route exact path="/map" render={() => <ViewMap address={content.contact.address} />} />
				</Router>
				<Footer copyright={content.copyright} />
				<PopUp />
      </div>
    );
  }
}

export default App;
