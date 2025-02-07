// models/User.js
/**
 * User model schema
 * Defines structure for user documents in MongoDB
 */

import mongoose from "mongoose";
 
const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    birthday: {type: Date, required: true},
    marital_status: {type: String, required: true},
    total: { type: Number, default: 0 },
});

const User = mongoose.model("users",UserSchema);

export default User;