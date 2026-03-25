const express = require('express');
const router = express.Router();
const backofficeController = require('../controllers/backofficeController');

// The main admin dashboard
router.get('/admin', backofficeController.getDashboard);

module.exports = router;