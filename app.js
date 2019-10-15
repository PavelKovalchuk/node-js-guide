const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const errorController = require("./controllers/error");
// for connecting DB for raw MongoDb
// const mongoConnect = require("./util/database").mongoConnect;
const mongoose = require("mongoose");
const shopController = require("./controllers/shop");
const isAuth = require("./middleware/is-auth");
const User = require("./models/user");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const MONGO_DB_URI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@node-guide-gnpw9.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGO_DB_URI,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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

// Middleware for handling binary files
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));

// static data (assets) - manages getting files (with .css, .js etc)
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

// Session middleware
app.use(
  session({
    secret: "me long string value",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 6000000},
    store: store,
  })
);

app.use(flash());

app.use((req, res, next) => {
  // res.locals - here we can add local variables for the views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.userEmail = req.session.user && req.session.user.email ? req.session.user.email : null;
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

// imported routes

app.post("/create-order", isAuth, shopController.postOrders);
app.use(csrfProtection);
app.use((req, res, next) => {
  // res.locals - here we can add local variables for the views
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 500
app.get("/500", errorController.get500);

//404
app.use(errorController.get404);

// Error handler middleware
app.use((error, req, res, next) => {
  // res.redirect("/500");
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: error.message ? error.message : null,
  });
});

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

mongoose
  .connect(MONGO_DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((error) => {
    console.error("Error in connecting mongoose: ", error);
  });
