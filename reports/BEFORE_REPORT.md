Segue um **relatório de dívida técnica** com base na leitura do repositório (backend Express + Prisma, frontend Vite/React). O escopo é o que o código mostra hoje; não há suíte de testes automatizados no projeto.

---

## Visão geral da arquitetura

Há uma separação **Controller → Service → Repository** no backend, o que é um bom ponto de partida. Porém, o acesso a dados e o bootstrap do servidor **não seguem um único padrão**, e o frontend repete muito o mesmo fluxo de página (fetch + estado + erro), o que aumenta acoplamento implícito à API e reduz coesão das páginas.

---

## Code smells

| Smell                                      | Onde / evidência                                                                                     | Impacto                                                                                                                                                                |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Múltiplas instâncias de `PrismaClient`** | Cada repositório e `report-service` faz `new PrismaClient()`                                         | Risco de **múltiplos pools** de conexão, comportamento difícil de prever sob carga e violação forte de **DIP** (tudo depende de uma classe concreta global implícita). |
| **Camada de repositório ignorada**         | `report-service.js` usa Prisma diretamente                                                           | **Inconsistência arquitetural**: parte do domínio passa por repositórios, parte “furou” a camada; dificulta testes e mudanças de persistência.                         |
| **God service / procedimento longo**       | `report-service.monthly` agrega leitura, agregações em memória, budgets e N agregações por orçamento | **SRP** fraco; **N+1** de agregações no `budgetStatus` (um `aggregate` por budget).                                                                                    |
| **Bootstrap com duas responsabilidades**   | `server.js` sobe HTTP **e** agenda cron                                                              | Mistura **entrega HTTP** com **processamento agendado**; dificulta escalar (várias instâncias = job duplicado) e testar isoladamente.                                  |
| **Erros ad hoc**                           | Serviços usam `Error` + `statusCode` manual                                                          | Padrão frágil (fácil esquecer campos); sem tipo de erro de domínio, sem mapeamento centralizado além do `error-handler`.                                               |
| **Duplicação (DRY)**                       | `formatMoney` repetido em várias páginas; `TYPES` receita/despesa repetido                           | Manutenção duplicada e risco de divergência de formatação/regras de UI.                                                                                                |
| **Páginas “gordas”**                       | Padrão repetido: `load`, `useEffect`, `Promise.then/catch`, toasts                                   | Falta de abstração (hooks ou camada de dados) → **acoplamento** das views a detalhes de rede e parsing.                                                                |
| **`parseFloat(form.amount, 10)`**          | `transactions-page.jsx`                                                                              | Segundo argumento de `parseFloat` é ignorado (ruído / possível confusão).                                                                                              |
| **Ausência de testes**                     | Nenhum arquivo `*test*` no repositório                                                               | Regressões e refatorações (ex.: extrair Prisma singleton) ficam **sem rede de segurança**.                                                                             |

Trechos ilustrativos:

```1:2:backend/src/repositories/transaction-repository.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
```

```1:16:backend/src/services/report-service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function monthly(userId, month, year) {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59, 999);

  const transactions = await prisma.transaction.findMany({
```

```6:19:backend/src/server.js
const server = app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Mock user ID: ${mockUserId}`);
});

// Job diário às 00:05 para processar recorrências
cron.schedule('5 0 * * *', async () => {
  try {
    await runRecurrenceJob(mockUserId);
```

---

## Violações de padrões e de SOLID (com foco em acoplamento)

**Single Responsibility (S)**

- `report-service` concentra leitura, cálculo, consolidação por categoria e status de orçamento.
- `server.js` mistura servidor e agendador.
- `transaction-service.create` orquestra categoria, persistência, orçamento e soma — aceitável como _orquestração_, mas ainda assim **alto acoplamento** a três repositórios sem fronteira de domínio explícita.

**Open/Closed (O)**

- Autenticação é um mock fixo; evoluir para JWT exige **alterar** fluxo e config, não **estender** com um adaptador injetável.

**Liskov (L)**

- Pouco relevante aqui (quase sem hierarquia de tipos).

**Interface Segregation (I)**

- Módulos exportam funções soltas; não há contratos explícitos (interfaces/portas). Para um MVP é comum, mas **aumenta acoplamento** entre camadas apenas via `require` concreto.

**Dependency Inversion (D)**

- **Forte dependência de implementação**: Prisma em todo lugar, sem injeção de `prisma` ou de repositórios. Serviços dependem de módulos concretos de repositório, não de abstrações — dificulta testes unitários sem DB ou sem monkey-patch.

**Acoplamento excessivo (resumo)**

- **Backend**: serviço de relatórios acoplado diretamente ao Prisma; serviços de transação/orçamento acoplados a **vários** repositórios e a detalhes de agregação.
- **Frontend**: páginas acopladas a **formato de resposta** da API (`data?.data ?? data`) espalhado nos services — mudança de envelope da API quebra vários pontos.
- **Cron + `mockUserId`**: job acoplado a **um único usuário** definido por env — limite arquitetural claro para multiusuário.

```1:13:backend/src/middlewares/auth.js
const { mockUserId } = require('../config/env');

/**
 * MVP: middleware de auth mock. Define req.user com usuário fixo.
 * Em produção seria substituído por validação JWT.
 */
function authMock(req, res, next) {
  req.user = {
    id: mockUserId,
    email: 'usuario@mvp.local',
  };
  next();
}
```

---

## Obsolescência e riscos de manutenção

| Item                                   | Observação                                                                                                                                                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Versões de stack**                   | React 18, Vite 5, Express 4, Prisma 5.7 — não estão “mortas”, mas **Prisma e ecossistema Node evoluem rápido**; vale planejar upgrades periódicos e checar [changelog](https://www.prisma.io/changelog) na hora de subir major. |
| **Backend sem TypeScript**             | Frontend tem `@types/react`, backend é JS puro — **assimetria** e menos garantias em contratos API/serviço.                                                                                                                     |
| **`postinstall` com TLS desabilitado** | Em `backend/package.json`, `NODE_TLS_REJECT_UNAUTHORIZED=0` no `postinstall` é **prática obsoleta e perigosa** (normalização de ambiente inseguro); deve ser tratado como dívida de **segurança/compliance**, não só “versão”.  |
| **Ferramentas de qualidade**           | Não há evidência de ESLint/Prettier/Husky no que foi lido — comum em MVP, mas aumenta risco de **inconsistência** e bugs evitáveis.                                                                                             |
| **Multi-instância / produção**         | Cron no mesmo processo do API e auth mock são **padrões de protótipo**, não de produção — “obsolescência conceitual” do desenho quando o produto crescer.                                                                       |

---

## Priorização sugerida (para roadmap de dívida)

1. **Um único `PrismaClient`** (módulo compartilhado + desligamento gracioso) — reduz risco operacional e alinha **DIP**.
2. **Alinhar `report-service` à camada de repositório** (ou renomear explicitamente como “read model” e documentar a exceção).
3. **Separar worker de cron** do processo HTTP ou usar fila/lock — evita duplicação de job e clarifica **SRP**.
4. **Extrair DRY no frontend** (`formatMoney`, constantes de tipo, opcionalmente hook `useApiResource`).
5. **Testes nos serviços críticos** (transação, orçamento, relatório) após introduzir injeção ou mocks de repositório.
