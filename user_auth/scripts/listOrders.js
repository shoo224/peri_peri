require('dotenv').config();
const mongoose = require('mongoose');
const RegisteredUser = require('../models/User');
const TestUser = require('../models/TestUser');

const MONGO_URI = process.env.MONGO_URI;

const listOrders = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const regUsers = await RegisteredUser.find({ 'orders.0': { $exists: true } }).lean();
    const testUsers = await TestUser.find({ 'orders.0': { $exists: true } }).lean();

    if (regUsers.length === 0 && testUsers.length === 0) {
      console.log('No saved orders found for any user.');
    } else {
      console.log('Registered users with orders:');
      regUsers.forEach(u => {
        console.log(`- ${u.email} (${u.name}) - ${u.orders.length} order(s)`);
        u.orders.forEach((o, i) => {
          console.log(`  Order ${i+1}: total=${o.total} subtotal=${o.subtotal} items=${o.items.length} createdAt=${o.createdAt}`);
        });
      });

      console.log('\nTest users with orders:');
      testUsers.forEach(u => {
        console.log(`- ${u.email} (${u.name}) - ${u.orders.length} order(s)`);
        u.orders.forEach((o, i) => {
          console.log(`  Order ${i+1}: total=${o.total} subtotal=${o.subtotal} items=${o.items.length} createdAt=${o.createdAt}`);
        });
      });
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error listing orders:', err.message);
    process.exit(1);
  }
};

listOrders();
