/**
 * Database reset script
 * Clears all collections and adds the test user
 * @requires mongoose
 * @requires dotenv
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/users.js';
import Cost from './models/costs.js';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = "mongodb+srv://katzirziv:CrCSJlK46P4jJl3g@cluster0.pgid0.mongodb.net/cost-manager";

// Test user data
const testUser = {
    id: "123123",
    first_name: "mosh",
    last_name: "israeli",
    birthday: new Date("1990-01-01"), // default birthday
    marital_status: "single"          // default status
};

/**
 * Reset database and add test user
 */
async function resetDatabase() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully');

        // Clear all collections
        console.log('Clearing collections...');
        await Cost.deleteMany({});
        await User.deleteMany({});
        console.log('All collections cleared');

        // Add test user
        console.log('Adding test user...');
        const user = new User(testUser);
        await user.save();
        console.log('Test user added successfully');

        // Verify user was added
        const verifyUser = await User.findOne({ id: testUser.id });
        console.log('Verification - Added user details:', verifyUser);

        console.log('Database reset completed successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}

// Run the reset script
resetDatabase();