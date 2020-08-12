const express = require('express');
const {
  addAssumption,
  singleAssumption,
  updateAssumption,
  deleteAssumption,
  listAssumption,
} = require('../controllers/assumption');

const router = express.Router();

router.route('/').post(addAssumption).get(listAssumption);
router
  .route('/:id')
  .get(singleAssumption)
  .put(updateAssumption)
  .delete(deleteAssumption);

module.exports = router;
