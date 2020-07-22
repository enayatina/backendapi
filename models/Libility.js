const mongoose = require('mongoose');

const LibilitiesSchema = new mongoose.Schema({
    house_plan: {
        type: String,
    },
    car_loan: {
        type: String,
    },
    education_loan: {
        type: String,
    },
    credit_card_loan: {
        type: String,
    },
    personal_loan: {
        type: String,
    },
    other_loans: {
        type: String,
    },
        
});

module.exports = mongoose.model('User', UserSchema);