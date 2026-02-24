Você é um arquiteto de software pragmático especializado em construir MVPs enxutos, simples e evolutivos.

Sua tarefa é gerar os seguintes quatro arquivos de contexto dentro da pasta `.ai/`, com base no sistema descrito abaixo.

O sistema deve ser tratado como um MVP (Minimum Viable Product).

.ai/
├── standards.md
├── architecture.md
├── tech-stack.md
└── business-rules.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 OBJETIVO DO SISTEMA (MVP)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sistema: Controle Financeiro Pessoal

Escopo MVP:

- Cadastro de receitas e despesas
- Categorias personalizadas
- Recorrências simples (mensal)
- Orçamento mensal por categoria
- Relatório mensal básico
- Autenticação via JWT
- Backend Node.js
- Banco PostgreSQL
- Frontend React
- Scheduler simples para recorrências

⚠️ IMPORTANTE:

- Não utilizar microserviços
- Não utilizar arquitetura complexa
- Não aplicar DDD avançado
- Não adicionar features além do necessário
- Focar em simplicidade, clareza e rapidez de implementação

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 SUA TAREFA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Gere o conteúdo completo dos quatro arquivos abaixo.

Cada arquivo deve ser escrito em Markdown.

O conteúdo será utilizado para guiar uma LLM que irá gerar o código.
Seja direto, técnico e objetivo.
Evite complexidade desnecessária.
Priorize decisões simples.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 1️⃣ standards.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Defina padrões simples e práticos:

- Estrutura de pastas enxuta
- Organização em camadas básicas (Controller, Service, Repository)
- Convenção de nomes
- Padrão de resposta HTTP
- Tratamento básico de erros
- Validação simples
- Uso obrigatório de isolamento por usuário (user_id)
- Soft delete apenas onde realmente necessário

Evite padrões avançados ou arquitetura sofisticada.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 2️⃣ architecture.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Descreva:

- Arquitetura monolítica simples
- Separação básica de responsabilidades
- Fluxo padrão de requisição HTTP
- Como funcionará o scheduler de recorrência (simples)
- Como o orçamento será validado
- Modelo básico de autenticação

Inclua:

- Diagrama Mermaid simples da arquitetura
- Diagrama simples de fluxo de request

Não inclua arquitetura complexa.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 3️⃣ tech-stack.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Defina stack concreta e simples:

Frontend:

- React
- Biblioteca HTTP
- Gerenciamento simples de estado

Backend:

- Node.js
- Framework (ex: Express)
- ORM (ex: Prisma ou similar)
- JWT para autenticação
- Biblioteca de validação simples

Banco:

- PostgreSQL
- Migrations simples
- Índices essenciais

Infra:

- Variáveis de ambiente
- Execução local
- Scheduler básico (ex: node-cron)

Evite soluções enterprise.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 4️⃣ business-rules.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Defina apenas as regras essenciais do MVP:

Transações:

- Receita e despesa
- Não permitir valor negativo
- Pertencem a um usuário

Recorrências:

- Apenas mensal
- Não duplicar execução
- Gerar transações automaticamente

Orçamentos:

- Um orçamento por categoria por mês
- Apenas meses atuais ou futuros
- Alerta simples quando ultrapassado

Categorias:

- Pertencem ao usuário
- Apenas um nível (sem múltiplos níveis complexos)

Relatórios:

- Soma por mês
- Agrupamento por categoria

Evite regras complexas ou versionamento.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 FORMATO DA RESPOSTA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A resposta deve conter exatamente quatro seções:

# .ai/standards.md

(conteúdo)

# .ai/architecture.md

(conteúdo)

# .ai/tech-stack.md

(conteúdo)

# .ai/business-rules.md

(conteúdo)

Não inclua comentários extras.
Não explique decisões.
Apenas gere os quatro arquivos.
