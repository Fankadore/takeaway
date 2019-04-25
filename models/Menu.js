const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
	_id: {type: mongoose.SchemaTypes.ObjectId, required: true},
	name: {type: String, required: true},
	description: String,
	sections: [{type: mongoose.SchemaTypes.ObjectId, ref: 'MenuSection'}],
});

module.exports = mongoose.model('Menu', menuSchema, 'menus');
