const express = require('express');
const { getPlanning, userLogin } = require('../controllers/user');

const router = express.Router();

router.get('/getPlanning/:email', getPlanning);
router.post('/userlogin', userLogin);

module.exports = router;
