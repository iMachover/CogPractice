const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const customers = {
  rohit: {
    username: 'rohit',
    password: 'rohit123',
    checkingBalance: 100,
    savingsBalance: 500,
    transactions: ['Deposited $100', 'Withdrew $50']
  },
  mohit: {
    username: 'mohit',
    password: 'mohit123',
    checkingBalance: 200,
    savingsBalance: 1000,
    transactions: ['Deposited $200', 'Transferred $50']
  },
  shobhit: {
    username: 'shobhit',
    password: 'shobhit123',
    checkingBalance: 50,
    savingsBalance: 300,
    transactions: ['Deposited $50']
  }
};

app.get('/api/v1/customers', (req, res) => {
  res.json(customers);
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'bank-api' });
});

app.get('/api/v1/customers/:username', (req, res) => {
  const username = req.params.username.toLowerCase();
  const customer = customers[username];

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  res.json({
    username: customer.username,
    checkingBalance: customer.checkingBalance,
    savingsBalance: customer.savingsBalance,
    transactions: customer.transactions
  });
});

app.listen(port, () => {
  console.log(`Bank API running at http://localhost:${port}`);
});
