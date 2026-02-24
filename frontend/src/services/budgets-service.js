import apiClient from '../utils/api-client';

export async function getBudgets(params = {}) {
  const { data } = await apiClient.get('/budgets', { params });
  const list = data?.data ?? data ?? [];
  return Array.isArray(list) ? list : [];
}

export async function createBudget(payload) {
  const { data } = await apiClient.post('/budgets', payload);
  return data?.data ?? data;
}
