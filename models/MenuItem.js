const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
	_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
	name: {type: String, required: true},
	description: String,
	price: Number,
});

module.exports = mongoose.model('MenuItem', menuItemSchema, 'items');
