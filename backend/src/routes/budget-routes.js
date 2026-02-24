const express = require('express');
const { authMock } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { budgetCreateSchema } = require('../utils/validators');
const budgetController = require('../controllers/budget-controller');

const router = express.Router();
router.use(authMock);

router.post('/', validate(budgetCreateSchema), budgetController.postBudget);
router.get('/', budgetController.getBudgets);

module.exports = router;
