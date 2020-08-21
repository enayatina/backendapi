const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const CountrywiseAssumption = require('../models/CountrywiseAssumption');


exports.addcwa = asyncHandler(async (req, res, next) => {
  const cwa = await CountrywiseAssumption.create(req.body);
  res.status(201).json({
    success: true,
    data: cwa,
  });
});


exports.listcwa = asyncHandler(async (req, res, next) => {
  const cwa = await CountrywiseAssumption.find();
  res
    .status(200)
    .json({ success: true,  data: cwa });
});





