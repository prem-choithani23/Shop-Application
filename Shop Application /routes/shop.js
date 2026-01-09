const express = require('express');

const shopController = require('../controllers/shop');
const {postCartDeleteProduct} = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex)

router.get("/cart",shopController.getCart)

router.post("/cart" , shopController.postCarts)

router.post("/create-order" , shopController.postOrder)

router.get('/orders' , shopController.getOrders)

router.get("/products" , shopController.getProducts)

router.get('/products/:productId' , shopController.getProduct)

router.get('/checkout' , shopController.getCheckout)


router.post('/cart-delete-item' , postCartDeleteProduct)
module.exports = router;