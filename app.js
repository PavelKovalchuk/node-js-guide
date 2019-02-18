const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

// imported routes
app.use(adminRoutes);
app.use(shopRoutes);
//404
app.use((req, res, next) => {
  res
    .status(404)
    .send('<h1>Sorry, page not found</h1>');
});

app.listen(3000);