import React, { Component } from 'react'
import MenuItem from './MenuItem';
import axios from 'axios';
import './EditDish.scss';
import './Menu.scss';

export class EditDish extends Component {
	constructor(props) {
		super(props);
		let { id, name, price, description } = props;

		this.state = {
			id,
			name,
			price,
			description
		};
	}

	nameChange = (e) => {
		this.setState({name: e.target.value});
	}
	priceChange = (e) => {
		this.setState({price: e.target.value});
	}
	descriptionChange = (e) => {
		this.setState({description: e.target.value});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		const { editDish, close } = this.props;
		let { id, name, price, description } = this.state;
		
		if (name.length < 3) {
			console.log("Name must be at least 3 letters long.");
			return;
		}
		price = parseFloat(price);
		if (price >= 0) price = price.toFixed(2);
		else price = 0;

		axios.put('http://localhost:2000/dish?' + id, {
			name,
			price,
			description
		})
		.then(result => {
			close();
			editDish();
		})
		.catch(err => console.log(err));
	}

	render() {
		const { isOpen, close } = this.props;
		const { name, price, description } = this.state;

		if (isOpen) {
			return (
				<main className="edit-dish">
					<div className="edit-dish-background">
						<span onClick={close} className="edit-dish__close-button fas fa-times"></span>
						<h1 className="edit-dish__title">Add Dish</h1>
						<form onSubmit={this.handleSubmit} className="edit-dish__form">
							<input onChange={this.nameChange} className="edit-dish__form-input" type="text" placeholder="Name" value={name}/>
							<input onChange={this.priceChange} className="edit-dish__form-input" type="number" min="0" step="0.01" placeholder="Price" value={price || ""} />
							<textarea onChange={this.descriptionChange} className="edit-dish__form-textarea" placeholder="Description" value={description} />
							<div className="edit-dish__preview">
								<MenuItem name={name} price={price} description={description} />
							</div>
							<input className="edit-dish__form-button" type="submit" />
						</form>
					</div>
				</main>
			)
		}
		else {
			return null;
		}
	}
}

export default EditDish
