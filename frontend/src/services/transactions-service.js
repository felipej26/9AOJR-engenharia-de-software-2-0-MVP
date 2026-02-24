import apiClient from '../utils/api-client';

export async function getTransactions(params = {}) {
  const { data } = await apiClient.get('/transactions', { params });
  const list = data?.data ?? data ?? [];
  return Array.isArray(list) ? list : [];
}

export async function createTransaction(payload) {
  const { data } = await apiClient.post('/transactions', payload);
  const transaction = data?.data ?? data;
  const budgetExceeded = data?.budgetExceeded ?? false;
  return { transaction, budgetExceeded };
}
