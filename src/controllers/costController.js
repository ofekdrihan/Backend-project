/**
 * Controller for handling cost-related operations.
 * Includes functions for adding costs and generating monthly reports.
 */

import Cost from '../models/costs.js';
import User from '../models/users.js';

/**
 * Adds a new cost entry for a user.
 * @param {import('express').Request} req - Express request object containing cost details in the body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends the saved cost data or an error response.
 */
export const addCost = async (req, res) => {
    try {
        // Extracting cost details from the request body
        const { description, category, sum, userid } = req.body;
        const created_at = req.body.created_at || new Date(); // Use provided date or current date

        // Define allowed categories for validation
        const allowedCategories = ['food', 'health', 'housing', 'sport', 'education'];

        // Check if category is valid
        if (!allowedCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }

        // Validate that all required fields are present
        if (!description || !category || !sum || !userid) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new cost entry object
        const newCost = new Cost({
            description,
            category,
            sum,
            userid,
            created_at
        });

        // Save the cost entry to the database
        const savedCost = await newCost.save();

        // Update the user's total spending in the database
        await User.findOneAndUpdate(
            { id: userid },  // Find the user by ID
            { $inc: { total: sum } }, // Increment the total spending by the cost amount
            { new: true } // Return the updated document
        );

        // Send the response with the newly created cost entry
        res.status(201).json(savedCost);
    } catch (err) {
        // Handle any unexpected errors
        res.status(500).json({ error: err.message });
    }
};

/**
 * Generates a monthly report of costs for a user.
 * @param {import('express').Request} req - Express request object containing user ID, year, and month as query parameters.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends a structured report of costs grouped by category or an error response.
 */
export const getReport = async (req, res) => {
    try {
        // Extract query parameters from the request
        const { id, year, month } = req.query;

        // Validate required parameters (id, year, month must be provided)
        if (!id || !year || !month) {
            return res.status(400).json({
                error: 'Missing required parameters. Please provide id, year, and month.'
            });
        }

        // Convert parameters to the appropriate data types
        const userId = id;
        const yearNum = parseInt(year);
        const monthNum = parseInt(month);

        // Validate that year and month are numbers and within valid ranges
        if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            return res.status(400).json({
                error: 'Invalid year or month format'
            });
        }

        // Define the start and end dates for the requested month
        const startDate = new Date(yearNum, monthNum - 1, 1); // First day of the month
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999); // Last day of the month

        // Query the database for all costs related to the user within the given month
        const costs = await Cost.find({
            userid: userId,
            created_at: { $gte: startDate, $lte: endDate } // Filter by date range
        });

        // Initialize an object to categorize costs
        const categories = {
            food: [],
            health: [],
            housing: [],
            sport: [],
            education: []
        };

        // Iterate through all retrieved costs and group them by category
        costs.forEach(cost => {
            if (categories.hasOwnProperty(cost.category)) {
                categories[cost.category].push({
                    sum: cost.sum, // The amount spent
                    description: cost.description, // Description of the expense
                    day: new Date(cost.created_at).getDate() // Extract the day of the expense
                });
            }
        });

        // Format the response object with structured data
        const response = {
            userid: userId,
            year: yearNum,
            month: monthNum,
            costs: Object.keys(categories).map(category => ({
                [category]: categories[category]
            }))
        };

        // Send the response with the formatted report
        res.json(response);

    } catch (error) {
        // Log the error and send a response indicating an internal server error
        console.error('Error generating monthly report:', error);
        res.status(500).json({
            error: 'Internal server error while generating monthly report',
            details: error.message
        });
    }
};
