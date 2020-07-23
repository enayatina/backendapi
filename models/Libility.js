const mongoose = require('mongoose');

const LibilitiesSchema = new mongoose.Schema({
    name: String
        
});

module.exports = mongoose.model('User', UserSchema);