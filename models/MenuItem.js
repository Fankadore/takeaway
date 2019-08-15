const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	price: Number,
});

module.exports = mongoose.model('MenuItem', menuItemSchema, 'items');
