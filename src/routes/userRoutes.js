/**
 * Express router for user management operations
 * @module userRouter
 */
import express from 'express';
// Import user controller functions
import { getUserDetails, getDevelopers, createUser } from '../controllers/userController.js';

// Initialize Express router
const router = express.Router();

/**
 * GET /about - Retrieve developers information
 * @route GET /about
 * @uses getDevelopers - Controller for developers data
 */
router.get('/about', getDevelopers);

/**
 * GET /users/:id - Get specific user information
 * @route GET /users/:id
 * @param {string} id - User ID
 * @uses getUserDetails - Controller for user details
 */
router.get('/users/:id', getUserDetails);

/**
 * POST /adduser - Create new user
 * @route POST /adduser
 * @uses createUser - Controller for user creation
 */
router.post('/adduser', createUser);

// Export router for use in main application
export default router;