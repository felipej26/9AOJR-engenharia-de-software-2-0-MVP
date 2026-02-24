const express = require('express');
const transactionRoutes = require('./transaction-routes');
const categoryRoutes = require('./category-routes');
const budgetRoutes = require('./budget-routes');
const reportRoutes = require('./report-routes');

const router = express.Router();

router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/budgets', budgetRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
