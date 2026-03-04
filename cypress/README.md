# Testes E2E com Cypress

Este diretório contém os testes end-to-end (E2E) da aplicação usando Cypress.

## Estrutura dos Testes

### 📁 Arquivos de Teste

- **user-shopping-flow.cy.ts**: Testes do fluxo de compra do usuário
  - Acesso à página de produtos
  - Adicionar produtos ao carrinho
  - Atualização do badge do carrinho
  - Navegação para o carrinho
  - Verificação de totais
  - Atualização de quantidades
  - Remoção de itens

- **cart-calculations.cy.ts**: Testes de cálculos do carrinho
  - Cálculo de subtotal
  - Cálculo de impostos (10%)
  - Cálculo de frete
  - Frete grátis para pedidos acima de $100
  - Atualização de cálculos ao mudar quantidade
  - Múltiplos itens com diferentes quantidades

- **admin-product-management.cy.ts**: Testes de gerenciamento de produtos (Admin)
  - Acesso ao painel admin
  - Criação de novos produtos
  - Verificação de produtos na lista
  - Edição de produtos existentes
  - Exclusão de produtos

### 📁 Suporte

- **commands.ts**: Comandos customizados do Cypress
  - `cy.login(email, password)`: Faz login na aplicação
  - `cy.addProductToCart(index)`: Adiciona produto ao carrinho
  - `cy.clearCart()`: Limpa todos os itens do carrinho

- **fixtures/products.json**: Dados de teste
  - Credenciais de admin e usuário
  - Dados de produto de teste

## Como Executar

### Modo Interativo (recomendado para desenvolvimento)

```bash
npm run cypress
# ou
npm run e2e
```

### Modo Headless (para CI/CD)

```bash
npm run cypress:headless
# ou
npm run e2e:headless
```

## Pré-requisitos

1. A aplicação deve estar rodando em `http://localhost:4200`
2. Execute `npm start` em outro terminal antes de rodar os testes

## Cobertura dos Requisitos

✅ Usuário acessa página de produtos
✅ Usuário adiciona produto ao carrinho
✅ Badge do carrinho atualiza
✅ Usuário acessa o carrinho
✅ Total está correto
✅ Admin cria produto
✅ Produto aparece na lista

## Boas Práticas Implementadas

- Uso de seletores semânticos (classes, textos visíveis)
- Comandos customizados para reutilização
- Fixtures para dados de teste
- Testes isolados e independentes
- Verificações de estado antes de ações
- Aguardo de elementos antes de interagir
- Testes de cálculos com tolerância para decimais

## Observações

- Os testes assumem que há produtos cadastrados no sistema
- Para testes de admin, é necessário ter credenciais válidas
- Os testes de cálculo verificam a lógica de negócio (10% de imposto, frete grátis acima de $100)
