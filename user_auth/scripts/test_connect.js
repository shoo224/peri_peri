require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing mongoose connect to:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => { console.log('Connected OK'); process.exit(0); })
  .catch(err => { console.error('CONNECT_ERROR'); console.error(err && err.message); process.exit(1); });
