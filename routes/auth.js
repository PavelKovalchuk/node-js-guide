const express = require("express");
const {check, body} = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, {req}) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email is forbidden");
        // }
        // return true;
        return User.findOne({email: value}).then((user) => {
          if (user) {
            return Promise.reject("User with such email already exists.");
          }
        });
      }),
    body("password", "Please enter a password with only numbers and text and at least 4 characters.")
      .isLength({min: 4})
      .isAlphanumeric(),
    body("confirmPassword").custom((value, {req}) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
