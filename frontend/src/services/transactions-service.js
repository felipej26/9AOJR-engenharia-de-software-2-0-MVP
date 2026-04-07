import apiClient from '../utils/api-client';

export async function getTransactions(params = {}) {
  const { data } = await apiClient.get('/transactions', { params });
  return Array.isArray(data) ? data : [];
}

export async function createTransaction(payload) {
  const { data } = await apiClient.post('/transactions', payload);
  if (data == null) {
    return { transaction: undefined, budgetExceeded: false };
  }
  const { budgetExceeded, ...transaction } = data;
  return { transaction, budgetExceeded: Boolean(budgetExceeded) };
}
