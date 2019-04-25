import React, { Component } from 'react';
import axios from 'axios';
import './MenuItem.scss';

import ActionButton from '../../components/ActionButton/ActionButton';
import ConfirmBar from '../../components/ConfirmBar/ConfirmBar';
import PriceInput from '../../components/PriceInput/PriceInput';
import TextInput from '../../components/TextInput/TextInput';

export class MenuItem extends Component {
	constructor(props) {
		super(props);
		const { name = "", price = 0, description = "" } = props.item;

		this.state = {
			editMode: false,
			name,
			price,
			description,
		};
	}

	editItem = () => {
		const { name, price, description } = this.props.item;
		this.setState({editMode: true, name, price, description});
	};
	cancelEditItem = () => {
		const { cancelAddItem, item } = this.props;
		const { name, price, description} = item;
		this.setState({editMode: false, name, price, description});
		if (!item._id) cancelAddItem();
	};
	saveEditItem = () => {
		const { updateMenu, cancelAddItem, item, sectionId } = this.props;
		let { name, price, description } = this.state;

		if (!name) {
			console.log("Name is required.");
			return;
		}
		
		if (price >= 0) parseFloat(price);
		else price = 0;
		
		this.setState({editMode: false, name, price, description});
		cancelAddItem();

		if (item._id) {
			// Update Item
			axios.put('http://localhost:2000/menu/item/' + item._id, {
				name,
				price,
				description,
			})
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
		else {
			// Add Item
			axios.post('http://localhost:2000/menu/item', {
				sectionId,
				name,
				price,
				description,
			})
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};
	removeItem = () => {
		let confirmed = window.confirm("Are you sure you want to remove this item?");
		if (!confirmed) return;

		const { updateMenu, item } = this.props;
		this.cancelEditItem();

		if (item._id) {
			axios.delete('http://localhost:2000/menu/item/' + item._id)
			.then(result => updateMenu())
			.catch(err => console.log(err));
		}
	};

	// Handle Inputs
	changeName = (e) => this.setState({name: e.target.value});
	changePrice = (e) => {
		let price = parseFloat(e.target.value);
		if (isNaN(price) || price < 0) price = 0;
		this.setState({price});

		let value = "" + Math.floor(e.target.value); // remove decimals and parse as string
		value = value.length + 2; // count digits and add back decimals
		const width = ((value * 8) + 2) + 'px'; // convert to pixels
		e.target.style.width = width;
	}
	changeDescription = (e) => this.setState({description: e.target.value});

	// Render
	renderActionButton = () => {
		const { addToOrder, adminMode, sectionEdit, forceEdit } = this.props;
		const { editMode } = this.state;

		if (editMode || forceEdit) return <ActionButton action="remove" callback={this.removeItem} />
		if (sectionEdit) return <ActionButton action="move" callback={() => {}} />
		if (adminMode) return <ActionButton action="edit" callback={this.editItem} />
		return <ActionButton action="add" callback={addToOrder} />
	};
	render() {
		const { forceEdit } = this.props;
		const { name, price, description, editMode } = this.state;

		return (
			<section className="menu__item">
				<TextInput id="item-name" update={this.changeName} value={name} placeholder="Name..."  edit={editMode || forceEdit} />
				<PriceInput id="item-price" update={this.changePrice} value={price} currency="£" edit={editMode || forceEdit} />
				<TextInput id="item-description" update={this.changeDescription} value={description} placeholder="Description..." edit={editMode || forceEdit} />
				{this.renderActionButton()}
				<ConfirmBar id="item-confirm" confirm={this.saveEditItem} cancel={this.cancelEditItem} hide={(!editMode && !forceEdit)} />
			</section>
		);
	}
}

export default MenuItem;
