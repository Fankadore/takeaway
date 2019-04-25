import React, { Component } from 'react';
import axios from 'axios';
import './AddMenu.scss';

import TextInput from '../../components/TextInput/TextInput';
import PopUp from '../../components/PopUp/PopUp';

export class AddMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			description: "",
			popup: "",
		};
	}

	popUp = (value) => {
		this.setState({popup: value});
		setTimeout(() => this.setState({popup: ""}), 4000)
	};

	addMenu = () => {
		const { updateMenu } = this.props
		const { name, description } = this.state;

		if (!name) {
			this.popUp("Name is required.");
			return;
		}

		axios.post('http://localhost:2000/menu', {
			name,
			description,
		})
		.then(result => updateMenu())
		.catch(err => console.log(err));
	};

	changeName = (e) => this.setState({name: e.target.value});
	changeDescription = (e) => this.setState({description: e.target.value});

	render() {
		const { adminMode } = this.props
		const { name, description } = this.state;

		if (adminMode) {
			return (
				<main className="add-menu">
					<TextInput id="add-menu-name" update={this.changeName} value={name} placeholder="Name..." edit />
					<TextInput id="add-menu-description" update={this.changeDescription} value={description} placeholder="Description..." edit />
					<span onClick={this.addMenu} className="add-menu__icon fas fa-plus-circle" />
					<p className="add-menu__text">Tap to add Menu</p>
					<PopUp id="add-menu-pop-up" value={this.state.popup} />
				</main>
			);
		}

		return (
			<main className="add-menu--flex">
				<p className="add-menu__not-found">Menu is currently unavailable, please check back soon.</p>
			</main>
		);
	}
}

export default AddMenu;
