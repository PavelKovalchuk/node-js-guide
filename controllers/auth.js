const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }

      const newUser = new User({
        email: email,
        password: password,
        name: name,
        cart: {
          items: [],
        },
      });

      return newUser.save();
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((err) => console.log("postSignup email err", err));
};

exports.postLogin = (req, res, next) => {
  User.findById("5d91cadd26936718ac407260")
    .then((user) => {
      console.log("user", user);
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save((error) => {
        if (error) {
          console.log("postLogin session.save err", err);
        }
        res.redirect("/");
      });
    })
    .catch((err) => console.log("postLogin err", err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log("postLogout err", err);
    res.redirect("/");
  });
};
