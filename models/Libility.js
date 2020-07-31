const mongoose = require('mongoose');

const LibilitiesSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('Libility', LibilitiesSchema);
