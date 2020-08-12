const mongoose = require('mongoose');
const User = require('./User');

const InsuranceSchema = mongoose.Schema({
  life_coverage: {
    type: Number,
    required: false,
  },
  health_insurance: {
    type: Number,
    required: false,
  },
  ci_coverage: {
    type: Number,
    required: false,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
