const express = require('express');
const { childloan, expenses } = require('../controllers/childeducation');

const router = express.Router();

router.route('/childloan').post(childloan);
router.route('/expenses').post(expenses);

module.exports = router;
