const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const TestUser = require("./models/TestUser"); // Use TestUser model for seeded data

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        const mongoURI = process.env.MONGO_URI;
        
        await mongoose.connect(mongoURI);
        console.log("✓ Connected to MongoDB");

        // Create test credentials
        const testCredentials = [
            {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
                role: "Customer"
            },
            {
                name: "Admin User",
                email: "admin@example.com",
                password: "admin123",
                role: "Admin"
            },
            {
                name: "John Doe",
                email: "john@example.com",
                password: "john123",
                role: "Customer"
            }
        ];

        for (const credential of testCredentials) {
            // Check if test user already exists
            const userExists = await TestUser.findOne({ email: credential.email });
            
            if (!userExists) {
                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(credential.password, salt);

                // Create test user in TestUser collection
                const user = await TestUser.create({
                    name: credential.name,
                    email: credential.email,
                    password: hashedPassword,
                    role: credential.role
                });

                console.log(`✓ Created test user: ${user.email}`);
            } else {
                console.log(`⚠ Test user already exists: ${credential.email}`);
            }
        }

        console.log("\n✓ Database seeding completed successfully!");
        console.log("\n📝 Test Credentials (SEPARATE from registered users):");
        console.log("==========================================");
        console.log("Email: test@example.com");
        console.log("Password: password123");
        console.log("\nEmail: admin@example.com");
        console.log("Password: admin123");
        console.log("\nEmail: john@example.com");
        console.log("Password: john123");
        console.log("==========================================");
        console.log("\n💾 These test users are stored in 'TestUser' collection");
        console.log("   Registered users from the app will be in 'RegisteredUser' collection\n");

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error.message);
        process.exit(1);
    }
};

seedDatabase();
