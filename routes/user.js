const express = require('express');
const { getPlanning } = require('../controllers/user');

const router = express.Router();

router.get('/getPlanning/:email', getPlanning);

module.exports = router;
