const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// View the basket
router.get('/cart', cartController.viewCart);

// Add an item (Usually submitted via a hidden form on the product detail page)
router.post('/cart/add', cartController.addToCart);

// Process the final order
router.post('/checkout', cartController.checkout);

module.exports = router;