import apiClient from '../utils/api-client';

export async function getCategories() {
  const { data } = await apiClient.get('/categories');
  const list = data?.data ?? data ?? [];
  return Array.isArray(list) ? list : [];
}

export async function createCategory(payload) {
  const { data } = await apiClient.post('/categories', payload);
  return data?.data ?? data;
}
