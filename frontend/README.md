# Frontend — Controle Financeiro Pessoal (MVP)

SPA em React que consome a API REST do backend para controle financeiro pessoal.

## Pré-requisitos

- **Node.js** (LTS, ex.: 18 ou 20)
- **npm** (ou yarn/pnpm)
- Backend do projeto rodando localmente (ver repositório raiz)

## Configurar URL da API

A aplicação usa a variável de ambiente `VITE_API_URL` como base da API.

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.example .env
   ```
2. Edite `.env` e defina a URL do backend:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```
   Ajuste a porta se o seu backend estiver em outra (ex.: `3000`).

## Como rodar

Comando único para subir o frontend em modo desenvolvimento:

```bash
npm install
npm run dev
```

O app estará disponível em **http://localhost:5173** (ou a porta indicada no terminal).

## Apontar para o backend local

1. Inicie o backend na pasta `backend/` (ex.: `npm run dev` na porta 3001).
2. Configure `VITE_API_URL` no `.env` do frontend para essa URL + `/api` (ex.: `http://localhost:3001/api`).
3. Rode o frontend com `npm run dev`.

Não é necessário login: o backend usa usuário mock fixo; o frontend apenas consome os endpoints.

## Funcionalidades (MVP)

- **Dashboard** (`/`): seletor de mês/ano, resumo (entradas, saídas, saldo), gastos por categoria e status de orçamentos.
- **Transações** (`/transactions`): listagem com filtro opcional por mês e formulário de criação (tipo, valor, data, descrição, categoria). Exibe alerta se o orçamento for ultrapassado.
- **Categorias** (`/categories`): listagem e criação (nome, tipo receita/despesa).
- **Orçamentos** (`/budgets`): listagem e criação (categoria, mês, ano, valor limite).

## Estrutura (resumo)

```
frontend/
├── src/
│   ├── components/   # layout, loading, error, empty
│   ├── context/      # toast (feedback)
│   ├── pages/        # dashboard, transactions, categories, budgets
│   ├── services/     # API por domínio (transactions, categories, budgets, reports)
│   └── utils/        # api-client, parse-api-error
├── .env.example
├── package.json
└── README.md
```

## Build para produção

```bash
npm run build
```

Os arquivos gerados ficam em `dist/`. Para preview local:

```bash
npm run preview
```
