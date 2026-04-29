const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 5
    },
    role: {
        type: String,
        enum: ["Admin", "Emp", "Customer"],
        default: "Customer"
    }
    ,
    orders: [
        {
            items: [
                {
                    productId: { type: String },
                    name: { type: String },
                    qty: { type: Number, default: 1 },
                    price: { type: Number, default: 0 }
                }
            ],
            subtotal: { type: Number, default: 0 },
            tax: { type: Number, default: 0 },
            total: { type: Number, default: 0 },
            status: { type: String, default: 'Pending' },
            createdAt: { type: Date, default: Date.now }
        }
    ]
},
{timestamps: true}
);

// This model is for REGISTERED USERS only (via registration form)
module.exports = mongoose.model("RegisteredUser", userSchema);