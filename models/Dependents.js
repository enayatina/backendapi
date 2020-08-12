const mongoose = require('mongoose');
const User = require('./User');

const DependentSchema = mongoose.Schema({
  spouse: {
    type: Number,
    required: false,
  },
  kids: {
    type: Number,
    required: false,
  },
  parents: {
    type: Number,
    required: false,
  },
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Dependent', DependentSchema);
