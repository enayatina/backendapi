const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('show plan');
});

router.get('/:id', (req, res) => {
  res.send('single  plan');
});

router.post('/', (req, res) => {
  res.send('create plan');
});

router.put('/:id', (req, res) => {
  res.send(`update plan with id: ${req.params.id}`);
});

module.exports = router;
