const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
	_id: mongoose.SchemaTypes.ObjectId,
	dateTimeCreated: {type: Date, required: true},
	account: {type: mongoose.SchemaTypes.ObjectId, ref: 'Account', required: true},
	dishes: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Dish'}]
});

module.exports = mongoose.model('Order', orderSchema);
