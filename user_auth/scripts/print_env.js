require('dotenv').config();
console.log(process.env.MONGO_URI || '<MONGO_URI_NOT_SET>');
