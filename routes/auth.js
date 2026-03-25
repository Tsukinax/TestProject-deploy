const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Show the forms
router.get('/auth/login', authController.getLoginPage);
router.get('/auth/register', authController.getRegisterPage);

// Process the form submissions
router.post('/auth/login', authController.loginUser);
router.post('/auth/register', authController.registerUser);

// Handle logout
router.get('/auth/logout', authController.logoutUser);

module.exports = router;