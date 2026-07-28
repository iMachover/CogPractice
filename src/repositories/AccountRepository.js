const Account = require('../models/Account');

class AccountRepository {
  async createAccount(accountData) {
    const account = new Account(accountData);
    return await account.save();
  }

  async findAccountById(accountId) {
    return await Account.findById(accountId).populate('user', 'name email');
  }

  async updateBalance(accountId, amount) {
    // amount can be positive or negative
    return await Account.findByIdAndUpdate(
      accountId,
      { $inc: { balance: amount } },
      { new: true }
    );
  }
}

module.exports = new AccountRepository();
