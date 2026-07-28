const accountRepository = require('../repositories/AccountRepository');
const transactionRepository = require('../repositories/TransactionRepository');
const userRepository = require('../repositories/UserRepository');

class AccountService {
  async createAccount(userId, accountType) {
    // Basic validation
    if (!userId || !accountType) {
      throw new Error('UserId and accountType are required');
    }
    
    // Check if user exists
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const accountData = {
      user: userId,
      accountType: accountType,
      balance: 0
    };

    return await accountRepository.createAccount(accountData);
  }

  async getAccount(accountId) {
    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return account;
  }

  async deposit(accountId, amount) {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }

    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Update balance
    const updatedAccount = await accountRepository.updateBalance(accountId, amount);

    // Record transaction
    await transactionRepository.createTransaction({
      account: accountId,
      type: 'DEPOSIT',
      amount: amount
    });

    return updatedAccount;
  }

  async withdraw(accountId, amount) {
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive');
    }

    const account = await accountRepository.findAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Check balance
    if (account.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Update balance (subtracting amount)
    const updatedAccount = await accountRepository.updateBalance(accountId, -amount);

    // Record transaction
    await transactionRepository.createTransaction({
      account: accountId,
      type: 'WITHDRAW',
      amount: amount
    });

    return updatedAccount;
  }

  async getTransactions(accountId) {
    // Verify account exists first
    await this.getAccount(accountId);
    return await transactionRepository.findTransactionsByAccountId(accountId);
  }
}

module.exports = new AccountService();
