import React, { Component } from 'react';
import axios from 'axios';
import './Menu.scss';

import MenuSection from '../MenuSection/MenuSection';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';
import TextInput from '../../components/TextInput/TextInput';

export class Menu extends Component {
	constructor(props) {
		super(props);
		const { name = "", description = "" } = props.menu;
		
		this.state = {
			editMode: false,
			newSection: false,
			name,
			description,
		};
	}

	editMenu = () => {
		const { adminMode } = this.props;
		if (!adminMode) return;

		this.setState({editMode: true});
	};
	cancelEditMenu = () => {
		const { adminMode, menu } = this.props;
		const { name, description } = menu;
		if (!adminMode) return;
		
		this.setState({editMode: false, name, description});
		if (!menu._id) this.cancelAddMenu();
	};
	saveEditMenu = () => {
		const { adminMode, updateMenu, menu } = this.props;
		const { name, description } = this.state;
		if (!adminMode) return;
		
		if (!name) {
			console.log("Name is required.");
			return;
		}
		
		this.setState({editMode: false});

		if (menu._id) {
			axios.put('http://localhost:2000/menu/' + menu._id, {
				name,
				description,
			})
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};
	removeMenu = () => {
		let confirmed = window.confirm("Are you sure you want to remove this menu?\nThis will also remove all sections and items in the menu.");
		if (!confirmed) return;
		
		const { updateMenu, menu } = this.props;
		this.cancelEditMenu();

		if (menu._id) {
			axios.delete('http://localhost:2000/menu/' + menu._id)
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};

	// Callbacks
	addSection = () => {
		if (this.props.adminMode) this.setState({newSection: true});
	};
	cancelAddSection = () => {
		if (!this.props.adminMode) return;
		this.setState({newSection: false});
	};
	moveSection = (startIndex, endIndex) => {
		const { updateMenu, menu } = this.props
		const { sections } = menu;
		
		if (startIndex === endIndex) return;
		
		if (startIndex < endIndex) {
			if (startIndex < 0 || endIndex <= 0) return;
			while (startIndex < endIndex) {
				const temp = sections[startIndex + 1];
				sections[startIndex + 1] = sections[startIndex];
				sections[startIndex] = temp;
				startIndex++;
			}
		}
		else if (startIndex > endIndex) {
			if (startIndex <= 0 || endIndex < 0) return;
			while (startIndex > endIndex) {
				const temp = sections[startIndex - 1];
				sections[startIndex - 1] = sections[startIndex];
				sections[startIndex] = temp;
				startIndex--;
			}
		}

		axios.put('http://localhost:2000/menu/' + menu._id, {sections})
		.then(result => updateMenu())
		.catch(err => console.log(err));
	};

	// Handle Inputs
	changeName = (e) => this.setState({name: e.target.value});
	changeDescription = (e) => this.setState({description: e.target.value});
	
	// Render
	renderHeader = () => {
		const { adminMode } = this.props;
		const { name, description, editMode } = this.state;

		return (
			<header className="menu__header">
				<ActionButton id="menu-edit" action="edit" callback={this.editMenu} hide={(!adminMode || editMode)} />
				<TextInput id="menu-name" update={this.changeName} value={name} placeholder="Name..." edit={adminMode && editMode} />
				<TextInput id="menu-description" update={this.changeDescription} value={description} placeholder="Description..." edit={adminMode && editMode} />
				<ConfirmBar id="menu-confirm" cancel={this.cancelEditMenu} confirm={this.saveEditMenu} hide={(!adminMode || !editMode)} />
			</header>
		);
	};
	renderFooter = () => {
		const { adminMode } = this.props;
		const { editMode, newSection } = this.state;

		if (!adminMode) return null;

		return (
			<footer className="menu__footer">
				<ActionButton id="menu-remove" action="remove" callback={this.removeMenu} hide={!editMode} />
				<OpenClose id="menu-add" close={this.cancelAddSection} open={this.addSection} isOpen={newSection} hide={editMode} />
			</footer>
		);
	};

	render() {
		const { updateMenu, menu, adminMode } = this.props;
		const { editMode, newSection } = this.state;

		return (
			<main className="menu">
				{this.renderHeader()}
				{(menu.sections) ? menu.sections.map((section, index) => <MenuSection id={"section-" + index} key={index} draggable={adminMode && editMode} updateMenu={updateMenu} cancelAddSection={this.cancelAddSection} moveSection={this.moveSection} section={section} menuId={menu._id} adminMode={adminMode} />) : null}
				{(adminMode && newSection) ? <MenuSection updateMenu={updateMenu} cancelAddSection={this.cancelAddSection} section={{}} menuId={menu._id} adminMode={adminMode} forceEdit /> : null}
				{this.renderFooter()}
			</main>
		);
	}
}

export default Menu;
