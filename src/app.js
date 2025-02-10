/**
 * Express server configuration
 * @module serverConfig
 * @description Initializes Express server, connects to MongoDB, sets up middleware and routes
 * @requires express
 * @requires mongoose
 */

import express from 'express';
import mongoose from 'mongoose';
// Import route modules for cost and user management
import costRoutes from './routes/costRoutes.js';
import userRoutes from './routes/userRoutes.js';

// MongoDB Atlas connection string with credentials
// Note: Consider moving credentials to environment variables for security
const URL = "mongodb+srv://katzirziv:CrCSJlK46P4jJl3g@cluster0.pgid0.mongodb.net/cost-manager";

// Create Express application instance
const app = express();

// Define server port - uses environment variable if available, otherwise defaults to 3000
// This allows for flexible deployment environments
const PORT = process.env.PORT || 3000;

// Configure middleware
// Parse incoming requests with JSON payloads
app.use(express.json());

/**
 * MongoDB connection setup using Mongoose
 * Establishes connection to MongoDB Atlas cluster
 * Logs success or error messages to console
 * @throws {Error} If database connection fails
 */
mongoose.connect(URL)
    .then(() => console.log("Connected to Database"))
    .catch((error)=> console.log(`Error: ${error}`));

// Configure API routes
// All routes are prefixed with /api for RESTful convention
app.use('/api', costRoutes);    // Mount cost management routes
app.use('/api', userRoutes);    // Mount user management routes

/**
 * Start Express server
 * @listens {number} PORT - Server port number
 * @callback - Logs server status to console
 */
app.listen(PORT, () => console.log(`Running on port ${PORT}`));

// Export app instance for testing or external use
export default app;