const express = require('express');
const router = express.Router();

// function "use" for every upcoming request
router.get('/', (req, res, next) => {
  console.log('In another middleware');
  console.log('---------------------');

  res.send('<h1>Hello</h1>');
});

module.exports = router;