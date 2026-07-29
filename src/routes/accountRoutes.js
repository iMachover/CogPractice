const express = require('express');
const router = express.Router();
const accountController = require('../controllers/AccountController');

// POST /api/accounts
router.post('/', accountController.createAccount);

// GET /api/accounts (get user accounts)
router.get('/', accountController.getAccountsForUser);

// GET /api/accounts/{id}
router.get('/:id', accountController.getAccount);

// POST /api/accounts/{id}/deposit
router.post('/:id/deposit', accountController.deposit);

// POST /api/accounts/{id}/withdraw
router.post('/:id/withdraw', accountController.withdraw);

// GET /api/accounts/{id}/transactions
router.get('/:id/transactions', accountController.getTransactions);

// DELETE /api/accounts/{id}
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
