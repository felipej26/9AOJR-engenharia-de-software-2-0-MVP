Você deve implementar um MVP executável localmente com base nos arquivos de contexto presentes na pasta .ai/.

Objetivo:
Criar um sistema de controle financeiro pessoal funcional, com dados mockados e executável localmente.

Regras obrigatórias:

1. Seguir exatamente o que está definido em:
   - .ai/architecture.md
   - .ai/tech-stack.md
   - .ai/business-rules.md
   - .ai/standards.md

2. Implementar apenas o necessário para um MVP.

3. Utilizar:
   - Backend REST
   - Banco Postrgre
   - Dados mockados
   - Sem autenticação complexa (mock user fixo)

4. Implementar:

Entidades:

- User
- Transaction
- Category
- Budget
- Recurrence

Endpoints mínimos:

- POST /transactions
- GET /transactions
- POST /categories
- GET /categories
- POST /budgets
- GET /budgets
- GET /reports/monthly

Funcionalidades do MVP:

- Criar transação
- Listar transações
- Criar categoria
- Criar orçamento
- Relatório mensal simples
- Verificação básica de orçamento ao criar transação

Regras:

- Isolamento por usuário (mock user_id fixo)
- Exclusão lógica (campo deleted_at)
- Validação de dados obrigatórios
- Estrutura de camadas (controller, service, repository)

Extras para MVP:

- Seed inicial de categorias
- Script de inicialização
- README com instruções para rodar

Saída esperada:

- Estrutura completa do projeto
- Código organizado por camadas
- Instruções para executar localmente
- Projeto rodando com comando único (ex: npm run dev ou python app.py)
