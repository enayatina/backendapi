const mongoose = require('mongoose');

const AssumptionSchema = mongoose.Schema({
  equity: {
    type: Number,
    required: false,
  },
  bond: {
    type: Number,
    required: false,
  },
  aggresive: {
    type: Number,
    required: false,
  },
  balanced: {
    type: Number,
    required: false,
  },
  cautious: {
    type: Number,
    required: false,
  },
  inflation_rate: {
    type: Number,
    required: false,
  },
  salary_growth_rate: {
    type: Number,
    required: false,
  },
  saving_growth_rate: {
    type: Number,
    required: false,
  },
  emergency_fund: {
    type: Number,
    required: false,
  },
  life_male: {
    type: Number,
    required: false,
  },
  life_female: {
    type: Number,
    required: false,
  },
  property_appreciation: {
    type: Number,
    required: false,
  },
  bad_debt_i_rate: {
    type: Number,
    required: false,
  },
  retirement_age: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model('Assumption', AssumptionSchema);
