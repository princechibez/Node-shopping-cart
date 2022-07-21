const path = require('path');
const { body } = require("express-validator");
const { isNumber } = require('util');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', [
    body("title")
    .isLength({ max: 30 })
    .withMessage("Title can't be longer than 20 letters")
    .isString()
    .withMessage("Unacceptable title"),
    body("description")
    .isLength({max: 200})
    .withMessage("Description can't be longer than 350 words")
    .isString()
    .withMessage("Unacceptable Description")
], adminController.postAddProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
