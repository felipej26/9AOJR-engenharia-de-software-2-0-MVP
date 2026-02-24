const recurrenceRepository = require('../repositories/recurrence-repository');
const transactionRepository = require('../repositories/transaction-repository');

async function runRecurrenceJob(userId) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const due = await recurrenceRepository.findActiveDueUntil(userId, today);

  for (const rec of due) {
    const runDate = new Date(rec.nextRunAt);
    const year = runDate.getFullYear();
    const month = runDate.getMonth() + 1;
    const exists = await transactionRepository.existsByRecurrenceAndMonth(rec.id, year, month);
    if (exists) {
      const nextRun = new Date(year, month, rec.dayOfMonth);
      await recurrenceRepository.updateNextRun(rec.id, nextRun);
      continue;
    }
    await transactionRepository.create(userId, {
      categoryId: rec.categoryId,
      value: rec.value,
      date: runDate.toISOString().slice(0, 10),
      description: `Recorrência: ${rec.category?.name || ''}`,
      type: rec.type,
      recurrenceId: rec.id,
    });
    const nextRun = new Date(year, month, Math.min(rec.dayOfMonth, 28));
    await recurrenceRepository.updateNextRun(rec.id, nextRun);
  }
}

module.exports = { runRecurrenceJob };
