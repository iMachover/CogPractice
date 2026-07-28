const Transaction = require('../models/Transaction');

class TransactionRepository {
  async createTransaction(transactionData) {
    const transaction = new Transaction(transactionData);
    return await transaction.save();
  }

  async findTransactionsByAccountId(accountId) {
    return await Transaction.find({ account: accountId }).sort({ createdAt: -1 });
  }
}

module.exports = new TransactionRepository();
