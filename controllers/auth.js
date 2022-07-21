const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const saltRound = 10;
require("dotenv/config");

const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    oldInputs: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errorMessage: null,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    oldInputs: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    errorMessage: null,
  });
};

exports.postLogin = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      isAuthenticated: false,
      oldInputs: {
        email: email,
        password: password,
      },
      errorMessage: errors.array()[1].msg,
    });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          isAuthenticated: false,
          oldInputs: {
            email: email,
            password: password,
          },
          errorMessage: "User does not exist.",
        });
      }
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          return res.render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            isAuthenticated: false,
            oldInputs: {
              email: email,
              password: password,
            },
            errorMessage: "Wrong password",
          });
        }
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save((err) => {
          console.log(err);
          return res.redirect("/");
        });
      });
    })
    .catch((err) => {
      let error = new Error(err);
      error.httpStatusCode = 500;
      next(error);
    });
};

exports.postSignup = async (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      isAuthenticated: false,
      oldInputs: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  try {
    let SALT = await bcrypt.genSalt(saltRound);
    let hashedPassword = await bcrypt.hash(password, SALT);
    let user = new User({
      email: email,
      password: hashedPassword,
      cart: { items: [] },
    });
    user.save();

    transporter.sendMail(
      {
        from: "node@node-app.com",
        to: '"nwobiprince8@gmail.com", "chibezprince@gmail.com"',
        subject: "Successfull Registration",
        text: "Congrats, you have successfully registered for this application...",
      },
      (err, data) => {
        if (err) {
          return console.log(err);
        }
        console.log("Email sent successfully");
      }
    );
    res.redirect("/login");
  } catch (err) {
    let error = new Error(err);
    error.httpStatusCode = 500;
    next(error);
  }
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.sendToAllEmail = (req, res, next) => {
  User.find()
    .then((users) => {
      let emails = [];
      for (let user of users) {
        emails.push(user.email)
      }
      return emails;
    })
    .then(emails => {
      transporter.sendMail(
        {
          from: "node@node-app.com",
          to: emails,
          subject: "Successfull Registration",
          text: "Congrats, you have successfully registered for this application...",
        },
        (err, data) => {
          if (err) {
            return console.log(err);
          }
          console.log("Email sent successfully");
        }
      );
    })
    .catch((err) => console.log(err));
};