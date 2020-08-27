const express = require('express');
const {
  childloan,
  expenses,
  taxDeduction,
} = require('../controllers/childeducation');

const router = express.Router();

router.route('/childloan').post(childloan);
router.route('/expenses').post(expenses);
router.route('/taxDeduction').post(taxDeduction);

module.exports = router;
