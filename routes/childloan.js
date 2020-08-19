const express = require('express');
const { childloan } = require('../controllers/childeducation');

const router = express.Router();

router.route('/childloan').post(childloan);

module.exports = router;
