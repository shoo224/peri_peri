const RegisteredUser = require('../models/User');
const TestUser = require('../models/TestUser');
const ManualPaymentRequest = require('../models/ManualPaymentRequest');
const { sendMail } = require('../utils/email');

// return list of pending manual orders across users
exports.getPendingManualOrders = async (req, res) => {
  try {
    // read pending manual payment requests
    const results = await ManualPaymentRequest.find({ status: 'pending' }).sort({ createdAt: 1 }).lean();
    return res.json(results.map(r => ({ requestId: r._id, userId: r.user, email: r.email, order: r.order, utr: r.utr, createdAt: r.createdAt })));
  } catch (err) {
    console.error('getPendingManualOrders', err);
    return res.status(500).json({ message: 'Failed to fetch pending orders', error: err.message });
  }
};

// mark a user's order as paid (admin action)
exports.verifyOrder = async (req, res) => {
  try {
    const { requestId } = req.params;
    const reqRecord = await ManualPaymentRequest.findById(requestId);
    if (!reqRecord) return res.status(404).json({ message: 'Payment request not found' });

    // find user by id or email
    let user = null;
    if (reqRecord.user) user = await RegisteredUser.findById(reqRecord.user) || await TestUser.findById(reqRecord.user);
    if (!user) {
      user = await RegisteredUser.findOne({ email: reqRecord.email }) || await TestUser.findOne({ email: reqRecord.email });
    }
    if (!user) return res.status(404).json({ message: 'User not found for this request' });

    // push the order into user's orders and mark as paid
    user.orders = user.orders || [];
    const orderToSave = { ...reqRecord.order };
    orderToSave.status = 'paid';
    orderToSave.payment = orderToSave.payment || {};
    orderToSave.payment.status = 'paid';
    orderToSave.payment.verifiedAt = new Date();
    user.orders.push(orderToSave);
    await user.save();

    reqRecord.status = 'paid';
    reqRecord.verifiedAt = new Date();
    await reqRecord.save();

    // attempt to notify user by email
    try {
      const subject = 'Your Peri Peri Bites order is confirmed';
      const body = `Hello ${user.name || ''},\n\nYour order placed on ${new Date().toLocaleString()} has been verified and marked as paid.\nTotal: ₹${(orderToSave.total||0).toFixed(2)}\n\nThank you for ordering from Peri Peri Bites.`;
      await sendMail({ to: reqRecord.email, subject, text: body });
    } catch (e) { console.error('email send failed', e); }

    return res.json({ message: 'Order verified and saved to user orders' });
  } catch (err) {
    console.error('verifyOrder', err);
    return res.status(500).json({ message: 'Failed to verify order', error: err.message });
  }
};

// reject a manual payment request with optional reason
exports.rejectOrder = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body || {};
    const reqRecord = await ManualPaymentRequest.findById(requestId);
    if (!reqRecord) return res.status(404).json({ message: 'Payment request not found' });

    reqRecord.status = 'rejected';
    reqRecord.rejectedAt = new Date();
    if (reason) reqRecord.rejectionReason = reason;
    await reqRecord.save();

    // notify user
    try {
      const subject = 'Your Peri Peri Bites payment could not be verified';
      let body = `Hello,\n\nWe could not verify your recent payment for the order dated ${new Date(reqRecord.createdAt).toLocaleString()}.`;
      if (reason) body += `\nReason: ${reason}`;
      body += `\n\nPlease contact support or retry the payment.`;
      await sendMail({ to: reqRecord.email, subject, text: body });
    } catch (e) { console.error('email send failed', e); }

    return res.json({ message: 'Payment request marked as rejected' });
  } catch (err) {
    console.error('rejectOrder', err);
    return res.status(500).json({ message: 'Failed to reject order', error: err.message });
  }
};
