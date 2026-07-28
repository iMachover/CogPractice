const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');

// Helper route to create a user for testing
// POST /api/users
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userRepository.createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
