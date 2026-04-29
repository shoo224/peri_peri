const express = require('express');
const router = express.Router();
const payment = require('../controller/manualPaymentController');

router.post('/submit', payment.submitManualPayment);

module.exports = router;

module.exports = router;
