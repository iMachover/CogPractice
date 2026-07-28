const Transaction = require('../models/Transaction');

class TransactionRepository {
  async createTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async findTransactionsByAccountId(accountId) {
    return await Transaction.find({ account: accountId }).sort({ createdAt: -1 });
  }

  async deleteTransactionsByAccountId(accountId) {
    return await Transaction.deleteMany({ account: accountId });
  }
}

module.exports = new TransactionRepository();
