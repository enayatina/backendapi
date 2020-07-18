const express = require('express');
const { Router } = require('express');
const {
  getUserPlan,
  createUserPlan,
} = require('../../controllers/planController');
const router = express.Router();

router.route('/:id').get(getUserPlan);
router.route('/').post(createUserPlan);

module.exports = router;
