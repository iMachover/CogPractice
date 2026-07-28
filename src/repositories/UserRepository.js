const User = require('../models/User');

class UserRepository {
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async findUserById(userId) {
    return await User.findById(userId);
  }

  async findAllUsers() {
    return await User.find();
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async deleteUserById(userId) {
    return await User.findByIdAndDelete(userId);
  }
}

module.exports = new UserRepository();
