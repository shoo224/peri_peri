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

app.use(cors());
app.use(express.json());

// simple health check
app.get('/api/health', (req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use('/api/manual-payment', manualPaymentRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;