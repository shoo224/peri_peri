// manualPaymentController: handles manual UTR-based payments
const RegisteredUser = require('../models/User');
const TestUser = require('../models/TestUser');
const ManualPaymentRequest = require('../models/ManualPaymentRequest');

exports.submitManualPayment = async (req, res) => {
  try {
    const { email, order } = req.body;
    if (!email || !order) return res.status(400).json({ message: 'Email and order required' });

    let user = await RegisteredUser.findOne({ email });
    let Model = RegisteredUser;
    if (!user) {
      user = await TestUser.findOne({ email });
      Model = TestUser;
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    // create a separate manual payment request record
    const reqRecord = new ManualPaymentRequest({ user: user._id, email: user.email, order, utr: order.payment?.utr || '' });
    await reqRecord.save();

    return res.status(201).json({ message: 'Manual payment submitted', requestId: reqRecord._id });
  } catch (err) {
    console.error('submitManualPayment error', err);
    return res.status(500).json({ message: 'Failed to submit manual payment', error: err.message });
  }
};
