const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Assets = require('../models/Assets');
const Token = require('../models/Token');
const LiabilityData = require('../models/LiabilityData');
var crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const Insurance = require('../models/Insurance');
const Dependents = require('../models/Dependents');
const Goals = require('../models/Goals');
const Assumptions = require('../models/Assumptions');

//@desc    Register a user
//@method  POST /api/v1/auth/register
//@auth    Public
exports.register = asyncHandler(async (req, res, next) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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
    annual_income_after_tax,
    monthly_expenses,
    monthly_savings,
    life_coverage,
    health_insurance,
    ci_coverage,
    spouse,
    kids,
    parents,
  } = req.body;

  const user = await User.create({
    gender,
    email,
    age,
    annual_income_after_tax,
    monthly_expenses,
    monthly_savings,
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

  //add insurance info
  const insurance = await Insurance.create({
    life_coverage,
    health_insurance,
    ci_coverage,
    userID: userID,
  });

  //add dependent data
  const dependent = await Dependents.create({
    spouse,
    kids,
    parents,
    userID: userID,
  });

  // const assumption = await Assumptions.find();
  // const number = amount * 1 + assumption.inflation_rate;
  // console.log(number);
  // const exponent = time_horizon;
  // console.log(exponent);
  // console.log(Math.pow(number, exponent));
  // const totalGoalAmount = Math.pow(number, exponent);
  // console.log(totalGoalAmount);

  if (typeof req.body.goals !== 'undefined' && req.body.goals.length > 0) {
    // the array is defined and has at least one element

    const goal_data = req.body.goals;
    console.log(goal_data);
    //console.log(goal_data[0].goalID);
    const goals = Goals.insertMany({
      goals: goal_data,
      userID: userID,
    });

    //Generate an OTP [6 digits ] and send it to mobile number
    //console.log(Math.floor(100000 + Math.random() * 900000));
    //const verificationCode = Math.floor(100000 + Math.random() * 900000);
  } else {
    console.log('do nothing', req.body.goals);
  }

  //step3: get the _id of user and pass it to Liability collection

  if (
    typeof req.body.liabilities !== 'undefined' &&
    req.body.liabilities.length > 0
  ) {
    // the array is defined and has at least one element

    const libility_data = req.body.liabilities;
    //console.log(libility_data[0].libilityID);
    const libility = LiabilityData.insertMany({
      libilities: libility_data,
      userID: userID,
    });

    //Generate an OTP [6 digits ] and send it to mobile number
    //console.log(Math.floor(100000 + Math.random() * 900000));
    //const verificationCode = Math.floor(100000 + Math.random() * 900000);
  } else {
    console.log('do nothing', req.body.liabilities);
  }

  // Create a verification token for this user
  var token = new Token({
    userID: userID,
    token: crypto.randomBytes(16).toString('hex'),
  });

  // Save the verification token
  token.save(function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
  });

  //send email to user
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs

  const msg = {
    to: email,
    from: 'vaibhav.nadgonde1980@gmail.com',
    subject: 'Account Verification Link Inside',
    text:
      'Hello,\n\n' +
      'Please verify your account by clicking the link: \nhttp://' +
      req.headers.host +
      'api/v1/auth/confirmation/' +
      token.token +
      '.\n',
  };
  sgMail.send(msg);

  res.status(200).json({ success: true, msg: 'user is registerd', data: user });
});

//@desc    User confirmation
//@method  GET /api/v1/auth/confirmation/:token
//@auth    Public
exports.confirmation = asyncHandler(async (req, res, next) => {
  const token = await Token.findOne({ token: req.params.token });

  if (!token) {
    return next(
      new ErrorResponse(
        `We were unable to find a valid token. Your token my have expired`,
        404
      )
    );
  }
  //if the token is available
  //check for the user if verified already
  const isverified = await User.findOne({ _id: token.userID });

  //Check if the user exist for this token
  if (!isverified) {
    return next(
      new ErrorResponse(`We were unable to find any user for this token.`, 404)
    );
  }

  //Check if the user already verified
  if (isverified.isVerified) {
    return next(new ErrorResponse(`This user is already verified.`, 404));
  }

  isverified.isVerified = true;
  isverified.save(function (err) {
    if (err) {
      return res
        .status(400)
        .json({ success: false, msg: 'something went wrong' });
    }

    //User is confirmed and verified
    res.status(200).json({ success: true, msg: 'Thank you for verification' });
  });
});
exports.login = asyncHandler(async (req, res, next) => {
  console.log(req.body);
});
