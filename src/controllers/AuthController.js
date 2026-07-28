const authService = require('../services/AuthService');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
      if (error.message === 'User already exists') {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      const result = await authService.login(email, password);
      res.json(result);
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        res.status(401).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Server error' });
      }
    }
  }
}

module.exports = new AuthController();
