# Regras de negócio (MVP)

## Transações

- Tipos: **receita** ou **despesa**.
- Valor sempre **positivo** (não permitir zero ou negativo).
- Cada transação pertence a **um usuário** (userId) e a **uma categoria**.
- Campos mínimos: valor, data, descrição (opcional), tipo, categoryId, userId.
- Filtros comuns: por usuário, por mês/ano, por categoria, por tipo.

## Recorrências

- **Apenas recorrência mensal** no MVP.
- Configuração: valor, categoria, tipo (receita/despesa), dia do mês (1–28 para evitar edge cases), userId.
- Job diário (scheduler): para cada recorrência ativa, se “próxima data” ≤ hoje, criar transação com essa data e atualizar “próxima data” para o mesmo dia no mês seguinte.
- **Não duplicar**: não criar duas transações para a mesma recorrência no mesmo mês (checagem por recurrenceId + ano/mês ou equivalente).
- Transações geradas são normais (mesmo modelo); apenas a origem é a recorrência.

## Orçamentos

- **Um orçamento por categoria por mês por usuário** (unicidade: userId, categoryId, ano, mês).
- Apenas meses **atuais ou futuros** podem ter orçamento (não criar orçamento para meses passados).
- Valor do orçamento: número positivo (limite da categoria naquele mês).
- **Alerta simples**: ao consultar orçamento ou relatório, indicar se a soma das despesas da categoria no mês já ultrapassou o valor do orçamento (campo calculado ou flag “ultrapassado”).

## Categorias

- Pertencem ao **usuário** (userId).
- **Um único nível**: sem hierarquia (pai/filho). Lista plana de categorias por usuário.
- Nome obrigatório; pode ter tipo padrão (receita/despesa) para facilitar uso em transações e orçamentos.

## Relatórios

- **Relatório mensal básico**: período = mês/ano.
- **Soma por mês**: total de receitas e total de despesas no mês (por usuário).
- **Agrupamento por categoria**: no mês, soma de valores por categoria (e por tipo, se necessário), para permitir comparar com orçamento.
- Sem versionamento de regras ou relatórios históricos complexos no MVP.
