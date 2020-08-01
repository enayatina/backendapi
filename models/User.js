const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: false,
    trim: true,
    maxlength: [50, 'Name can not be more then 50 char'],
  },
  last_name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: false,
    trim: true,
    maxlength: [50, 'Name can not be more then 50 char'],
  },
  email: {
    type: String,
    match: [
      '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/',
      'Please enter correct mmail',
    ],
    required: [true, 'Please add an email'],
    unique: true,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    required: false,
    unique: false,
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['guest', 'registerd'],
    default: 'guest',
  },
});

module.exports = mongoose.model('User', UserSchema);
