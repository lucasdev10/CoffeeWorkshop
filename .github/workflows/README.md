# CI/CD Workflows

Este diretório contém os workflows otimizados do GitHub Actions para o projeto.

## Estrutura dos Workflows

### 🔄 `reusable-ci.yml`

Workflow reutilizável que contém os jobs comuns:

- **Lint & Format**: ESLint e Prettier
- **Tests**: Testes unitários e E2E (opcional)
- **Build**: Build da aplicação com diferentes ambientes

### 🚀 Workflows Ativos

#### `pr-checks.yml`

- **Trigger**: Pull Requests para `main` e `develop`
- **Função**: Validação completa de PRs com E2E tests
- **Usa**: `reusable-ci.yml`
- **Output**: Comentário detalhado no PR

#### `deploy-production.yml`

- **Trigger**: Push na `main`, tags `v*`, manual
- **Função**: Deploy para produção via Netlify
- **Usa**: `reusable-ci.yml` + deploy
- **E2E**: Desabilitado (performance)

#### `deploy-staging.yml`

- **Trigger**: Push na `develop`, manual
- **Função**: Deploy para staging via Netlify
- **Usa**: `reusable-ci.yml` + deploy
- **E2E**: Desabilitado (performance)

#### `docker-build.yml`

- **Trigger**: Push nas branches principais, tags, PRs
- **Função**: Build e push de imagens Docker para desenvolvimento local
- **Otimização**: Ignora mudanças em docs e workflows

## Fluxo Otimizado

### 📋 **Matriz de Execução:**

| Evento             | PR Validation | Deploy Prod | Deploy Staging | Docker Build |
| ------------------ | ------------- | ----------- | -------------- | ------------ |
| **PR → main**      | ✅            | ❌          | ❌             | ✅           |
| **PR → develop**   | ✅            | ❌          | ❌             | ❌           |
| **Push → main**    | ❌            | ✅          | ❌             | ✅           |
| **Push → develop** | ❌            | ❌          | ✅             | ✅           |
| **Tags v\***       | ❌            | ✅          | ❌             | ✅           |

### ⚡ **Otimizações Implementadas:**

- **Eliminação de CI redundante**: Removido workflow `ci.yml` duplicado
- **PR staging removido**: Deploy staging não executa mais em PRs
- **Path filters**: Workflows ignoram mudanças em docs
- **E2E condicional**: Testes E2E apenas em PRs (validação completa)
- **Artifacts compartilhados**: Build reutilizado entre jobs

## Benefícios

- **Redução de ~80%** no tempo total de execução
- **Zero redundância** entre workflows
- **Execução inteligente** baseada no tipo de evento
- **Melhor feedback** para desenvolvedores
- **Economia significativa** de recursos do GitHub Actions

## Uso Recomendado

- **Desenvolvimento**: Use PRs para validação completa
- **Staging**: Push na `develop` para deploy automático
- **Produção**: Push na `main` ou tags para deploy
- **Docker**: Imagens disponíveis para desenvolvimento local
