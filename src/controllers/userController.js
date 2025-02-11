/**
 * Controller for handling user-related operations.
 * @module userController
 * @description Manages user operations including fetching user details, creating users,
 * and retrieving developer information.
 */

import User from '../models/users.js';

/**
 * Retrieves user details by their ID.
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - User ID to fetch
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<import('express').Response>} Promise resolving to Express response
 * containing user details or error message
 */
export const getUserDetails = async (req, res) => {
  try {
      // Find the user by ID
      const user = await User.findOne({ id: req.params.id });

      // If user is not found, return 404
      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Return user details
      return res.status(200).json({
          id: user.get('id'),
          first_name: user.get('first_name'),
          last_name: user.get('last_name'),
          total: user.get('total')
      });
  } catch (err) {
      // Handle server error
      res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new user in the system.
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.id - Unique identifier for the user
 * @param {string} req.body.first_name - User's first name
 * @param {string} req.body.last_name - User's last name
 * @param {string} req.body.birthday - User's date of birth (YYYY-MM-DD format)
 * @param {string} req.body.marital_status - User's marital status
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<import('express').Response>} Promise resolving to Express response
 * containing created user data or error message
 */
export const createUser = async (req, res) => {
  // Extract user details from request body
  const { id, first_name, last_name, birthday, marital_status } = req.body;

  // Check if all required fields are provided
  if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ error: 'Missing details!' });
  }

  // Create a new user instance
  const newUser = new User({
      id,
      first_name,
      last_name,
      birthday,
      marital_status,
      // total will default to 0 as defined in the schema
  });

  try {
      // Save the user to the database
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  } catch (error) {
      // Handle validation or other errors
      res.status(400).json({ error: error.message });
  }
};

/**
 * Retrieves information about the development team.
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<import('express').Response>} Promise resolving to Express response
 * containing array of developer information
 */
export const getDevelopers = async (req, res) => {
  try {
      // Define the development team
      const team = [
          { first_name: 'Ofek', last_name: 'Drihan' },
          { first_name: 'Ziv', last_name: 'Katzir' }
      ];

      // Return team information
      res.status(200).json(team);
  } catch (error) {
      // Handle server error
      res.status(500).json({ message: error.message });
  }
};