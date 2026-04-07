import { describe, expect, it } from 'vitest';
import { parseAmountInput } from '../src/utils/parse-amount-input.js';

describe('parseAmountInput', () => {
  describe('parsing válido', () => {
    it('aceita inteiros como string', () => {
      expect(parseAmountInput('100')).toBe(100);
    });

    it('aceita decimais com ponto', () => {
      expect(parseAmountInput('10.5')).toBe(10.5);
    });

    it('ignora espaços nas bordas', () => {
      expect(parseAmountInput('  99.99  ')).toBe(99.99);
    });

    it('aceita número já numérico', () => {
      expect(parseAmountInput(42)).toBe(42);
      expect(parseAmountInput(3.14)).toBe(3.14);
    });

    it('mantém prefixo numérico como parseFloat (ex.: sufixo não numérico)', () => {
      expect(parseAmountInput('12abc')).toBe(12);
    });
  });

  describe('valores inválidos', () => {
    it('retorna NaN para texto sem dígito inicial', () => {
      expect(parseAmountInput('abc')).toBeNaN();
      expect(parseAmountInput('x12')).toBeNaN();
    });

    it('retorna NaN para apenas sinal ou ponto isolado quando não formam número', () => {
      expect(parseAmountInput('+')).toBeNaN();
      expect(parseAmountInput('-')).toBeNaN();
    });
  });

  describe('edge cases', () => {
    it('string vazia vira NaN', () => {
      expect(parseAmountInput('')).toBeNaN();
    });

    it('apenas espaços vira NaN', () => {
      expect(parseAmountInput('   ')).toBeNaN();
    });

    it('null e undefined viram NaN', () => {
      expect(parseAmountInput(null)).toBeNaN();
      expect(parseAmountInput(undefined)).toBeNaN();
    });

    it('Infinity não é aceito como finito', () => {
      expect(parseAmountInput('Infinity')).toBeNaN();
      expect(parseAmountInput('-Infinity')).toBeNaN();
    });

    it('zero é finito e preservado', () => {
      expect(parseAmountInput('0')).toBe(0);
      expect(parseAmountInput(0)).toBe(0);
    });
  });
});
