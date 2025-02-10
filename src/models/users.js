import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} id - Unique user identifier (required).
 * @property {string} first_name - User's first name (required).
 * @property {string} last_name - User's last name (required).
 * @property {Date} birthday - User's date of birth (required).
 * @property {string} marital_status - User's marital status (required).
 * @property {number} [total=0] - User's total balance (default: 0).
 */

/* 
 * Defines the schema for the "users" collection in MongoDB. 
 */
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Unique identifier for each user
    first_name: { type: String, required: true }, // User's first name
    last_name: { type: String, required: true }, // User's last name
    birthday: { type: Date, required: true }, // Date of birth in ISO format (YYYY-MM-DD)
    marital_status: { type: String, required: true }, // Marital status (e.g., Single, Married, Divorced)
    total: { type: Number, default: 0 }, // User's total balance, default value is 0
});

/**
 * Creates a Mongoose model for the "users" collection.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model("users", UserSchema);

export default User;
