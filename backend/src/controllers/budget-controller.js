const budgetService = require('../services/budget-service');

async function postBudget(req, res, next) {
  try {
    const userId = req.user.id;
    const data = req.validated;
    const result = await budgetService.create(userId, data);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function getBudgets(req, res, next) {
  try {
    const userId = req.user.id;
    const filters = {};
    if (req.query.month) filters.month = parseInt(req.query.month, 10);
    if (req.query.year) filters.year = parseInt(req.query.year, 10);
    const result = await budgetService.list(userId, filters);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postBudget,
  getBudgets,
};
