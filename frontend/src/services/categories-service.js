import apiClient from '../utils/api-client';

export async function getCategories() {
  const { data } = await apiClient.get('/categories');
  return Array.isArray(data) ? data : [];
}

export async function createCategory(payload) {
  const { data } = await apiClient.post('/categories', payload);
  return data;
}
