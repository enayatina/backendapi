const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Libility = require('../models/Libility');

//@desc    Add libility
//@method  POST /api/v1/libiliy
//@auth    Public
exports.addLibility = async (req, res, next) => {
  try {
    const libility = await Libility.create(req.body);
    res.status(201).json({
      success: true,
      data: libility,
    });
  } catch (err) {
    //@ 400 is used for bad request
    next(err);
  }
};

//@desc    Show / list all libility
//@method  GET /api/v1/libility
//@auth    Public
exports.listLibility = asyncHandler(async (req, res, next) => {
  const libilities = await Libility.find();
  res
    .status(200)
    .json({ success: true, count: libilities.length, data: libilities });
});

//@desc    Get single libility
//@method  GET /api/v1/libility/:id
//@auth    Public
exports.singleLibility = asyncHandler(async (req, res, next) => {
  const libility = await Libility.findById(req.params.id);

  //To check for empty result from the db
  if (!libility) {
    return next(
      new ErrorResponse(`Libility not found with id ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: libility });
});

//@desc    Update libility
//@method  GET /api/v1/libility/:id
//@auth    Public
exports.updateLibility = asyncHandler(async (req, res, next) => {
  const libility = await Libility.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  //To check for empty result from the db
  if (!libility) {
    return req.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: libility });
});

//@desc    Delete libility
//@method  GET /api/v1/libility/:id
//@auth    Public
exports.deleteLibility = asyncHandler(async (req, res, next) => {
  const libility = await Libility.findByIdAndDelete(req.params.id);

  //To check for empty result from the db
  if (!libility) {
    return req.status(400).json({ success: false });
  }

  res.status(200).json({ success: true, data: {} });
});
