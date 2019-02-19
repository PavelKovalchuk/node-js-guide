const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

// imported routes
// /admin - filter
app.use('/admin', adminRoutes);
app.use(shopRoutes);
//404
app.use((req, res, next) => {
  res
    .status(404)
    .res.sendFile(path.join(__dirname, 'views' , 'add-product.html'));
});

app.listen(3000);