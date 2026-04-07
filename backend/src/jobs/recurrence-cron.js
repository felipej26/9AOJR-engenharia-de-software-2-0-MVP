const cron = require('node-cron');
const prisma = require('../lib/prisma');
const { runRecurrenceJob } = require('../services/recurrence-job-service');

/** Chaves estáveis para pg_try_advisory_lock (evita colisão com outros usos no mesmo DB). */
const LOCK_KEY1 = 942001;
const LOCK_KEY2 = 1;

const DEFAULT_CRON_EXPRESSION = '5 0 * * *';

/**
 * Executa o job de recorrências com lock consultivo no Postgres.
 * Mantém uma transação aberta na conexão que adquiriu o lock até o fim do job,
 * evitando execução duplicada quando vários workers rodam o mesmo cron.
 */
async function runRecurrenceCronTick(userId) {
  await prisma.$transaction(async (tx) => {
    const lockRows = await tx.$queryRaw`
      SELECT pg_try_advisory_lock(${LOCK_KEY1}::int, ${LOCK_KEY2}::int) AS acquired
    `;
    const acquired = lockRows[0]?.acquired === true;
    if (!acquired) {
      console.log('[Cron] Job de recorrências ignorado: lock não adquirido (outra instância?)');
      return;
    }
    try {
      await runRecurrenceJob(userId);
      console.log('[Cron] Job de recorrências executado');
    } finally {
      await tx.$queryRaw`
        SELECT pg_advisory_unlock(${LOCK_KEY1}::int, ${LOCK_KEY2}::int)
      `;
    }
  });
}

function scheduleRecurrenceCron(cronExpression, userId) {
  const expr = cronExpression || DEFAULT_CRON_EXPRESSION;
  return cron.schedule(expr, async () => {
    try {
      await runRecurrenceCronTick(userId);
    } catch (err) {
      console.error('[Cron] Erro no job de recorrências:', err.message);
    }
  });
}

module.exports = {
  scheduleRecurrenceCron,
  runRecurrenceCronTick,
  DEFAULT_CRON_EXPRESSION,
  LOCK_KEY1,
  LOCK_KEY2,
};
