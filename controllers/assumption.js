const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Assumption = require('../models/Assumptions');

//@desc    Add assumption
//@method  POST /api/v1/libiliy
//@auth    Public
exports.addAssumption = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const assumption = await Assumption.create(req.body);
  res.status(201).json({
    success: true,
    data: assumption,
  });
});

//@desc    Show / list all assumption
//@method  GET /api/v1/assumption
//@auth    Public
exports.listAssumption = asyncHandler(async (req, res, next) => {
  const assumption = await Assumption.find();
  res
    .status(200)
    .json({ success: true, count: assumption.length, data: assumption });
});

//@desc    Get single assumption
//@method  GET /api/v1/assumption/:id
//@auth    Public
exports.singleAssumption = asyncHandler(async (req, res, next) => {
  const assumption = await Assumption.findById(req.params.id);

  //To check for empty result from the db
  if (!assumption) {
    return next(
      new ErrorResponse(`assumption not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: assumption });
});

//@desc    Update assumption
//@method  GET /api/v1/assumption/:id
//@auth    Public
exports.updateAssumption = asyncHandler(async (req, res, next) => {
  const assumption = await Assumption.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  //To check for empty result from the db
  if (!assumption) {
    return req.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: assumption });
});

//@desc    Delete assumption
//@method  GET /api/v1/assumption/:id
//@auth    Public
exports.deleteAssumption = asyncHandler(async (req, res, next) => {
  const assumption = await Assumption.findByIdAndDelete(req.params.id);

  //To check for empty result from the db
  if (!assumption) {
    return req.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: {} });
});
