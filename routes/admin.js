const express = require('express');
const router = express.Router();

router.get('/add-product', (req, res, next) => {
  console.log('In add-product middleware');
  res.send('' +
    '<div>' +
    '<h1>add product</h1>' +
    '<form action="product" method="post">' +
    '<input type="text" name="title" />' +
    '<button type="submit">Add prodcut</button>' +
    '</form>'+
    '</div>'
  );
});

// FIlter only GET-request / POST-request
router.post('/product', (req, res, next) => {
  console.log('product req.body: ', req.body);
  res.redirect('/');
});

module.exports = router;
