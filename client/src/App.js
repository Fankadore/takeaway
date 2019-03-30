import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import content from './data/content';
import './App.scss';

import Header from './components/Header';
import Nav from './components/Nav';
import Home from './components/Home';
import Order from './components/Order';
import ViewMap from './components/ViewMap';
import Footer from './components/Footer';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			order: []
		};
	}

  render() {
    return (
      <div className="App">
			<Router>
				<Header title={content.name} />
				<Nav />
				<Route exact path="/" render={() => <Home />} />
				<Route exact path="/order" render={() => <Order menu={content.menu} />} />
				<Route exact path="/map" render={() => <ViewMap address={content.contact.address} />} />
				<Footer copyright={content.copyright} />
			</Router>
      </div>
    );
  }
}

export default App;
