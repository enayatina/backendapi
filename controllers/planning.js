//@desc    Store all the planning data into the database
//@method  POST
//@auth    Public
exports.addPlan = (req, res, next) => {
  res.send('create plan');
};

//@desc    Store all the planning data into the database
//@method  GET
//@auth    Public
exports.showPlanningResults = (req, res, next) => {
  res.status(200).json({ msg: 'based on planning data, here is the result' });
};
