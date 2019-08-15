const mongoose = require('mongoose');

const menuSectionSchema = new mongoose.Schema({
	name: {type: String, required: true},
	description: String,
	items: [{type: mongoose.SchemaTypes.ObjectId, ref: 'MenuItem'}]
});

module.exports = mongoose.model('MenuSection', menuSectionSchema, 'sections');
