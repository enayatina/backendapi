//@desc    Store all the planning data into the database
//@method  POST /api/v1/planning
//@auth    Public
exports.addPlan = (req, res, next) => {
  res.status(200).json({ msg: 'create a new plan for a user' });
};

//@desc    Show calculation based on planning data
//@method  GET /api/v1/planning/:id
//@auth    Public
exports.showPlanningResults = (req, res, next) => {
  res.status(200).json({ msg: 'based on planning data, here is the result' });
};

//@desc    Update planning data
//@method  GET /api/v1/planning/:id
//@auth    Public
exports.updatePlan = (req, res, next) => {
  res.status(200).json({ msg: 'Update plan data' });
};
