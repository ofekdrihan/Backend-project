/**
 * @fileoverview Defines the User model schema and exports the Mongoose model.
 * @module models/users
 */
import mongoose from "mongoose";

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {string} first_name - User's first name
 * @property {string} last_name - User's last name
 * @property {Date} birthday - User's date of birth (stored as Date object)
 * @property {string} marital_status - User's marital status
 * @property {number} [total=0] - User's total spending (defaults to 0)
 */

/**
 * Mongoose schema definition for users.
 * @type {mongoose.Schema}
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
 * User model for interacting with the "users" collection.
 * @type {mongoose.Model<User>}
 */
const User = mongoose.model("users", UserSchema);

export default User;
