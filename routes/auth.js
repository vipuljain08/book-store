const express = require("express");
const { check, body } = require("express-validator");

const router = express.Router();

const authController = require("../controllers/auth");
const User = require("../models/users");

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((value, { req }) => {
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject("Email is already used !");
        }
      });
    }).normalizeEmail(),
  body(
    "password",
    "Please enter a password with only alphanumeric value and at least 10 characters."
  )
    .isLength({ min: 10 })
    .isAlphanumeric().trim(),
  body("confirmPassword").trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password should be match");
    }
    return true;
  }),
  authController.postSignup
);

router.get("/login", authController.getLogin);

router.post(
  "/login",
  check("email").isEmail().withMessage("Enter a valid email"),
  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
