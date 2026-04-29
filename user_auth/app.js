const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./config/db");
connectDB();

const app = express();
const authRoutes = require("./routes/authRoutes");
const manualPaymentRoutes = require("./routes/manualPaymentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://peri-peri-fyi9n2el4-shoo224s-projects.vercel.app';

const allowedOrigins = [
	FRONTEND_URL,
	'http://localhost:5173',
	'http://localhost:3000'
];

app.use(cors({
	origin: function (origin, callback) {
		// allow requests with no origin (like curl, Postman, server-to-server)
		if (!origin) return callback(null, true);
		if (allowedOrigins.indexOf(origin) !== -1) {
			return callback(null, true);
		}
		return callback(new Error('CORS policy: This origin is not allowed'));
	},
	credentials: true
}));

app.use(express.json());

// simple health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use('/api/manual-payment', manualPaymentRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;