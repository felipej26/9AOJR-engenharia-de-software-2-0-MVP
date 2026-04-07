jest.mock('../src/lib/prisma', () => {
  const { createPrismaMock } = require('./helpers/create-prisma-mock');
  return createPrismaMock();
});

const prisma = require('../src/lib/prisma');
const transactionRepository = require('../src/repositories/transaction-repository');
const transactionService = require('../src/services/transaction-service');

describe('Repositórios e services com Prisma mockado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('transaction-repository.create delega ao prisma.transaction.create', async () => {
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-1',
      userId: 'user-1',
      categoryId: 'cat-1',
      value: 10,
      date: new Date('2024-06-01'),
      description: null,
      type: 'receita',
      recurrenceId: null,
      category: { id: 'cat-1', name: 'Salário', type: 'receita' },
    });

    const row = await transactionRepository.create('user-1', {
      categoryId: 'cat-1',
      value: 10,
      date: '2024-06-01',
      type: 'receita',
    });

    expect(row.id).toBe('tx-1');
    expect(prisma.transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          categoryId: 'cat-1',
          type: 'receita',
        }),
      })
    );
  });

  it('transaction-service.create orquestra repositórios com o mesmo prisma mockado', async () => {
    prisma.category.findFirst.mockResolvedValue({
      id: 'cat-1',
      name: 'Alimentação',
      type: 'despesa',
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-2',
      userId: 'user-1',
      categoryId: 'cat-1',
      value: 25,
      date: new Date('2024-06-15'),
      description: null,
      type: 'despesa',
      createdAt: new Date('2024-06-15T12:00:00.000Z'),
      category: { id: 'cat-1', name: 'Alimentação', type: 'despesa' },
    });
    prisma.budget.findUnique.mockResolvedValue(null);
    prisma.transaction.aggregate.mockResolvedValue({ _sum: { value: null } });

    const result = await transactionService.create('user-1', {
      categoryId: 'cat-1',
      value: 25,
      date: '2024-06-15',
      type: 'despesa',
    });

    expect(result.transaction.id).toBe('tx-2');
    expect(result.transaction.type).toBe('despesa');
    expect(prisma.category.findFirst).toHaveBeenCalled();
    expect(prisma.transaction.create).toHaveBeenCalled();
  });

  it('transaction-service.create omite budgetExceeded para receita (sem aggregate)', async () => {
    prisma.category.findFirst.mockResolvedValue({
      id: 'cat-r',
      name: 'Salário',
      type: 'receita',
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-r',
      userId: 'user-1',
      categoryId: 'cat-r',
      value: 500,
      date: new Date('2024-06-01'),
      description: null,
      type: 'receita',
      createdAt: new Date('2024-06-01T10:00:00.000Z'),
      category: { id: 'cat-r', name: 'Salário', type: 'receita' },
    });
    prisma.budget.findUnique.mockResolvedValue({
      amount: 200,
      categoryId: 'cat-r',
    });

    const result = await transactionService.create('user-1', {
      categoryId: 'cat-r',
      value: 500,
      date: '2024-06-01',
      type: 'receita',
    });

    expect(result.transaction.type).toBe('receita');
    expect(result.budgetExceeded).toBeUndefined();
    expect(prisma.budget.findUnique).toHaveBeenCalled();
    expect(prisma.transaction.aggregate).not.toHaveBeenCalled();
  });

  it('transaction-service.create indica budgetExceeded quando despesa ultrapassa orçamento', async () => {
    prisma.category.findFirst.mockResolvedValue({
      id: 'cat-d',
      name: 'Lazer',
      type: 'despesa',
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-d',
      userId: 'user-1',
      categoryId: 'cat-d',
      value: 80,
      date: new Date('2024-07-10'),
      description: null,
      type: 'despesa',
      createdAt: new Date('2024-07-10T10:00:00.000Z'),
      category: { id: 'cat-d', name: 'Lazer', type: 'despesa' },
    });
    prisma.budget.findUnique.mockResolvedValue({
      amount: 100,
      categoryId: 'cat-d',
    });
    prisma.transaction.aggregate.mockResolvedValue({ _sum: { value: 120 } });

    const result = await transactionService.create('user-1', {
      categoryId: 'cat-d',
      value: 80,
      date: '2024-07-10',
      type: 'despesa',
    });

    expect(result.budgetExceeded).toBe(true);
    expect(prisma.transaction.aggregate).toHaveBeenCalled();
  });

  it('transaction-service.create não define budgetExceeded quando despesa está dentro do orçamento', async () => {
    prisma.category.findFirst.mockResolvedValue({
      id: 'cat-d',
      name: 'Lazer',
      type: 'despesa',
    });
    prisma.transaction.create.mockResolvedValue({
      id: 'tx-d',
      userId: 'user-1',
      categoryId: 'cat-d',
      value: 10,
      date: new Date('2024-07-10'),
      description: null,
      type: 'despesa',
      createdAt: new Date('2024-07-10T10:00:00.000Z'),
      category: { id: 'cat-d', name: 'Lazer', type: 'despesa' },
    });
    prisma.budget.findUnique.mockResolvedValue({
      amount: 500,
      categoryId: 'cat-d',
    });
    prisma.transaction.aggregate.mockResolvedValue({ _sum: { value: 100 } });

    const result = await transactionService.create('user-1', {
      categoryId: 'cat-d',
      value: 10,
      date: '2024-07-10',
      type: 'despesa',
    });

    expect(result.budgetExceeded).toBeUndefined();
  });
});
