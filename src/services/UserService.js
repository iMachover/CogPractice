const userRepository = require('../repositories/UserRepository');
const accountRepository = require('../repositories/AccountRepository');
const accountService = require('./AccountService');

class UserService {
  async deleteUser(userId) {
    // 1. Verify user exists
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 2. Fetch all accounts for this user
    const userAccounts = await accountRepository.findAccountsByUserId(userId);

    // 3. Delete each account (which cascades and deletes its transactions)
    for (const account of userAccounts) {
      await accountService.deleteAccount(account._id);
    }

    // 4. Finally, delete the user itself
    await userRepository.deleteUserById(userId);
  }
}

module.exports = new UserService();
