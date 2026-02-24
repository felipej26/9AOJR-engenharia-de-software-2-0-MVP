const express = require('express');
const { authMock } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const { reportMonthlySchema } = require('../utils/validators');
const reportController = require('../controllers/report-controller');

const router = express.Router();
router.use(authMock);

router.get('/monthly', validate(reportMonthlySchema, 'query'), reportController.getMonthlyReport);

module.exports = router;
