const mongoose = require('mongoose');
const User = require('./User');

const GoalSchema = new mongoose.Schema({
  goals: [
    {
      goal_name: {
        type: String,
        required: false,
      },
      amount: {
        type: Number,
        required: false,
      },
      time_horizon: {
        type: Number,
        required: false,
      },
      actual_amount: {
        type: Number,
        required: false,
      },
    },
  ],
  userID: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Goals', GoalSchema);
