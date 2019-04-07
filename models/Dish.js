const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	name: {type: String, required: true},
	price: {type: Number, required: true},
	description: String
});

module.exports = mongoose.model('Dish', dishSchema);
