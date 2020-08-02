const mongoose = require('mongoose');
const User = require('./User');
const Libility = require('./Libility');

const LiabilityDataSchema = mongoose.Schema({
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  libilities: [
    {
      libilityID: {
        type: mongoose.Schema.ObjectId,
        ref: 'Libility',
        required: true,
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
    },
  ],
});

module.exports = mongoose.model('LiabilityData', LiabilityDataSchema);
