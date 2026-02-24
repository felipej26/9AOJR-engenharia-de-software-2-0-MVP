/**
 * Extrai mensagem e detalhes de erro da resposta do backend.
 * Backend padrão: { error: "mensagem", code?: "CODIGO" }
 * Axios: err.response?.data, err.response?.status
 */
export function parseApiError(err) {
  const data = err.response?.data;
  const status = err.response?.status;
  const message =
    (data && (typeof data.error === 'string' ? data.error : data.message)) ||
    err.message ||
    'Erro ao comunicar com o servidor.';
  const details = data?.details || data?.errors || null;
  return { message, status, details };
}
