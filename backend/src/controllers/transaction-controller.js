const transactionService = require('../services/transaction-service');

async function postTransaction(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.validated;
    const result = await transactionService.create(userId, data);
    res.status(201).json({ data: result.transaction, budgetExceeded: result.budgetExceeded });
  } catch (err) {
    next(err);
  }
}

async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const filters = {};
    if (req.query.month) filters.month = parseInt(req.query.month, 10);
    if (req.query.year) filters.year = parseInt(req.query.year, 10);
    if (req.query.categoryId) filters.categoryId = req.query.categoryId;
    if (req.query.type) filters.type = req.query.type;
    const result = await transactionService.list(userId, filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postTransaction,
  getTransactions,
};
