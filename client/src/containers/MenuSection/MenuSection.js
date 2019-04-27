import React, { Component } from 'react';
import axios from 'axios';
import './MenuSection.scss';

import MenuItem from '../MenuItem/MenuItem';

import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import TextInput from '../../components/TextInput/TextInput';
import ActionButton from '../../components/ActionButton/ActionButton';
import OpenClose from '../../components/OpenClose/OpenClose';

export class MenuSection extends Component {
	constructor(props) {
		super(props);
		const { name = "", description = "" } = props.section;

		this.state = {
			editMode: false,
			newItem: false,
			name,
			description,
		};
	}

	editSection = () => {
		const { adminMode } = this.props;
		if (!adminMode) return;

		this.setState({editMode: true});
	};
	cancelEditSection = () => {
		const { adminMode, cancelAddSection, section } = this.props;
		const { name, description } = section;
		if (!adminMode) return;
		this.setState({editMode: false, name, description});
		if (!section._id) cancelAddSection();
	};
	saveEditSection = () => {
		const { adminMode, updateMenu, cancelAddSection, section, menuId } = this.props;
		const { name, description } = this.state;
		if (!adminMode) return;
		if (!name) {
			console.log("Name is required.");
			return;
		}

		this.setState({editMode: false, name, description});
		cancelAddSection();

		if (section._id) {
			// Update Section
			axios.put('http://localhost:2000/menu/section/' + section._id, {
				name,
				description,
			})
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
		else {
			// Add Section
			axios.post('http://localhost:2000/menu/section', {
				menuId,
				name,
				description,
			})
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};
	removeSection = () => {
		let confirmed = window.confirm("Are you sure you want to remove this section?\nThis will also remove all items in the section.");
		if (!confirmed) return;
		
		const { updateMenu, section } = this.props;
		this.cancelEditSection();

		if (section._id) {
			axios.delete('http://localhost:2000/menu/section/' + section._id)
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};

	// Callbacks
	addItem = () => {
		if (!this.props.adminMode) return;
		this.setState({newItem: true});
	};
	cancelAddItem = () => {
		if (!this.props.adminMode) return;
		this.setState({newItem: false});
	};
	moveItem = (startIndex, endIndex) => {
		const { items } = this.props.section;
		
		if (startIndex === endIndex) return;
		
		if (startIndex < endIndex) {
			if (startIndex < 0 || endIndex <= 0) return;
			while (startIndex < endIndex) {
				const temp = items[startIndex + 1];
				items[startIndex + 1] = items[startIndex];
				items[startIndex] = temp;
				startIndex++;
			}
		}
		else if (startIndex > endIndex) {
			if (startIndex <= 0 || endIndex < 0) return;
			while (startIndex > endIndex) {
				const temp = items[startIndex - 1];
				items[startIndex - 1] = items[startIndex];
				items[startIndex] = temp;
				startIndex--;
			}
		}

		console.log(items);
		// Update menu section
	};

	onDragStart = (e) => {
		const parent = e.target.parentNode;
		e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("id", parent.id);
    e.dataTransfer.setData("html", parent);
		e.dataTransfer.setDragImage(parent, 0, 0);
	};
	onDragOver = (e) => {
		e.preventDefault();
	};
	onDrop = (e) => {
		const { moveSection } = this.props;
		e.preventDefault();
		const sectionId = e.dataTransfer.getData("id");
		const startIndex = parseInt(sectionId.slice(8));
		const endIndex = parseInt(e.target.parentNode.id.slice(8));
		moveSection(startIndex, endIndex);
	};

	// Handle Inputs
	changeName = (e) => this.setState({name: e.target.value});
	changeDescription = (e) => this.setState({description: e.target.value});

	// Render
	renderHeader = () => {
		const { id, draggable, adminMode, forceEdit } = this.props;
		const { editMode, name, description } = this.state;

		return (
			<header id={id + "-header"} className="menu__section-header">
				<ActionButton id="section-edit" action="edit" callback={this.editSection} hide={(!adminMode || editMode || forceEdit)} />
				<TextInput id="section-name" update={this.changeName} value={name} placeholder="Name..."  edit={adminMode && (editMode || forceEdit)} />
				<TextInput id="section-description" update={this.changeDescription} value={description} placeholder="Description..."  edit={adminMode && (editMode || forceEdit)} />
				<ActionButton id="section-move" action="move" callback={this.onDragStart} hide={!draggable} />
				<ConfirmBar id="section-confirm" cancel={this.cancelEditSection} confirm={this.saveEditSection} hide={(!adminMode || (!editMode && !forceEdit))} />
			</header>
		);
	};
	renderFooter = () => {
		const { adminMode, forceEdit} = this.props;
		const { editMode, newItem } = this.state;

		if (!adminMode) return null;

		return (
			<footer className="menu__section-footer">
				<ActionButton id="section-remove" action="remove" callback={this.removeSection} hide={(!editMode && !forceEdit)} />
				<OpenClose id="section-add" close={this.cancelAddItem} open={this.addItem} isOpen={newItem} hide={(editMode || forceEdit)} />
			</footer>
		);
	};
	render() {
		const { id, updateMenu, addToOrder, section, adminMode, forceEdit } = this.props;
		const { editMode, newItem } = this.state;

		return (
			<section id={id} className="menu__section" onDragOver={this.onDragOver} onDrop={this.onDrop}>
				{this.renderHeader()}
				{(section.items) ? section.items.map((item, index) => <MenuItem key={index} updateMenu={updateMenu} addToOrder={addToOrder} cancelAddItem={this.cancelAddItem} item={item} sectionId={section._id} adminMode={adminMode} sectionEdit={editMode || forceEdit} forceEdit={false} />) : null}
				{(adminMode && newItem) ? <MenuItem cancelAddItem={this.cancelAddItem} updateMenu={updateMenu} item={{}} sectionId={section._id} adminMode={adminMode} sectionEdit={editMode || forceEdit} forceEdit /> : null}
				{this.renderFooter()}
			</section>
		);
	}
}

export default MenuSection;
