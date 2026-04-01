const RegisteredUser = require("../models/User"); // For registered users
const TestUser = require("../models/TestUser"); // For test users
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

        res.json({
            message: "Login success",
            _id: user._id,
            name: user.name,
            email: user.email,
        })
    } catch (error) {
        return res.status(500).json({
                message: "User failed to login",
                error: error.message
            })
    }
}