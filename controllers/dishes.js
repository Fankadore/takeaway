const mongoose = require('mongoose');
const Dish = require('../models/Dish.js');

const getAllDishes = (req, res, next) => {
	Dish.find()
	.exec()
	.then(dishes => res.status(200).json(dishes))
	.catch(err => res.status(500).json(err));
};

const addDish = (req, res, next) => {
	const { name, price, description } = req.body;
	const dish = new Dish({
		_id: new mongoose.Types.ObjectId,
    name,
    price,
    description
  });

  dish.save()
  .then(result => res.status(201).json(dish))
	.catch(err => res.status(500).json(err));
};

const getDish = (req, res, next) => {
	Dish.findById(req.params.id)
	.exec()
	.then(dish => res.status(200).json(dish))
	.catch(err => res.status(500).json(err));
};

const updateDish = (req, res, next) => {
  Dish.update({ _id: req.params.id }, { $set: req.body })
  .exec()
  .then(result => res.status(200))
	.catch(err => res.status(500).json(err));
};

const deleteDish = (req, res, next) => {
  Product.remove({ _id: req.params.id })
  .exec()
  .then(result => res.status(200))
	.catch(err => res.status(500).json(err));
};

module.exports = {
	getAllDishes,
	addDish,
	getDish,
	updateDish,
	deleteDish
};
