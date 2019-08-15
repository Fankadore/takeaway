const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	sections: [{type: mongoose.SchemaTypes.ObjectId, ref: 'MenuSection'}],
});

module.exports = mongoose.model('Menu', menuSchema, 'menus');
