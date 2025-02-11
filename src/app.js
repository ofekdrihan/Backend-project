/**
 * @fileoverview Main application entry point that sets up Express server and database connection.
 * Configures server middleware, connects to MongoDB, and sets up API routes.
 * @module app
 * @requires express
 * @requires mongoose
 * @requires ./routes/costRoutes
 * @requires ./routes/userRoutes
 */

import express from 'express';
import mongoose from 'mongoose';
// Import route modules for cost and user management
import costRoutes from './routes/costRoutes.js';
import userRoutes from './routes/userRoutes.js';

// MongoDB Atlas connection string with credentials
const URL = "mongodb+srv://katzirziv:CrCSJlK46P4jJl3g@cluster0.pgid0.mongodb.net/cost-manager";

// Create Express application instance
const app = express();

// Define server port - uses environment variable if available, otherwise defaults to 3000
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
app.use('/api', costRoutes);    // cost management routes
app.use('/api', userRoutes);    // user management routes

/**
 * Start Express server
 * @listens {number} PORT - Server port number
 * @callback - Logs server status to console
 */
app.listen(PORT, () => console.log(`Running on port ${PORT}`));