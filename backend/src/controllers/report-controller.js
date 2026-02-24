const reportService = require('../services/report-service');

async function getMonthlyReport(req, res, next) {
  try {
    const userId = req.user.id;
    const { month, year } = req.validated;
    const result = await reportService.monthly(userId, month, year);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getMonthlyReport,
};
