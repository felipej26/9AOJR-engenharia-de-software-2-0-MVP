const { mockUserId } = require('./config/env');
const { registerShutdownHooks } = require('./lib/prisma');
const {
  scheduleRecurrenceCron,
  DEFAULT_CRON_EXPRESSION,
} = require('./jobs/recurrence-cron');

registerShutdownHooks();

const cronExpression = process.env.RECURRENCE_CRON || DEFAULT_CRON_EXPRESSION;

scheduleRecurrenceCron(cronExpression, mockUserId);

console.log(
  `[Worker] Cron de recorrências agendado (${cronExpression}), MOCK_USER_ID=${mockUserId}`,
);
