const express = require('express');
const {
  addPlan,
  updatePlan,
  showPlanningResults,
} = require('../controllers/planning');

const router = express.Router();

router.route('/').post(addPlan);
router.route('/:id').get(showPlanningResults).put(updatePlan);

module.exports = router;
