const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

const app = express();

/**
 * Assigns setting name to value. Sharing data.
 * You may store any value that you want, but certain names can be used to configure the behavior of the server
 *
 * "view engine" -> The default engine extension to use when omitted.
 * "views" -> A directory or an array of directories for the application's views.
 *      If an array, the views are looked up in the order they occur in the array.
 */
// Register new engine templating if it is not built in nodeJs
app.engine('hbs', expressHbs({
  layoutsDir: "views/layouts",
  defaultLayout: "main-layout",
  extname: "hbs",
}));

app.set('view engine', 'hbs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

// static data (assets) - manages getting files (with .css, .js etc)
app.use(express.static(path.join(__dirname, 'public')));

// imported routes
// /admin - filter
app.use('/admin', adminData.routes);
app.use(shopRoutes);
//404
app.use((req, res, next) => {
  res
    .status(404)
    // .sendFile(path.join(__dirname, 'views' , '404.html'));
    .render('404', {pageTitle: '404 page'})
});

app.listen(3000);