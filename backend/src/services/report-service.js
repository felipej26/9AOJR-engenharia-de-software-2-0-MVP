const reportRepository = require('../repositories/report-repository');

async function monthly(userId, month, year) {
  return reportRepository.getMonthlyReport(userId, month, year);
}

module.exports = {
  monthly,
};
