const asyncHandler = require('../middleware/async');
const User = require('../models/User'); 

exports.register = asyncHandler(async(req, res, next) => {

    console.log(req.body);
    
res.status(200).json({success: true, msg: 'user is registerd'});

});