export const TRANSACTION_TYPE = {
  RECEITA: 'receita',
  DESPESA: 'despesa',
};

export const TRANSACTION_TYPE_OPTIONS = [
  { value: TRANSACTION_TYPE.RECEITA, label: 'Receita' },
  { value: TRANSACTION_TYPE.DESPESA, label: 'Despesa' },
];

export const DEFAULT_TRANSACTION_TYPE = TRANSACTION_TYPE.DESPESA;

export function getTransactionTypeLabel(type) {
  return type === TRANSACTION_TYPE.RECEITA ? 'Receita' : 'Despesa';
}

/** Palavra-chave em minúsculas, como usada no texto do dashboard. */
export function getTransactionTypeKeyword(type) {
  return type === TRANSACTION_TYPE.RECEITA ? 'receita' : 'despesa';
}
