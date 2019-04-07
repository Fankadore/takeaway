import React, { Component } from 'react';
import MenuItem from './MenuItem';
import axios from 'axios';
import './AddDish.scss';
import './Menu.scss';

export class AddDish extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			price: 0,
			description: ""
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
		let { name, price, description } = this.state;

		if (name.length < 3) {
			console.log("Name must be at least 3 letters long.");
			return;
		}
		price = parseFloat(price);
		if (price >= 0) price = price.toFixed(2);
		else price = 0;

		axios.post('http://localhost:2000/dish', {
			name,
			price,
			description
		})
		.then(result => {
			this.setState({name: "", price: 0, description: ""});
			this.props.close();
			this.props.addDish();
		})
		.catch(err => console.log(err));
	}

	render() {
		const { isOpen, close } = this.props;
		const { name, price, description } = this.state;

		if (isOpen) {
			return (
				<main className="add-dish">
					<div className="add-dish-background">
						<span onClick={close} className="add-dish__close-button fas fa-times"></span>
						<h1 className="add-dish__title">Add Dish</h1>
						<form onSubmit={this.handleSubmit} className="add-dish__form">
							<input onChange={this.nameChange} className="add-dish__form-input" type="text" placeholder="Name" value={name}/>
							<input onChange={this.priceChange} className="add-dish__form-input" type="number" min="0" step="0.01" placeholder="Price" value={price || ""} />
							<textarea onChange={this.descriptionChange} className="add-dish__form-textarea" placeholder="Description" value={description} />
							<div className="add-dish__preview">
								<MenuItem name={this.state.name} price={this.state.price} description={this.state.description} />
							</div>
							<input className="add-dish__form-button" type="submit" />
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

export default AddDish;
