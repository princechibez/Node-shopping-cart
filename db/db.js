const mongoose = require("mongoose");
require("dotenv/config");

const connectDB = (cb) => {
  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      cb();
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
