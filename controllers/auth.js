const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Assets = require('../models/Assets');
const LiabilityData = require('../models/LiabilityData');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

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

    //send email to user
    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs

    const msg = {
      to: 'vaibhav.nadgonde1980@gmail.com',
      from: 'itgenesys@gmail.com',
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    sgMail.send(msg);
  } else {
    console.log('do nothing', req.body.liabilities);
  }

  res.status(200).json({ success: true, msg: 'user is registerd', data: user });
});
