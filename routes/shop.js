const express = require('express');
const path = require('path');
const router = express.Router();
const rootDir = require('../util/path');

// function "use" for every upcoming request
router.get('/', (req, res, next) => {
  console.log('In common middleware');
  console.log('---------------------');

  // __dirname - absolute path to this file
  res.sendFile(path.join(rootDir ,'views' , 'shop.html'));
});

module.exports = router;