const cron = require('node-cron');
const app = require('./app');
const { port, mockUserId } = require('./config/env');
const { runRecurrenceJob } = require('./services/recurrence-job-service');

const server = app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Mock user ID: ${mockUserId}`);
});

// Job diário às 00:05 para processar recorrências
cron.schedule('5 0 * * *', async () => {
  try {
    await runRecurrenceJob(mockUserId);
    console.log('[Cron] Job de recorrências executado');
  } catch (err) {
    console.error('[Cron] Erro no job de recorrências:', err.message);
  }
});

module.exports = server;
