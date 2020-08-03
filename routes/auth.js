const express = require('express');
const { register, confirmation, login } = require('../controllers/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/confirmation/:token', confirmation);

module.exports = router;
