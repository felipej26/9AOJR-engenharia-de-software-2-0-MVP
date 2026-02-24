const express = require('express');
const { authMock } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { transactionCreateSchema } = require('../utils/validators');
const transactionController = require('../controllers/transaction-controller');

const router = express.Router();
router.use(authMock);

router.post('/', validate(transactionCreateSchema), transactionController.postTransaction);
router.get('/', transactionController.getTransactions);

module.exports = router;
