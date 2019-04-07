const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  email: {type: String, required: true, unique: true, match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/},
  password: {type: String, required: true},
  verified: {type: Boolean, default: false},
	firstName: String,
  lastName: String,
  phone: {type: String, unique: true}
});

module.exports = mongoose.model('Account', accountSchema);
