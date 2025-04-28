// expenses.js
const express = require('express');
const app = express();
app.use(express.json());

const expenses = new Map(); // Key: [giverId, receiverId], Value: [amounts]

function getKey(giver, receiver) {
  return `${giver}|${receiver}`;
}

function addToExpenses(giver, receiver, amount) {
  const key = getKey(giver, receiver);
  const existing = expenses.get(key) || [];
  expenses.set(key, [...existing, amount]);
}

// POST /add-expense
app.post('/add-expense', (req, res) => {
  const { userId, amount, sharedWith } = req.body; // sharedWith: array of userIds
  
  if (!userId || !amount || !Array.isArray(sharedWith)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const totalPeople = 1 + sharedWith.length;
  const amountPerPerson = amount / totalPeople;

  // Add expense for self
  addToExpenses(userId, userId, amountPerPerson);

  // Add expense for others
  for (const otherId of sharedWith) {
    addToExpenses(userId, otherId, amountPerPerson);
  }

  res.json({ message: 'Expense added successfully' });
});

// GET /expenses-total
app.get('/expenses-total', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  let total = 0;

  for (const [key, amounts] of expenses.entries()) {
    const [giver, receiver] = key.split('|');
    if (giver === userId) {
      total += amounts.reduce((sum, amt) => sum + amt, 0);
    }
  }

  res.json({ total });
});

// GET /debts
app.get('/debts', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const debts = [];

  for (const [key, amounts] of expenses.entries()) {
    const [giver, receiver] = key.split('|');
    if (receiver === userId && giver !== receiver) {
      const totalAmount = amounts.reduce((sum, amt) => sum + amt, 0);
      debts.push({ owedTo: giver, amount: totalAmount });
    }
  }

  res.json({ debts });
});

// GET /debtors
app.get('/debtors', (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const debtors = [];

  for (const [key, amounts] of expenses.entries()) {
    const [giver, receiver] = key.split('|');
    if (giver === userId && giver !== receiver) {
      const totalAmount = amounts.reduce((sum, amt) => sum + amt, 0);
      debtors.push({ debtor: receiver, amount: totalAmount });
    }
  }

  res.json({ debtors });
});

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Expenses app listening on port ${PORT}`);
});
