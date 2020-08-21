const mongoose = require('mongoose');

const CountryWiseAssumption = mongoose.Schema({
  countryName: {
    type: String,
    required: true,
  },
  inflation: {
    type: String,
    required: true,
  },
  current_e_rate: {
    type: String,
    required: true,
  },
  current_fluctuation: {
    type: String,
    required: true,
  },
  degree_cost_country: [
      {
      degree_name:{
        type:String,
        required:true
      },
      degree_cost:{
        type:Number,
        required:true
      }
    }
],
 
});

module.exports = mongoose.model('CountryWiseAssumption', CountryWiseAssumption);
