jest.mock('node-cron', () => ({
  schedule: jest.fn(),
}));

jest.mock('../src/lib/prisma', () => ({
  $transaction: jest.fn(),
}));

jest.mock('../src/services/recurrence-job-service', () => ({
  runRecurrenceJob: jest.fn(),
}));

const cron = require('node-cron');
const prisma = require('../src/lib/prisma');
const { runRecurrenceJob } = require('../src/services/recurrence-job-service');
const {
  scheduleRecurrenceCron,
  runRecurrenceCronTick,
  DEFAULT_CRON_EXPRESSION,
} = require('../src/jobs/recurrence-cron');

describe('recurrence-cron', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('runRecurrenceCronTick', () => {
    it('executa runRecurrenceJob quando o lock é adquirido', async () => {
      const $queryRaw = jest
        .fn()
        .mockResolvedValueOnce([{ acquired: true }])
        .mockResolvedValueOnce([]);

      prisma.$transaction.mockImplementation(async (fn) =>
        fn({ $queryRaw }),
      );
      runRecurrenceJob.mockResolvedValue(undefined);

      await runRecurrenceCronTick('user-1');

      expect(runRecurrenceJob).toHaveBeenCalledTimes(1);
      expect(runRecurrenceJob).toHaveBeenCalledWith('user-1');
      expect($queryRaw).toHaveBeenCalledTimes(2);
    });

    it('não chama runRecurrenceJob quando o lock não é adquirido', async () => {
      const $queryRaw = jest.fn().mockResolvedValueOnce([{ acquired: false }]);

      prisma.$transaction.mockImplementation(async (fn) =>
        fn({ $queryRaw }),
      );

      await runRecurrenceCronTick('user-1');

      expect(runRecurrenceJob).not.toHaveBeenCalled();
      expect($queryRaw).toHaveBeenCalledTimes(1);
    });
  });

  describe('scheduleRecurrenceCron', () => {
    it('registra o cron com a expressão informada e o tick chama runRecurrenceJob via lock', async () => {
      prisma.$transaction.mockImplementation(async (fn) => {
        const $queryRaw = jest
          .fn()
          .mockResolvedValueOnce([{ acquired: true }])
          .mockResolvedValueOnce([]);
        return fn({ $queryRaw });
      });
      runRecurrenceJob.mockResolvedValue(undefined);

      const expr = '*/5 * * * *';
      scheduleRecurrenceCron(expr, 'mock-user');

      expect(cron.schedule).toHaveBeenCalledTimes(1);
      expect(cron.schedule).toHaveBeenCalledWith(expr, expect.any(Function));

      const scheduledCallback = cron.schedule.mock.calls[0][1];
      await scheduledCallback();

      expect(runRecurrenceJob).toHaveBeenCalledWith('mock-user');
    });

    it('usa expressão padrão quando cronExpression é omitida', () => {
      scheduleRecurrenceCron(null, 'u');

      expect(cron.schedule).toHaveBeenCalledWith(
        DEFAULT_CRON_EXPRESSION,
        expect.any(Function),
      );
    });
  });
});
