/**
 * @fileoverview Express router configuration for user-related endpoints.
 * @module routes/userRoutes
 * @requires express
 * @requires ../controllers/userController
 */
import express from 'express';
import { getUserDetails, getDevelopers, createUser } from '../controllers/userController.js';

// Initialize Express router
const router = express.Router();

/**
 * GET /api/about
 * @description Endpoint to retrieve developers information
 * @returns {Array} JSON array containing developers' first and last names
 */
router.get('/about', getDevelopers);

/**
 * GET /api/users/:id
 * @description Endpoint to retrieve specific user information
 * @param {string} id - User ID as URL parameter
 * @returns {Object} JSON containing user details (id, first_name, last_name, total)
 */
router.get('/users/:id', getUserDetails);

/**
 * POST /api/adduser
 * @description Endpoint to create a new user
 * @param {string} id - Unique identifier for the user
 * @param {string} first_name - User's first name
 * @param {string} last_name - User's last name
 * @param {string} birthday - User's date of birth (YYYY-MM-DD format)
 * @param {string} marital_status - User's marital status
 * @returns {Object} JSON containing the created user data or error message
 */
router.post('/adduser', createUser);

// Export router for use in main application
export default router;