import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}));

vi.mock('../src/utils/api-client.js', () => ({
  default: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
  apiClient: {
    get: (...args) => mockGet(...args),
    post: (...args) => mockPost(...args),
  },
}));

import {
  createBudget,
  getBudgets,
} from '../src/services/budgets-service.js';
import {
  createCategory,
  getCategories,
} from '../src/services/categories-service.js';
import { getMonthlyReport } from '../src/services/reports-service.js';
import {
  createTransaction,
  getTransactions,
} from '../src/services/transactions-service.js';

describe('services (payload já normalizado em response.data)', () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockPost.mockReset();
  });

  describe('transactions-service', () => {
    it('getTransactions retorna array', async () => {
      mockGet.mockResolvedValueOnce({ data: [{ id: 'a' }] });
      await expect(getTransactions()).resolves.toEqual([{ id: 'a' }]);
      expect(mockGet).toHaveBeenCalledWith('/transactions', { params: {} });
    });

    it('getTransactions retorna [] quando data não é array', async () => {
      mockGet.mockResolvedValueOnce({ data: {} });
      await expect(getTransactions()).resolves.toEqual([]);
    });

    it('createTransaction separa budgetExceeded do recurso', async () => {
      mockPost.mockResolvedValueOnce({
        data: { id: 't1', value: 5, budgetExceeded: true },
      });
      await expect(createTransaction({})).resolves.toEqual({
        transaction: { id: 't1', value: 5 },
        budgetExceeded: true,
      });
    });

    it('createTransaction trata ausência de budgetExceeded', async () => {
      mockPost.mockResolvedValueOnce({ data: { id: 't2', value: 1 } });
      await expect(createTransaction({})).resolves.toEqual({
        transaction: { id: 't2', value: 1 },
        budgetExceeded: false,
      });
    });
  });

  describe('categories-service', () => {
    it('getCategories retorna lista', async () => {
      mockGet.mockResolvedValueOnce({ data: [{ id: 'c1' }] });
      await expect(getCategories()).resolves.toEqual([{ id: 'c1' }]);
    });

    it('createCategory retorna recurso', async () => {
      mockPost.mockResolvedValueOnce({ data: { id: 'c2', name: 'X' } });
      await expect(createCategory({})).resolves.toEqual({
        id: 'c2',
        name: 'X',
      });
    });
  });

  describe('budgets-service', () => {
    it('getBudgets retorna lista', async () => {
      mockGet.mockResolvedValueOnce({ data: [{ id: 'b1' }] });
      await expect(getBudgets({ month: 4 })).resolves.toEqual([{ id: 'b1' }]);
      expect(mockGet).toHaveBeenCalledWith('/budgets', { params: { month: 4 } });
    });

    it('createBudget retorna recurso', async () => {
      mockPost.mockResolvedValueOnce({ data: { id: 'b2' } });
      await expect(createBudget({})).resolves.toEqual({ id: 'b2' });
    });
  });

  describe('reports-service', () => {
    it('getMonthlyReport retorna objeto do relatório', async () => {
      mockGet.mockResolvedValueOnce({
        data: { month: 4, year: 2026, saldo: 0 },
      });
      await expect(getMonthlyReport(4, 2026)).resolves.toEqual({
        month: 4,
        year: 2026,
        saldo: 0,
      });
    });

    it('getMonthlyReport retorna null quando data é nullish', async () => {
      mockGet.mockResolvedValueOnce({ data: null });
      await expect(getMonthlyReport(1, 2026)).resolves.toBeNull();
    });
  });
});
