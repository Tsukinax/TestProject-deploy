const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');

const cartController = {
    // View the shopping cart page
    viewCart: async (req, res) => {
        try {
            const userId = req.session.userId;
            const cartItems = await Cart.getCartByUserId(userId);
            res.render('webstore/cart', { cartItems: cartItems });
        } catch (error) {
            console.error('Cart error:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Add a book to the cart
    addToCart: async (req, res) => {
        try {
            const userId = req.session.userId;
            if (!userId) {
                return res.redirect('/auth/login');
            }

            const { product_id, quantity } = req.body;
            
            await Cart.addItem(userId, product_id, parseInt(quantity) || 1);
            res.redirect('/cart'); // Send them to the basket after adding
        } catch (error) {
            console.error('Add to cart error:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Process the checkout
    checkout: async (req, res) => {
        try {
            const userId = req.session.userId;
            const { addressId, paymentMethod } = req.body;
            
            // 1. Get their items
            const cartItems = await Cart.getCartByUserId(userId);
            if (cartItems.length === 0) return res.redirect('/cart');

            // 2. Calculate the total price
            const total = cartItems.reduce((sum, item) => sum + (item.product_price * item.quantity), 0);
            
            // 3. Create the order in the database
            await Order.createOrder(userId, addressId || 1, total, paymentMethod || 'Credit Card', cartItems);
            
            res.redirect('/success'); // Or wherever your order confirmation page is
        } catch (error) {
            console.error('Checkout error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = cartController;