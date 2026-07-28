const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthService {
  async register(userData) {
    const { name, email, password } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await userRepository.createUser({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }

  async login(email, password) {
    // Find user
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const payload = {
      user: {
        id: user._id,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1h' }
    );

    return { token, user: { id: user._id, name: user.name, email: user.email } };
  }
}

module.exports = new AuthService();
