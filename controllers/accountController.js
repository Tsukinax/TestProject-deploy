const User = require('../models/userModel');
const Order = require('../models/orderModel');

const accountController = {
    // Render the main "My Account" dashboard
    getAccountPage: async (req, res) => {
        try {
            // Get the ID of whoever is currently logged in
            const userId = req.session.userId;

            // If they aren't logged in, kick them back to the login page
            if (!userId) {
                return res.redirect('/auth/login');
            }

            // Fetch their profile data and their past orders
            const userProfile = await User.findById(userId);
            const orderHistory = await Order.getOrderHistory(userId);

            // Send that data to the webstore/profile.ejs file
            res.render('webstore/profile', { 
                user: userProfile, 
                profileUser: userProfile, // For profile.ejs template
                orders: orderHistory 
            });
        } catch (error) {
            console.error('Account page error:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Render a specific past receipt/order detail
    getOrderDetails: async (req, res) => {
        try {
            const userId = req.session.userId;
            const orderId = req.params.id;

            if (!userId) return res.redirect('/auth/login');

            // Fetch the specific books inside that past order
            const orderItems = await Order.getOrderDetails(orderId, userId);

            res.render('webstore/orderHistory', { 
                orderId: orderId,
                items: orderItems 
            });
        } catch (error) {
            console.error('Order details error:', error);
            res.status(500).send('Internal Server Error');
        }
    }
};

module.exports = accountController;