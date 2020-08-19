const express = require('express');
const {
    addcwa,
    listcwa
} = require('../controllers/countrywiseassumption');

const router = express.Router();

router.route('/').post(addcwa).get(listcwa);


module.exports = router;
