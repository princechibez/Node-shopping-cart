const path = require('path');
const isAuth = require("../middlewares/isAuth");

const express = require('express');

const shopController = require('../controllers/shop');
const authController = require("../controllers/auth");

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', isAuth, shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

router.get("/send-to-all", authController.sendToAllEmail);

module.exports = router;
