// models/Cost.js
/**
 * Cost model schema
 * Defines structure for cost documents in MongoDB
 */

import mongoose from "mongoose";

const CostSchema = new mongoose.Schema({
    description: {type: String, required: true},
    category: {
        type: String, 
        enum: ['food','health','housing','sport','education'],
        required: true
    },
    sum: {type: Number, required: true},
    userid: { type: String, required: true },
    created_at: {type: Date, default: Date.now},  
});

const Cost = mongoose.model("costs",CostSchema);
export default Cost;