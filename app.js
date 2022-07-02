const path = require("path");
// const mongoConnect = require("./util/database").mongoConnect;
// const mongoose = require('mongoose');
const connectDB = require("./db/db");
const User = require('./models/user');
const cors = require("cors");

const express = require("express");
const bodyParser = require("body-parser");
require("dotenv/config")

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const reactWeatherRoutes = require("./routes/react-api-test");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // used for json requests parsed in the body
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("62ba28824d9081e5a7e44971")
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(reactWeatherRoutes);

app.use(errorController.get404);

connectDB(() => {
  User.findOne().then(user => {
    if(!user) {
      const user = new User({
        name: "Prince",
        email: "chibezprince@gmail.com",
        cart: {
          items: []
        }
      });
      user.save();
    }
  })
  const port = process.env.PORT || 8080
  app.listen(port, () => console.log("Connected..."));
});
