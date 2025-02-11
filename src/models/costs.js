/**
 * @fileoverview Defines the Cost model schema and exports the Mongoose model.
 * @module models/costs
 */
import mongoose from "mongoose";

/**
 * @typedef {Object} Cost
 * @property {string} description - A short description of the cost
 * @property {('food'|'health'|'housing'|'sport'|'education')} category - The category of the cost
 * @property {number} sum - The total amount of the cost
 * @property {string} userid - The ID of the user associated with the cost
 * @property {Date} [created_at] - The date when the cost was created
 */

/**
 * Mongoose schema definition for costs.
 * @type {mongoose.Schema}
 */
const CostSchema = new mongoose.Schema({
    // Description of the expense
    description: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends
    },
    // Category of the expense
    category: { 
        type: String, 
        enum: ['food', 'health', 'housing', 'sport', 'education'],
        required: true,
        lowercase: true //consistency in category storage
    },
    sum: { type: Number, required: true },// Amount of the expense (required, must be positive)
    userid: { type: String, required: true }, // Reference to the user who created the cost
    created_at: { type: Date, default: Date.now }, // Timestamp of cost creation, default is current date
});

/**
 * Creates a Mongoose model for the "costs" collection.
 * @type {mongoose.Model<Cost>}
 */
const Cost = mongoose.model("costs", CostSchema);

export default Cost;
