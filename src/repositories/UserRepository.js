const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }
}

module.exports = new UserRepository();
