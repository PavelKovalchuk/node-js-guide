const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// for connecting DB for raw MongoDb
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const MONGO_DB_URI =
  "mongodb+srv://pavel:12081988@node-guide-gnpw9.mongodb.net/shopMongoose?retryWrites=true&w=majority";

const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});

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
const authRoutes = require("./routes/auth");

// 3-party package for encoding data in the body
// Middleware pattern
app.use(bodyParser.urlencoded({extended: true}));

// static data (assets) - manages getting files (with .css, .js etc)
app.use(express.static(path.join(__dirname, "public")));
// Session middleware
app.use(
  session({
    secret: "me long string value",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60000},
    store: store,
  })
);

app.use((req, res, next) => {
  User.findById("5d91cadd26936718ac407260")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      console.error("add user data error", error);
    });
});

// imported routes
app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//404
app.use(errorController.get404);

// for connecting DB for raw MongoDb
/* mongoConnect(() => {
  console.log("--- mongoConnect runs!");
  app.listen(3000);
}); */

mongoose
  .connect(MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Bob",
          email: "bob@test.com",
          cart: {
            items: [],
          },
        });

        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((error) => {
    console.error("Error in connecting mongoose: ", error);
  });
