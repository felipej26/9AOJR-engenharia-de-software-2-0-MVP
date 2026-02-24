# Stack tecnológica (MVP)

## Frontend

- **React** (create-react-app ou Vite): SPA.
- **HTTP**: axios ou fetch; cliente configurado com baseURL e interceptor para enviar `Authorization: Bearer <token>`.
- **Estado**: Context API para usuário logado e token; estado local (useState) para formulários e listas. Evitar Redux ou libs pesadas no MVP.
- **Roteamento**: React Router (ex.: react-router-dom) para login, registro e rotas protegidas (dashboard, transações, categorias, orçamentos, relatório).

## Backend

- **Runtime**: Node.js (LTS).
- **Framework**: Express.
- **ORM**: Prisma. Schema em `prisma/schema.prisma`; migrations via `prisma migrate`.
- **Autenticação**: JWT (ex.: jsonwebtoken). Token com payload mínimo (userId, email); expiração configurável (ex.: 7d). bcrypt para hash de senha.
- **Validação**: Zod ou Joi para validar body/query nas rotas ou em middleware.

## Banco de dados

- **PostgreSQL**: único banco do MVP.
- **Migrations**: Prisma Migrate. Histórico versionado em `prisma/migrations/`.
- **Índices**: (userId) em tabelas de domínio; (userId, date) ou (userId, month, year) onde houver filtros por período; (userId, categoryId, month, year) para orçamento; índices únicos conforme regras (ex.: um orçamento por categoria por mês por usuário).

## Infra e execução

- **Variáveis de ambiente**: .env (não versionado). Ex.: DATABASE_URL, JWT_SECRET, PORT. Exemplo em .env.example.
- **Execução local**: `npm run dev` no backend (nodemon ou ts-node-dev); `npm run dev` no frontend. Backend e frontend sobem separados; frontend aponta para a URL do backend.
- **Scheduler**: node-cron no processo do backend. Um cron por dia (ex.: '5 0 * * *') que dispara o job de recorrências. Sem Celery, Bull ou serviços externos.

## Resumo

| Camada   | Tecnologia        |
|----------|--------------------|
| Frontend | React, axios/fetch, Context API, React Router |
| Backend  | Node.js, Express, Prisma, JWT, bcrypt, Zod/Joi |
| Banco    | PostgreSQL, Prisma Migrate |
| Scheduler | node-cron (in-process) |
