import apiClient from '../utils/api-client';

export async function getBudgets(params = {}) {
  const { data } = await apiClient.get('/budgets', { params });
  return Array.isArray(data) ? data : [];
}

export async function createBudget(payload) {
  const { data } = await apiClient.post('/budgets', payload);
  return data;
}
