/**
 * Controller for handling user-related operations.
 * Includes functions for fetching user details, creating a user, and retrieving developer information.
 */

import User from '../models/users.js';
import Cost from '../models/costs.js';

/**
 * Fetches user details by ID.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends user details or an error response.
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
      res.status(200).json({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          total: user.total
      });
  } catch (err) {
      // Handle server error
      res.status(500).json({ error: err.message });
  }
};

/**
 * Creates a new user in the database.
 * @param {import('express').Request} req - Express request object containing user data in the body.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends created user data or an error response.
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
 * Retrieves the list of developers working on this project.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 * @returns {Promise<void>} Sends an array of developer objects.
 */
export const getDevelopers = async (req, res) => {
  try {
      // Define the development team
      const team = [
          { first_name: 'Ofek', last_name: 'Drihan' },
          { first_name: 'Ziv', last_name: 'Katzir' }
      ];

      // Send the team details
      res.status(200).json(team);
  } catch (error) {
      // Handle server error
      res.status(500).json({ message: error.message });
  }
};