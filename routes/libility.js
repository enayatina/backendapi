const express = require('express');
const {
  addLibility,
  updateLibility,
  listLibility,
  deleteLibility,
  singleLibility,
} = require('../controllers/libility');

const router = express.Router();

router.route('/').post(addLibility).get(listLibility);
router
  .route('/:id')
  .get(singleLibility)
  .put(updateLibility)
  .delete(deleteLibility);

module.exports = router;
