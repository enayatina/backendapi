const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Assets = require('../models/Assets');

//@desc    Register a user
//@method  POST /api/v1/auth/register
//@auth    Public
exports.register = asyncHandler(async (req, res, next) => {
  //Registeration process will be completed in 3 steps
  //step1: get the basic details of user { gender, age, email } and store it into the db
  //Inser user details
  //Send Email with the OTP
  //Confirm OTP
  const {
    gender,
    age,
    email,
    savings,
    investments,
    fixedDeposit,
    residentialProperty,
  } = req.body;

  const user = await User.create({
    gender,
    email,
    age,
  });

  //step2: get the _id of user which is added and pass it to Assets collection along with { savings, investments, FD, residential property}
  const userID = user._id;
  const assets = await Assets.create({
    savings,
    investments,
    fixedDeposit,
    residentialProperty,
    userID: userID,
  });
  //step3: get the _id of user and pass it to Liability collection

  res.status(200).json({ success: true, msg: 'user is registerd', data: user });
});
