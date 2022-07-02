const mongoose = require("mongoose");
require("dotenv/config")

const connectDB = (cb) => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => {
        cb()
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;