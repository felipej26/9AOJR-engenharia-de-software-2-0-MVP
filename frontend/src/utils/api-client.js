import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Normaliza o corpo JSON da API: envelope `{ data: ... }` vira o valor interno.
 * Se existirem outros campos no mesmo nível que `data` (ex.: `budgetExceeded`),
 * o objeto interno é mesclado com esses campos para não perder metadados.
 */
export function normalizeResponseData(body) {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    return body;
  }
  if (!Object.prototype.hasOwnProperty.call(body, 'data')) {
    return body;
  }
  const { data: inner, ...rest } = body;
  const extraKeys = Object.keys(rest);
  if (extraKeys.length === 0) {
    return inner;
  }
  if (inner !== null && typeof inner === 'object' && !Array.isArray(inner)) {
    return { ...inner, ...rest };
  }
  return { data: inner, ...rest };
}

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => {
    response.data = normalizeResponseData(response.data);
    return response;
  },
  (err) => Promise.reject(err)
);

export default apiClient;
