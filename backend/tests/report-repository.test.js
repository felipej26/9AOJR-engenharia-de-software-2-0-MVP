jest.mock('../src/lib/prisma', () => {
  const { createPrismaMock } = require('./helpers/create-prisma-mock');
  return createPrismaMock();
});

const prisma = require('../src/lib/prisma');
const reportRepository = require('../src/repositories/report-repository');

const { buildMonthlyReportPayload, findMonthlyReportData, getMonthlyReport, monthRange } =
  reportRepository;

describe('report-repository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('buildMonthlyReportPayload', () => {
    it('calcula receita, despesa, saldo e byCategory como antes', () => {
      const transactions = [
        {
          categoryId: 'c1',
          category: { name: 'Salário' },
          type: 'receita',
          value: 1000,
        },
        {
          categoryId: 'c2',
          category: { name: 'Food' },
          type: 'despesa',
          value: 100.5,
        },
        {
          categoryId: 'c2',
          category: { name: 'Food' },
          type: 'despesa',
          value: 50.25,
        },
      ];
      const budgets = [];

      const result = buildMonthlyReportPayload(transactions, budgets, 6, 2024);

      expect(result.data.totalReceita).toBe(1000);
      expect(result.data.totalDespesa).toBe(150.75);
      expect(result.data.saldo).toBe(849.25);
      expect(result.data.byCategory).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            categoryId: 'c1',
            categoryName: 'Salário',
            type: 'receita',
            total: 1000,
          }),
          expect.objectContaining({
            categoryId: 'c2',
            categoryName: 'Food',
            type: 'despesa',
            total: 150.75,
          }),
        ])
      );
      expect(result.data.byCategory).toHaveLength(2);
    });

    it('monta budgetStatus só com despesas da categoria no conjunto de transações', () => {
      const transactions = [
        {
          categoryId: 'b1',
          category: { name: 'X' },
          type: 'despesa',
          value: 30,
        },
        {
          categoryId: 'b1',
          category: { name: 'X' },
          type: 'despesa',
          value: 20,
        },
        {
          categoryId: 'b1',
          category: { name: 'X' },
          type: 'receita',
          value: 999,
        },
      ];
      const budgets = [
        {
          categoryId: 'b1',
          category: { name: 'Cat B' },
          amount: 40,
        },
      ];

      const result = buildMonthlyReportPayload(transactions, budgets, 1, 2025);

      expect(result.data.budgetStatus).toEqual([
        {
          categoryId: 'b1',
          categoryName: 'Cat B',
          budgetAmount: 40,
          spent: 50,
          exceeded: true,
        },
      ]);
    });

    it('gasto zero quando não há despesa na categoria do orçamento', () => {
      const transactions = [
        {
          categoryId: 'other',
          category: { name: 'O' },
          type: 'despesa',
          value: 10,
        },
      ];
      const budgets = [
        {
          categoryId: 'empty',
          category: { name: 'Vazio' },
          amount: 100,
        },
      ];

      const result = buildMonthlyReportPayload(transactions, budgets, 3, 2025);

      expect(result.data.budgetStatus[0].spent).toBe(0);
      expect(result.data.budgetStatus[0].exceeded).toBe(false);
    });
  });

  describe('findMonthlyReportData / getMonthlyReport', () => {
    it('executa apenas findMany em transaction e budget (sem aggregate)', async () => {
      prisma.transaction.findMany.mockResolvedValue([]);
      prisma.budget.findMany.mockResolvedValue([]);

      await getMonthlyReport('user-1', 4, 2026);

      expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.budget.findMany).toHaveBeenCalledTimes(1);
      expect(prisma.transaction.aggregate).not.toHaveBeenCalled();
    });

    it('não dispara múltiplos aggregates mesmo com vários orçamentos', async () => {
      prisma.transaction.findMany.mockResolvedValue([
        {
          categoryId: 'c1',
          category: { name: 'A' },
          type: 'despesa',
          value: 5,
        },
      ]);
      prisma.budget.findMany.mockResolvedValue([
        { categoryId: 'c1', category: { name: 'A' }, amount: 100 },
        { categoryId: 'c2', category: { name: 'B' }, amount: 200 },
        { categoryId: 'c3', category: { name: 'C' }, amount: 300 },
      ]);

      await getMonthlyReport('user-1', 2, 2025);

      expect(prisma.transaction.aggregate).not.toHaveBeenCalled();
      expect(prisma.transaction.findMany).toHaveBeenCalledTimes(1);
    });

    it('passa intervalo de datas e filtros corretos para transações', async () => {
      prisma.transaction.findMany.mockResolvedValue([]);
      prisma.budget.findMany.mockResolvedValue([]);

      await findMonthlyReportData('u-9', 6, 2024);

      const { start, end } = monthRange(6, 2024);
      expect(prisma.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'u-9',
            date: { gte: start, lte: end },
            deletedAt: null,
          }),
          include: { category: true },
          orderBy: { date: 'desc' },
        })
      );
      expect(prisma.budget.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: 'u-9', month: 6, year: 2024 },
          include: { category: true },
        })
      );
    });
  });
});
