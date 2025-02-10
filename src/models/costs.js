import mongoose from "mongoose";

/**
 * @typedef {Object} Cost
 * @property {string} description - A short description of the cost (required).
 * @property {string} category - The category of the cost, must be one of: 'food', 'health', 'housing', 'sport', 'education' (required).
 * @property {number} sum - The total amount of the cost (required).
 * @property {string} userid - The ID of the user associated with the cost (required).
 * @property {Date} [created_at] - The date when the cost was created (default: current date).
 */

/* 
 * Defines the schema for the "costs" collection in MongoDB.
 */
const CostSchema = new mongoose.Schema({
    description: { type: String, required: true }, // A short description of the expense
    category: { 
        type: String, 
        enum: ['food', 'health', 'housing', 'sport', 'education'], // Allowed categories
        required: true 
    },
    sum: { type: Number, required: true }, // The total cost amount
    userid: { type: String, required: true }, // User ID associated with the cost
    created_at: { type: Date, default: Date.now }, // Timestamp of cost creation, default is current date
});

/**
 * Creates a Mongoose model for the "costs" collection.
 * @type {mongoose.Model<Cost>}
 */
const Cost = mongoose.model("costs", CostSchema);

export default Cost;
