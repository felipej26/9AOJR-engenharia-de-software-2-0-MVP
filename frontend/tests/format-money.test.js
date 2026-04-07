import { describe, expect, it } from 'vitest';
import { formatMoney } from '../src/utils/format-money.js';

describe('formatMoney', () => {
  it('formata números inteiros em BRL pt-BR', () => {
    expect(formatMoney(100)).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(100),
    );
  });

  it('formata decimais com duas casas', () => {
    expect(formatMoney(10.5)).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(10.5),
    );
  });

  it('aceita string numérica', () => {
    expect(formatMoney('99.99')).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(99.99),
    );
  });

  it('null vira 0 (Number(null) === 0)', () => {
    expect(formatMoney(null)).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0),
    );
  });

  it('undefined resulta em NaN formatado pelo Intl (comportamento legado)', () => {
    const out = formatMoney(undefined);
    expect(out).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(NaN),
    );
  });

  it('string vazia vira 0', () => {
    expect(formatMoney('')).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0),
    );
  });

  it('Infinity é repassado ao Intl', () => {
    expect(formatMoney(Infinity)).toBe(
      new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Infinity),
    );
  });
});
