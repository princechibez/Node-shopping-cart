const express = require("express");
const { check, body } = require("express-validator");
const User = require("../models/user");
const bycrypt = require("bcryptjs");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", [
  body("email")
  .isEmail()
  .custom((value, { req }) => {
    if (value === "") {
      throw new Error("Provide your email address")
    }
    return true
  })
], authController.postLogin);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email address...")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((existingUser) => {
          if (existingUser) {
            return Promise.reject("Email already exists, choose another email");
          }
        });
      }),
    body("password", "invalid password...")
      .isLength({ min: 5, max: 10 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords are not equal...");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
