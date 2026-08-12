const express = require('express');
const router = express.Router();
const { updatePreferences } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

router.use(protect);
router.patch('/preferences', updatePreferences);

module.exports = router;
