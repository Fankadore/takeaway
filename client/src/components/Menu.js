import React, { Component } from 'react';
import MenuSection from './MenuSection';
import AddDish from './AddDish';
import './Menu.scss';

export class Menu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			addDishIsOpen: false
		}
	}

	openAddDish = () => {
		this.setState({addDishIsOpen: true});
		document.body.classList.add('no-scroll');
	};
	closeAddDish = () => {
		this.setState({addDishIsOpen: false});
		document.body.classList.remove('no-scroll');
	};
	addDish = () => {
		console.log("Dish added.");
	};

	openEditDish = () => {
		this.setState({addDishIsOpen: true});
		document.body.classList.add('no-scroll');
	};
	closeEditDish = () => {
		this.setState({addDishIsOpen: false});
		document.body.classList.remove('no-scroll');
	};
	editDish = () => {
		console.log("Dish updated.");
	};

	deleteDish = () => {
		console.log("Dish deleted.");
	};


	render() {
		const { menu } = this.props;

		return (
			<div className="menu">
				<div className="menu__title">
					<span className="menu__title-spacer fas fa-plus"></span>
					<h2 className="menu__title-text">Menu</h2>
					<span className="menu__title-add fas fa-plus"></span>
				</div>
				{menu.map((section, index) => <MenuSection key={index} title={section.title} description={section.description} items={section.items} openAddDish={this.openAddDish} />)}
				<AddDish isOpen={this.state.addDishIsOpen} close={this.closeAddDish} addDish={this.addDish} />
			</div>
		)
	}
}

export default Menu;
