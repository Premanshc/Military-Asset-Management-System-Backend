const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const { createPurchase, getPurchases } = require('../controllers/purchaseController');

// Protected: only admin and logistics_officer can add purchases
router.post('/', auth, createPurchase);

// Anyone logged in can view
router.get('/', auth, getPurchases);

module.exports = router;
