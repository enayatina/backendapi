const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

//@desc    Register a user
//@method  POST /api/v1/auth/register
//@auth    Public
exports.register = asyncHandler(async (req, res, next) => {
  const {} = req.body;

  res.status(200).json({ success: true, msg: 'user is registerd' });
});
