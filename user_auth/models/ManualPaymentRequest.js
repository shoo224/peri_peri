const mongoose = require('mongoose');

const ManualPaymentRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'RegisteredUser', required: false },
  email: { type: String, required: true },
  order: { type: mongoose.Schema.Types.Mixed, required: true },
  utr: { type: String },
  status: { type: String, enum: ['pending','paid','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  verifiedAt: { type: Date }
});

module.exports = mongoose.model('ManualPaymentRequest', ManualPaymentRequestSchema);
