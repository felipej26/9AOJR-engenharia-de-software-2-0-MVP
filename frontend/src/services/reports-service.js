import apiClient from '../utils/api-client';

export async function getMonthlyReport(month, year) {
  const { data } = await apiClient.get('/reports/monthly', {
    params: { month, year },
  });
  return data ?? null;
}
