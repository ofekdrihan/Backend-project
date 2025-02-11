/**
 * @fileoverview Express router configuration for cost-related endpoints.
 * @module routes/costRoutes
 * @requires express
 * @requires ../controllers/costController
 */
import express from 'express';
import { addCost, getReport } from '../controllers/costController.js';

// Initialize Express router
const router = express.Router();

/**
 * POST /api/add
 * @description Endpoint to add a new cost entry
 * @param {string} description - Description of the cost
 * @param {string} category - Category of the cost (food, health, housing, sport, education)
 * @param {number} sum - Amount of the cost
 * @param {string} userid - ID of the user adding the cost
 * @param {Date} [created_at] - Optional creation date
 * @returns {Object} JSON containing the saved cost data or error message
 */
router.post('/add', addCost);

/**
 * GET /api/report
 * @description Endpoint to retrieve cost report for a specific user and time period
 * @param {string} id - User ID in query parameters
 * @param {number} year - Year for the report in query parameters
 * @param {number} month - Month for the report in query parameters (1-12)
 * @returns {Object} JSON containing the monthly report or error message
 */
router.get('/report', getReport);

// Export router for use in main application
export default router;