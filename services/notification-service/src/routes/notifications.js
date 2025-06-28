const express = require('express');
const router = express.Router();

// Basic notification routes
router.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'notification-routes' });
});

module.exports = router;
