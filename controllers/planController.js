//@dec get user plan
//@route GET api/v1/calculators/:id
//@access Public
exports.getUserPlan = (req, res, next) => {
  res
    .status(200)
    .json({
      success: true,
      msg: `get user id and show his plan ${req.params.id}`,
    });
};

//@dec Crate user and get plan inputs
//@route POST api/v1/calculators/
//@access Public
exports.createUserPlan = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: 'get user inputs and prepare his plan' });
};
