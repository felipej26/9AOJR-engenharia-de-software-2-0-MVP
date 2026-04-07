jest.mock('../src/repositories/transaction-repository', () => ({
  create: jest.fn(),
  sumByCategoryAndMonth: jest.fn(),
}));
jest.mock('../src/repositories/category-repository', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/repositories/budget-repository', () => ({
  findByCategoryAndMonth: jest.fn(),
}));

const categoryRepository = require('../src/repositories/category-repository');
const transactionService = require('../src/services/transaction-service');
const budgetService = require('../src/services/budget-service');
const { HttpError } = require('../src/errors/http-error');

describe('services lançam HttpError com status HTTP correto', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('transaction-service', () => {
    it('404 quando categoria não existe', async () => {
      categoryRepository.findById.mockResolvedValue(null);

      await expect(
        transactionService.create('u1', {
          categoryId: 'c1',
          type: 'despesa',
          value: 10,
          date: '2026-04-01',
          description: 'x',
        })
      ).rejects.toMatchObject({
        constructor: HttpError,
        statusCode: 404,
        message: 'Categoria não encontrada',
      });
    });

    it('400 quando tipo da transação não confere com a categoria', async () => {
      categoryRepository.findById.mockResolvedValue({ id: 'c1', type: 'receita', name: 'Salário' });

      await expect(
        transactionService.create('u1', {
          categoryId: 'c1',
          type: 'despesa',
          value: 10,
          date: '2026-04-01',
          description: 'x',
        })
      ).rejects.toMatchObject({
        constructor: HttpError,
        statusCode: 400,
        message: 'Tipo da transação não confere com o tipo da categoria',
      });
    });
  });

  describe('budget-service', () => {
    it('400 para orçamento em mês passado', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-15'));

      await expect(
        budgetService.create('u1', {
          categoryId: 'c1',
          month: 3,
          year: 2026,
          amount: 100,
        })
      ).rejects.toMatchObject({
        constructor: HttpError,
        statusCode: 400,
        message: 'Orçamento só pode ser criado para o mês atual ou meses futuros',
      });

      jest.useRealTimers();
    });

    it('404 quando categoria não existe', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-04-15'));
      categoryRepository.findById.mockResolvedValue(null);

      await expect(
        budgetService.create('u1', {
          categoryId: 'c1',
          month: 5,
          year: 2026,
          amount: 100,
        })
      ).rejects.toMatchObject({
        constructor: HttpError,
        statusCode: 404,
        message: 'Categoria não encontrada',
      });

      jest.useRealTimers();
    });
  });
});
