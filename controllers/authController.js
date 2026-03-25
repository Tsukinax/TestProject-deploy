const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const authController = {
    // Render the forms
    getLoginPage: (req, res) => res.render('webstore/login', { error: null }),
    getRegisterPage: (req, res) => res.render('webstore/register', { error: null }),

    // Process a Login
    loginUser: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findByEmail(email);
            
            // Compare typed password with the hashed password in database
            if (user && await bcrypt.compare(password, user.password_hash)) {
                // Save user info in the session
                req.session.userId = user.user_id;
                req.session.role = user.role;
                
                // Redirect admins to the back-office, customers to the homepage
                return user.role === 'admin' ? res.redirect('/admin') : res.redirect('/');
            }
            res.render('webstore/login', { error: 'Invalid email or password' });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).send('Internal Server Error');
        }
    },

    // Process a Registration
    registerUser: async (req, res) => {
        const { username, email, password } = req.body;
        try {
            // Hash the password with a salt round of 10
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.createCustomer(username, email, hashedPassword);
            
            // Redirect to login after successful registration
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Registration error:', error);
            res.render('webstore/register', { error: 'Email might already be in use.' });
        }
    },

    // Process a Logout
    logoutUser: (req, res) => {
        req.session.destroy((err) => {
            res.redirect('/');
        });
    }
};

module.exports = authController;