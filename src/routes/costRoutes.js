/**
 * Express router for handling cost-related operations
 * @module costRouter
 */
import express from 'express';
// Import controller functions for cost operations
import { addCost, getReport } from '../controllers/costController.js';

// Initialize Express router
const router = express.Router();

/**
 * POST /add - Add a new cost entry
 * @route POST /add
 * @uses addCost - Controller function to handle cost addition
 */
router.post('/add', addCost);

/**
 * GET /report - Retrieve cost report
 * @route GET /report
 * @uses getReport - Controller function to generate cost report
 */
router.get('/report', getReport);

// Export router for use in main application
export default router;