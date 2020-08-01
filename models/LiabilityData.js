const mongoose = require('mongoose');

const LiabilityDataSchema = mongoose.Schema({
  liabilityID: {
    type: mongoose.Schema.ObjectID,
    ref: 'Libility',
  },
  userID: {
    type: mongoose.Schema.ObjectID,
    ref: 'User',
  },
  outstanding: {
    type: Number,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  interest: {
    type: Number,
    required: false,
  },
  emi: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('LiabilityData', LiabilityDataSchema);
