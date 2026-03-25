const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// View the main account dashboard (Profile + Order History list)
router.get('/account', accountController.getAccountPage);

// View the details of a specific past order
router.get('/account/orders/:id', accountController.getOrderDetails);

module.exports = router;