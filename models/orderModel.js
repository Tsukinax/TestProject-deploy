const db = require('../config/db');

const Order = {
    // Process a checkout
    createOrder: async (userId, addressId, totalPrice, paymentMethod, cartItems) => {
        // 1. Create the main order record
        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, address_id, total_price, payment_method) VALUES (?, ?, ?, ?)',
            [userId, addressId, totalPrice, paymentMethod]
        );
        const orderId = orderResult.insertId;

        // 2. Move items from the cart into the order_items table
        for (const item of cartItems) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.product_price]
            );
        }

        // 3. Empty the user's cart
        await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        return orderId;
    },

    // Get order history for the "My Account" page
    getOrderHistory: async (userId) => {
        const [rows] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', 
            [userId]
        );
        return rows;
    },

    // Get the specific books inside a past order
    getOrderDetails: async (orderId, userId) => {
        const [rows] = await db.query(
            `SELECT oi.*, p.product_name, p.product_images
             FROM order_items oi
             JOIN products p ON oi.product_id = p.product_id
             JOIN orders o ON oi.order_id = o.order_id
             WHERE oi.order_id = ? AND o.user_id = ?`,
            [orderId, userId]
        );
        return rows;
    }
};

module.exports = Order;