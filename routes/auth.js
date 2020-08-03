const express = require('express');
const { register, confirmation } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.get('/confirmation/:token', confirmation);

module.exports = router;
