const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// for connecting DB for raw MongoDb
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

/**
 * Assigns setting name to value. Sharing data.
 * You may store any value that you want, but certain names can be used to configure the behavior of the server
 *
 * "view engine" -> The default engine extension to use when omitted.
 * "views" -> A directory or an array of directories for the application's views.
 *  If an array, the views are looked up in the order they occur in the array.
 */

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded());

// static data (assets) - manages getting files (with .css, .js etc)
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("5d8e08ea0741b0298c250b9b")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((error) => {
      console.error("add user data error", error);
    });
});

// imported routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);

//404
app.use(errorController.get404);

// for connecting DB for raw MongoDb
/* mongoConnect(() => {
  console.log("--- mongoConnect runs!");
  app.listen(3000);
}); */

mongoose
  .connect("mongodb+srv://pavel:12081988@node-guide-gnpw9.mongodb.net/shop?retryWrites=true&w=majority")
  .then(() => {
    app.listen(3000);
  })
  .catch((error) => {
    console.error("Error in connecting mongoose: ", error);
  });
