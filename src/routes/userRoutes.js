const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const userRepository = require("../repositories/UserRepository");
const roleMiddleware = require("../middleware/roleMiddleware");

router.use(authMiddleware);

// Helper route to create a user for testing (Admin only)
router.post("/", roleMiddleware, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const authService = require('../services/AuthService');
    const user = await authService.register({ name, email, password });
    
    // Remove the password hash from the response
    const userResponse = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/users
router.get("/", roleMiddleware, async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Internal Server Error in GET /api/users:", error);
    res.status(500).json({
      message: "An unexpected system error occurred. Please try again later.",
    });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(
      `Internal Server Error in GET /api/users/${req.params.id}:`,
      error,
    );
    res.status(500).json({
      message: "An unexpected system error occurred. Please try again later.",
    });
  }
});

// DELETE /api/users/:id
router.delete('/:id', roleMiddleware, async (req, res) => {
  try {
    const userService = require('../services/UserService');
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET /api/users/:id/transactions (Admin only - get all transactions for a specific user)
router.get('/:id/transactions', roleMiddleware, async (req, res) => {
  try {
    const accountService = require('../services/AccountService');
    const transactionRepository = require('../repositories/TransactionRepository');

    const userAccounts = await accountService.getAccountsByUserId(req.params.id);
    const allTransactions = [];

    for (const account of userAccounts) {
      const txs = await transactionRepository.findTransactionsByAccountId(account._id);
      txs.forEach(tx => allTransactions.push({
        accountId: account._id,
        accountType: account.accountType,
        type: tx.type,
        amount: tx.amount,
        date: tx.createdAt,
      }));
    }

    // Sort all transactions newest first
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(allTransactions);
  } catch (error) {
    console.error(`Internal Server Error in GET /api/users/${req.params.id}/transactions:`, error);
    res.status(500).json({ message: 'An unexpected system error occurred. Please try again later.' });
  }
});

module.exports = router;
