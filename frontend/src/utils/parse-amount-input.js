/**
 * Converte valor de campo (ex.: type="number") em número finito.
 * Usa parseFloat (um único argumento) e rejeita infinito via Number.isFinite.
 *
 * @param {unknown} value
 * @returns {number} Número finito ou NaN se vazio / inválido / não finito
 */
export function parseAmountInput(value) {
  const trimmed = String(value ?? '').trim();
  if (trimmed === '') return NaN;
  const n = parseFloat(trimmed);
  return Number.isFinite(n) ? n : NaN;
}
