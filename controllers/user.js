const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const Assets = require('../models/Assets');
const Token = require('../models/Token');
const LiabilityData = require('../models/LiabilityData');

//@desc    Calculate Planning Data based on user's input
//@method  POST /api/v1/user/getPlanning/:id
//@auth    Public
exports.getPlanning = asyncHandler(async (req, res, next) => {
  const userData = [];
  const user = await User.findOne({ email: req.params.email });

  if (!user) {
    return next(
      new ErrorResponse(`User not found with email ${req.params.email}`, 401)
    );
  }

  //calculations begins
  //step1 - get all the data from db for the user
  //Number form begins
  //save and invest
  //for lump sum - current savings + FD - (6 * monthly expenses)
  //for monthly - yearly saving/12

  const userID = user._id;

  //get the assets data for the user
  const userAssets = await Assets.findOne({ userID: userID });
  if (!userAssets) {
    return next(new ErrorResponse(`User not found with id ${userID}`, 401));
  }

  const lump_sum_invest =
    userAssets.savings + userAssets.fixedDeposit - 6 * user.monthly_expenses;

  const current_invested_assets = userAssets.investments;
  const lump_sum_investiable_amount =
    userAssets.savings + userAssets.fixedDeposit - 6 * user.monthly_expenses;

  //calculate current assets
  const current_assets = current_invested_assets + lump_sum_investiable_amount;
  //calculate yearly savings
  const yearly_savings = current_assets * 12;
  const monthly_invest = yearly_savings / 12;

  res.status(200).json({ success: true, data: monthly_invest });
});
