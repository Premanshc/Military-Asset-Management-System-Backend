const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAdminDashboardStats,
  getCommanderDashboardStats,
} = require('../controllers/dashboardController');

// General dashboard for admin/logistics (with filters)
router.get('/', auth, getDashboardStats);

// Admin overview (total bases, users, etc.)
router.get('/admin', auth, getAdminDashboardStats);

// Commander-specific dashboard (only own base, no filters)
router.get('/commander', auth, getCommanderDashboardStats);

module.exports = router;
