const mongoose = require('mongoose');
const User = require('./User');

const AssetSchema = new mongoose.Schema({
  savings: {
    type: String,
    required: true,
  },
  fixedDeposit: {
    type: String,
    required: true,
  },
  investments: {
    type: String,
    required: true,
  },
  residentialProperty: {
    type: String,
    required: true,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Assets', AssetSchema);
