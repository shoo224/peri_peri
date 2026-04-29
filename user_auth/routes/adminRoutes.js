const express = require('express');
const router = express.Router();
const admin = require('../controller/adminController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/manual-orders', verifyToken, requireAdmin, admin.getPendingManualOrders);
router.post('/manual-orders/:requestId/verify', verifyToken, requireAdmin, admin.verifyOrder);
router.post('/manual-orders/:requestId/reject', verifyToken, requireAdmin, admin.rejectOrder);

module.exports = router;
