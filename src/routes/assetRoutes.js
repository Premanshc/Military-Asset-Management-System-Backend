const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllAssets } = require('../controllers/assetController');

router.get('/', auth, getAllAssets);

module.exports = router;
