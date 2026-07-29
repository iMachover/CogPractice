const express = require('express');
const router = express.Router();
const userRepository = require('../repositories/UserRepository');
const roleMiddleware = require('../middleware/roleMiddleware');

// Helper route to create a user for testing
// POST /api/users
router.post('/', roleMiddleware, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userRepository.createUser({ name, email });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/users
router.get('/', roleMiddleware, async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/users/:id
router.delete('/:id', roleMiddleware, async (req, res) => {
  try {
    const userService = require('../services/UserService');
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
