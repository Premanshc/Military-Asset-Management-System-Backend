const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createTransfer,
  getTransfers,
} = require('../controllers/transferController');

// Only admin or logistics_officer can create transfers
router.post('/', auth, createTransfer);

// All authenticated users can view transfers
router.get('/', auth, getTransfers);

module.exports = router;
