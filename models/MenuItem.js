const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
	_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
	name: {type: String, required: true},
	price: {type: Number, required: true},
	description: String,
});

module.exports = mongoose.model('MenuItem', menuItemSchema, 'items');
