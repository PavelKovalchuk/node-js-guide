const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

app.use('/add-product', (req, res, next) => {
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

app.use('/product', (req, res, next) => {
  console.log('product req.body: ', req.body);
  res.redirect('/');
});

// function "use" for every upcoming request
app.use('/', (req, res, next) => {
  console.log('In another middleware');
  console.log('---------------------');

  res.send('<h1>Hello</h1>');
});

app.listen(3000);