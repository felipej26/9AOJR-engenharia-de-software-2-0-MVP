import { describe, expect, it } from 'vitest';
import { normalizeResponseData } from '../src/utils/api-client.js';

describe('normalizeResponseData', () => {
  it('desembrulha { data: valor } e retorna o valor', () => {
    expect(normalizeResponseData({ data: { id: 1 } })).toEqual({ id: 1 });
    expect(normalizeResponseData({ data: [1, 2] })).toEqual([1, 2]);
  });

  it('retorna o corpo quando não há envelope data', () => {
    expect(normalizeResponseData({ items: [], total: 0 })).toEqual({
      items: [],
      total: 0,
    });
  });

  it('mescla metadados irmãos de data no objeto interno', () => {
    expect(
      normalizeResponseData({
        data: { id: 't1', value: 10 },
        budgetExceeded: true,
      })
    ).toEqual({ id: 't1', value: 10, budgetExceeded: true });
  });

  it('mantém data aninhada quando o interno não é objeto simples e há extras', () => {
    expect(
      normalizeResponseData({
        data: [{ id: 1 }],
        cursor: 'next',
      })
    ).toEqual({ data: [{ id: 1 }], cursor: 'next' });
  });

  it('não altera null, primitivos ou arrays na raiz', () => {
    expect(normalizeResponseData(null)).toBeNull();
    expect(normalizeResponseData('ok')).toBe('ok');
    expect(normalizeResponseData([1, 2])).toEqual([1, 2]);
  });
});
