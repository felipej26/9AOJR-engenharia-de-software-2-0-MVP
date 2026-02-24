# Padrões do Projeto (MVP)

## Estrutura de pastas

```
backend/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── middlewares/
│   ├── routes/
│   ├── config/
│   └── utils/
├── prisma/
└── ...

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── context/
│   └── utils/
└── ...
```

## Camadas

- **Controller**: recebe request, chama service, devolve response. Não contém lógica de negócio.
- **Service**: regras de negócio e orquestração. Chama repositories.
- **Repository**: acesso a dados (Prisma). Queries e persistência.

Fluxo: `Route → Controller → Service → Repository → DB`.

## Convenção de nomes

- Arquivos: kebab-case (ex: `transaction-service.js`, `auth-controller.js`).
- Classes/funções: PascalCase para classes, camelCase para funções.
- Tabelas/entidades: singular em inglês (ex: `user`, `transaction`, `category`, `budget`).
- Rotas: plural, kebab-case (ex: `/api/transactions`, `/api/budgets`).

## Resposta HTTP padrão

Sucesso:

```json
{
  "data": { ... }
}
```

Lista:

```json
{
  "data": [ ... ]
}
```

Erro:

```json
{
  "error": "mensagem legível",
  "code": "CODIGO_OPCIONAL"
}
```

Status: 200 (sucesso), 201 (criado), 400 (validação), 401 (não autenticado), 403 (sem permissão), 404 (não encontrado), 500 (erro interno).

## Tratamento de erros

- Middleware central de erro no backend. Captura exceções e formata resposta no padrão acima.
- Erros de validação: 400 com mensagens do validador.
- Erro de autenticação: 401.
- Recurso de outro usuário: 403 ou 404 (não expor existência).

## Validação

- Validar no controller ou em middleware antes do service (ex: Zod, Joi ou express-validator).
- Campos obrigatórios, tipos e formatos (valor numérico positivo, datas, etc.).
- Não confiar em dados do cliente; revalidar no service quando fizer sentido.

## Isolamento por usuário

- Todas as entidades de domínio (transações, categorias, orçamentos) devem ter `userId` (ou equivalente).
- Em toda leitura/escrita: filtrar ou incluir `userId` vindo do JWT (nunca do body/query).
- Middleware de auth deve anexar `req.user` (ex: `{ id, email }`) após validar JWT.
- Repositories e services recebem `userId` e aplicam em todas as queries.

## Soft delete

- Usar apenas onde for requisito explícito (ex: auditoria de transações).
- Para o MVP: delete físico é aceitável para categorias e orçamentos; transações podem usar soft delete (`deletedAt`) se quiser manter histórico. Definir em uma única estratégia por entidade e documentar em business-rules.
