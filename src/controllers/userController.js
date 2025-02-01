// controllers/userController.js
/**
 * Controller for handling user-related operations
 * Includes functions for fetching user details and total spending
 */
import User from '../models/users.js';
import Cost from '../models/costs.js';

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const totalCosts = await Cost.aggregate([{ $match: { userid: user.id } }, { $group: { _id: null, total: { $sum: '$sum' } } }]);
    res.status(200).json({ id: user.id, first_name: user.first_name, last_name: user.last_name, total: totalCosts[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDevelopers = async (req, res) => {
  try {
      const team = [
          { first_name: 'Ofek', last_name: 'Drihan' },
          { first_name: 'Ziv', last_name: 'Katzir' }
      ];
      res.status(200).json(team);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const createUser =  async (req, res) => {
  const { id, first_name, last_name, birthday, marital_status } = req.body;

  // Validate request body
  if (!id || !first_name || !last_name || !birthday || !marital_status) {
      return res.status(400).json({ message: 'Missing details!' });
  }

  const newUser = new User({id, first_name, last_name, birthday, marital_status});

  try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
  }catch (error) {
      res.status(400).json({ message: error.message });
     }
};