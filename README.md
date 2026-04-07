# Controle Financeiro Pessoal — MVP

Sistema de controle financeiro pessoal com backend REST, PostgreSQL e dados mockados (usuário fixo). Executável localmente.

## Regras e documentação

- [Arquitetura](.ai/architecture.md)
- [Stack](.ai/tech-stack.md)
- [Regras de negócio](.ai/business-rules.md)
- [Padrões](.ai/standards.md)

## Pré-requisitos

- Node.js (LTS)
- PostgreSQL 15+ (ou Docker)

## Execução rápida (comando único)

Com Docker instalado:

```bash
# 1. Subir o banco
docker-compose up -d

# 2. Configurar e rodar o backend (uma vez: setup; depois: dev)
cp backend/.env.example backend/.env
cd backend && npm install && npm run setup && npm run dev
```

Sem Docker: use um PostgreSQL local na porta 5432 (usuário/senha/db: `postgres`/`postgres`/`financial_control`) e ajuste `backend/.env` se necessário. Depois:

```bash
cd backend && npm install && npm run setup && npm run dev
```

A API estará em **http://localhost:3001**.

O job diário de **recorrências** não roda mais dentro da API. Em outro terminal (ou outro container), suba o worker:

```bash
cd backend && npm run start:worker
```

Vários workers podem estar ativos: só um executa o job por vez graças a um **lock consultivo no PostgreSQL** (`pg_try_advisory_lock`). A API continua independente e não agenda cron.

## Estrutura do projeto

```
backend/
├── prisma/
│   ├── schema.prisma    # Modelos (User, Transaction, Category, Budget, Recurrence)
│   └── seed.js          # Seed: usuário mock + categorias iniciais
├── src/
│   ├── config/          # env (porta, MOCK_USER_ID)
│   ├── controllers/     # transaction, category, budget, report
│   ├── services/        # regras de negócio + recurrence-job
│   ├── repositories/    # acesso a dados (Prisma)
│   ├── routes/          # /api/transactions, /api/categories, etc.
│   ├── middlewares/     # auth mock, error-handler, validate (Zod)
│   ├── utils/           # validators (Zod schemas)
│   ├── app.js
│   ├── server.js        # Apenas API HTTP (Express)
│   ├── cron-worker.js   # Processo separado: cron de recorrências
│   └── jobs/
│       └── recurrence-cron.js  # Agenda + lock Postgres (evita duplicar entre instâncias)
├── scripts/
│   └── init-db.js       # prisma db push + seed
├── .env.example
└── package.json
```

## Endpoints (base: `/api`)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST   | /transactions | Criar transação (valida categoria e alerta orçamento) |
| GET    | /transactions | Listar transações (query: month, year, categoryId, type) |
| POST   | /categories   | Criar categoria |
| GET    | /categories   | Listar categorias |
| POST   | /budgets      | Criar orçamento (categoria + mês/ano) |
| GET    | /budgets      | Listar orçamentos (query: month, year) |
| GET    | /reports/monthly?month=2&year=2025 | Relatório mensal (totais e por categoria) |

Todas as rotas usam **usuário mock fixo** (sem login; `req.user` definido pelo middleware).

## Variáveis de ambiente (`backend/.env`)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/financial_control?schema=public"
PORT=3001
MOCK_USER_ID=00000000-0000-0000-0000-000000000001
# Opcional — apenas no worker de cron (padrão: 5 0 * * * = todo dia 00:05)
# RECURRENCE_CRON="5 0 * * *"
```

## Scripts no `backend/`

| Script | Uso |
|--------|-----|
| `npm run dev` | Sobe a API com nodemon |
| `npm run start` | Sobe apenas a API HTTP (sem cron) |
| `npm run start:worker` | Sobe o processo do cron de recorrências (separado da API) |
| `npm run setup` | Cria tabelas (`prisma db push`) e executa seed |
| `npm run db:migrate` | Migrations (quando usar migrate em vez de push) |
| `npm run db:seed` | Apenas seed |

## Funcionalidades do MVP

- Criar e listar **transações** (receita/despesa, valor positivo, categoria, data).
- Criar e listar **categorias** (nome, tipo receita/despesa).
- Criar e listar **orçamentos** (por categoria e mês/ano; apenas mês atual ou futuro).
- **Relatório mensal**: totais de receita/despesa, saldo, soma por categoria e status de orçamento (ultrapassado ou não).
- **Verificação de orçamento**: ao criar despesa, a resposta pode incluir indicação de orçamento ultrapassado para aquela categoria no mês.
- **Exclusão lógica**: transações usam `deleted_at`.
- **Isolamento por usuário**: todas as operações filtradas por `userId` (mock).
- **Scheduler**: job diário (padrão 00:05) no processo `start:worker` para gerar transações a partir de recorrências mensais; lock no Postgres evita duplicação entre instâncias (modelo Recurrence presente; endpoints de recorrência não exigidos no MVP).

## Exemplo de uso (curl)

```bash
# Listar categorias (após seed)
curl -s http://localhost:3001/api/categories | jq

# Criar transação (use um categoryId retornado acima)
curl -s -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"value": 100.50, "date": "2025-02-20", "type": "despesa", "categoryId": "<UUID>"}' | jq

# Relatório mensal
curl -s "http://localhost:3001/api/reports/monthly?month=2&year=2025" | jq
```
