const accountService = require('../services/AccountService');

class AccountController {
  async createAccount(req, res) {
    try {
      const { userId, accountType } = req.body;
      const account = await accountService.createAccount(userId, accountType);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAccount(req, res) {
    try {
      const { id } = req.params;
      const account = await accountService.getAccount(id);
      
      // Formatting the response to match the PDF example
      res.json({
        accountId: account._id,
        userName: account.user.name,
        balance: account.balance
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deposit(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const account = await accountService.deposit(id, amount);
      res.json({ message: 'Deposit successful', balance: account.balance });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async withdraw(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const account = await accountService.withdraw(id, amount);
      res.json({ message: 'Withdrawal successful', balance: account.balance });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getTransactions(req, res) {
    try {
      const { id } = req.params;
      const transactions = await accountService.getTransactions(id);
      
      // Formatting the response to match the PDF example
      const formattedTransactions = transactions.map(tx => ({
        type: tx.type,
        amount: tx.amount,
        date: tx.createdAt.toISOString().split('T')[0] // Simple YYYY-MM-DD
      }));
      
      res.json(formattedTransactions);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async deleteAccount(req, res) {
    try {
      const { id } = req.params;
      await accountService.deleteAccount(id);
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAccountsForUser(req, res) {
    try {
      let accounts;
      if (req.user.role === 'admin') {
        accounts = await accountService.getAllAccounts();
      } else {
        accounts = await accountService.getAccountsByUserId(req.user.id);
      }
      res.json(accounts);
    } catch (error) {
      console.error("Internal Server Error in getAccountsForUser:", error);
      res.status(500).json({ message: 'An unexpected system error occurred. Please try again later.' });
    }
  }
}

module.exports = new AccountController();
