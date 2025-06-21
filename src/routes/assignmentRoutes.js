const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createAssignment,
  createExpenditure,
  getAssignments,
  getExpenditures,
} = require('../controllers/assignmentController');

// Assign asset to personnel/unit
router.post('/assign', auth, createAssignment);

// Mark asset as expended
router.post('/expend', auth, createExpenditure);

// Get all assignments
router.get('/assign', auth, getAssignments);

// Get all expenditures
router.get('/expend', auth, getExpenditures);

module.exports = router;
