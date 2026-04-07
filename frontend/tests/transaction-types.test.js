import { describe, expect, it } from 'vitest';
import {
  DEFAULT_TRANSACTION_TYPE,
  getTransactionTypeKeyword,
  getTransactionTypeLabel,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_OPTIONS,
} from '../src/constants/transaction-types.js';

describe('TRANSACTION_TYPE', () => {
  it('usa os mesmos valores que a API espera', () => {
    expect(TRANSACTION_TYPE.RECEITA).toBe('receita');
    expect(TRANSACTION_TYPE.DESPESA).toBe('despesa');
  });
});

describe('DEFAULT_TRANSACTION_TYPE', () => {
  it('é despesa, alinhado aos formulários existentes', () => {
    expect(DEFAULT_TRANSACTION_TYPE).toBe(TRANSACTION_TYPE.DESPESA);
  });
});

describe('TRANSACTION_TYPE_OPTIONS', () => {
  it('tem duas opções na ordem receita, despesa', () => {
    expect(TRANSACTION_TYPE_OPTIONS).toHaveLength(2);
    expect(TRANSACTION_TYPE_OPTIONS[0]).toEqual({
      value: 'receita',
      label: 'Receita',
    });
    expect(TRANSACTION_TYPE_OPTIONS[1]).toEqual({
      value: 'despesa',
      label: 'Despesa',
    });
  });

  it('valores batem com TRANSACTION_TYPE', () => {
    const values = TRANSACTION_TYPE_OPTIONS.map((o) => o.value);
    expect(values).toContain(TRANSACTION_TYPE.RECEITA);
    expect(values).toContain(TRANSACTION_TYPE.DESPESA);
  });
});

describe('getTransactionTypeLabel', () => {
  it('retorna rótulos em português para os tipos conhecidos', () => {
    expect(getTransactionTypeLabel(TRANSACTION_TYPE.RECEITA)).toBe('Receita');
    expect(getTransactionTypeLabel(TRANSACTION_TYPE.DESPESA)).toBe('Despesa');
  });

  it('trata qualquer valor não receita como Despesa (comportamento legado do ternário)', () => {
    expect(getTransactionTypeLabel('outro')).toBe('Despesa');
    expect(getTransactionTypeLabel(undefined)).toBe('Despesa');
  });
});

describe('getTransactionTypeKeyword', () => {
  it('retorna palavras em minúsculas para o dashboard', () => {
    expect(getTransactionTypeKeyword(TRANSACTION_TYPE.RECEITA)).toBe('receita');
    expect(getTransactionTypeKeyword(TRANSACTION_TYPE.DESPESA)).toBe('despesa');
  });

  it('valores desconhecidos caem em despesa', () => {
    expect(getTransactionTypeKeyword(null)).toBe('despesa');
  });
});
