Você deve implementar um MVP de FRONTEND executável localmente, baseado EXCLUSIVAMENTE nos arquivos de contexto presentes em .ai/:

- .ai/architecture.md
- .ai/tech-stack.md
- .ai/business-rules.md
- .ai/standards.md

OBJETIVO:

Criar um SPA de controle financeiro pessoal que consome um backend REST local, com fluxo funcional do MVP.

REQUISITOS OBRIGATÓRIOS:

1. Siga exatamente o que está definido em .ai/architecture.md, .ai/tech-stack.md, .ai/business-rules.md e .ai/standards.md.

2. Implementar apenas o necessário para um MVP.

3. Consumir endpoints mínimos do backend:
   - POST /transactions
   - GET /transactions
   - POST /categories
   - GET /categories
   - POST /budgets
   - GET /budgets
   - GET /reports/monthly

4. Sem autenticação complexa (backend usa mock user fixo). O frontend não implementa login.

5. Deve rodar com comando único (ex.: npm run dev), com README claro.

FUNCIONALIDADES (MVP):

- Criar transação
- Listar transações
- Criar categoria
- Listar categorias
- Criar orçamento (budget)
- Listar orçamentos
- Relatório mensal simples (dashboard)

REGRAS IMPORTANTES:

- Isolamento por usuário é do backend (mock). No frontend, apenas consuma normalmente.
- Exclusão lógica (deleted_at): se o backend retornar itens com deleted_at preenchido, não exiba na listagem.
- Validação de dados obrigatórios no frontend (além do backend).
- Ao criar transação, o backend faz verificação de orçamento. O frontend deve:
  - Mostrar sucesso quando criar.
  - Se a resposta do backend vier com algum “alerta/warning” sobre orçamento (ex.: campo warning/message/budget_exceeded), exibir um Alert/Toast de atenção.
  - Se o backend retornar erro 400/422 por validação, exibir mensagem amigável com os campos (quando possível).

PÁGINAS/ROTAS (mínimas):

- / (Dashboard)
  - Seletor de mês/ano (padrão: mês atual)

  - Mostrar resumo: entradas, saídas, saldo

  - Mostrar gastos por categoria se existir no payload do backend (se não existir, mostrar apenas totais)

- /transactions
  - Listagem (tabela) + filtro básico por mês (opcional)

  - Form de criação (type INCOME|EXPENSE, amount, date, description, category_id)

- /categories
  - Listagem

  - Form de criação (name, parent_id opcional se existir)

- /budgets
  - Listagem

  - Form de criação (category_id, month (YYYY-MM), limit_amount)

PADRÕES DE UI/UX:

- Layout simples e consistente (header + navegação)

- Estados: loading, erro, vazio

- Feedback: toast/alert em ações (criou/erro/aviso)

- Responsivo básico (mobile ok)

INTEGRAÇÃO COM API:

- Criar um API client central (baseURL via variável de ambiente, ex.: VITE_API_URL ou equivalente definido no tech-stack).

- Services por domínio:
  - transactionsService (get/create)

  - categoriesService (get/create)

  - budgetsService (get/create)

  - reportsService (monthly)

- Normalizar erros (helper para extrair message/details do backend).

SEEDS / CATEGORIAS INICIAIS:

- O backend pode ter seed inicial de categorias. No frontend, apenas listar.

- Caso a lista venha vazia, permitir criar categoria e usar imediatamente no form de transação.

ENTREGÁVEIS:

- Estrutura completa do projeto do frontend

- Código organizado como definido na .ai/architecture.md

- README.md com:
  - Pré-requisitos

  - Como configurar API base URL

  - Como rodar (comando único)

  - Como apontar para o backend local

- Projeto funcionando (navegação + CRUD básico + dashboard chamando /reports/monthly)

RESTRIÇÕES:

- Não implemente features fora do MVP (editar/deletar, autenticação, exportação CSV/PDF, recorrência completa).

- Não invente endpoints além dos mínimos acima.

- Mudanças mínimas e pontuais: não crie complexidade desnecessária.

EXECUÇÃO:

Implemente e garanta que “rodar localmente” seja possível com os comandos definidos no tech stack (ex.: npm install + npm run dev).
