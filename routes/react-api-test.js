const express = require("express");

const router = express.Router();

const weatherApiController = require('../controllers/react-weather-api');

router.get("/weather-list", weatherApiController.getWeatherList);

module.exports = router;