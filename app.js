const path = require("path");
const user = require("./models/user");

const multer = require("multer");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv/config");
const connectDB = require("./db/db");
const cors = require("cors");

const errorController = require("./controllers/error");
// const User = require("./models/user");

const app = express();

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "Test Session",
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg"
  ) {
    return cb(null, true);
  }
  cb(null, false);
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

// app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  user
    .findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => next(new Error(err)));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  // console.log(error.httpStatusCode);
  // res.status(error.httpStatusCode).redirect("/500");
  res.redirect("/500");
});

// app.use((req, res, next) => {
//   res.setHeader("Allow-control-Access")
// })

connectDB(() => {
  app.listen(process.env.PORT || 8080, () => console.log("Connected..."));
});
