const RegisteredUser = require("../models/User"); // For registered users
const TestUser = require("../models/TestUser"); // For test users
const ManualPaymentRequest = require('../models/ManualPaymentRequest');
const bcrypt = require("bcryptjs");

exports.registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;
        
        // Check if user exists in RegisteredUser collection
        const userExists = await RegisteredUser.findOne({email});
        if(userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        // Password Hashing
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Create user in RegisteredUser collection
        const user = await RegisteredUser.create({
            name, email, password:hashPassword, role:role || "Customer"
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: "User registered successfully"
        })

    } catch (error) {
        return res.status(500).json({
                message: "User failed to register",
                error: error.message
            })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        // Check in RegisteredUser collection first (priority for real users)
        let user = await RegisteredUser.findOne({email});
        let userType = "registered";
        
        // If not found in RegisteredUser, check in TestUser collection
        if(!user) {
            user = await TestUser.findOne({email});
            userType = "test";
        }
        
        if(!user) {
            return res.status(401).json({
                message: "Invalid credentials. Please register if you don't have an account."
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid credentials. Please check your email and password."
            })
        }

        // generate JWT token
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role || 'Customer' }, process.env.JWT_SECRET || 'secret_dev_key', { expiresIn: '12h' });

        res.json({
            message: "Login success",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'Customer',
            token
        })
    } catch (error) {
        return res.status(500).json({
                message: "User failed to login",
                error: error.message
            })
    }
}

// Create and store an order summary under the user (registered or test)
exports.createOrder = async (req, res) => {
    try {
        const { email, order } = req.body;
        if (!email || !order) {
            return res.status(400).json({ message: 'Email and order data are required' });
        }

        // Try registered users first
        let user = await RegisteredUser.findOne({ email });
        let Model = RegisteredUser;

        if (!user) {
            user = await TestUser.findOne({ email });
            Model = TestUser;
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If this is a manual payment that is not yet paid, create a ManualPaymentRequest
        if (order.payment && order.payment.method === 'manual' && order.payment.status !== 'paid') {
            const reqRecord = new ManualPaymentRequest({ user: user._id, email: user.email, order, utr: order.payment?.utr || '' });
            await reqRecord.save();
            return res.status(201).json({ message: 'Manual payment request created', requestId: reqRecord._id });
        }

        // Otherwise save the order directly to the user's orders array
        user.orders = user.orders || [];
        // normalize order status
        const orderToSave = { ...order };
        if (!orderToSave.status) orderToSave.status = 'paid';
        user.orders.push(orderToSave);

        await user.save();

        return res.status(201).json({ message: 'Order saved', order: orderToSave });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to save order', error: error.message });
    }
}