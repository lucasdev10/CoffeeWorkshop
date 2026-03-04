# 🐛 Guia de Debug do Cypress

## Técnicas de Debug

### 1. `cy.log()` - Log no Command Log

Aparece no painel esquerdo do Cypress Test Runner.

```typescript
cy.log('🔍 Valor da variável:', minhaVariavel);
cy.log('Estado atual:', { count: 5, active: true });
```

**Quando usar:** Para acompanhar o fluxo do teste visualmente.

---

### 2. `console.log()` - Log no DevTools

Aparece no console do navegador (F12).

```typescript
cy.get('body').then(($body) => {
  console.log('🔍 Body HTML:', $body.html());
  console.log('🔍 Elementos encontrados:', $body.find('.minha-classe').length);
});
```

**Quando usar:** Para inspecionar objetos complexos e HTML.

---

### 3. `cy.debug()` - Pausa com Debugger

Pausa a execução e abre o debugger do navegador.

```typescript
cy.get('.products-table').debug(); // Pausa aqui
```

**Como usar:**

1. Adicione `.debug()` onde quer pausar
2. Abra o DevTools (F12)
3. No console, digite `subject` para ver o elemento atual

---

### 4. `cy.pause()` - Pausa Interativa

Pausa o teste e permite avançar passo a passo.

```typescript
cy.visit('/admin/products');
cy.pause(); // Pausa aqui - clique em "Resume" para continuar
cy.get('.products-table').should('be.visible');
```

**Quando usar:** Para inspecionar o estado da aplicação manualmente.

---

### 5. `.then()` com Inspeção

Acessa o elemento jQuery para inspeção detalhada.

```typescript
cy.get('.products-table tbody tr').then(($rows) => {
  console.log('📊 Número de linhas:', $rows.length);
  console.log('📊 Primeira linha:', $rows.first().html());
  console.log('📊 Todas as linhas:', $rows.toArray());

  // Itera sobre cada linha
  $rows.each((index, row) => {
    console.log(`Linha ${index}:`, $(row).text());
  });
});
```

---

### 6. `cy.screenshot()` - Captura de Tela

Salva screenshot em `cypress/screenshots/`.

```typescript
cy.screenshot('debug-estado-inicial');
cy.get('.products-table').screenshot('debug-tabela');
```

**Quando usar:** Para análise posterior ou CI/CD.

---

### 7. `.invoke()` - Inspeciona Propriedades

Acessa propriedades e métodos de elementos.

```typescript
// Pega o texto
cy.get('.product-name')
  .invoke('text')
  .then((text) => {
    console.log('📝 Texto:', text);
  });

// Pega atributos
cy.get('input')
  .invoke('val')
  .then((value) => {
    console.log('📝 Valor do input:', value);
  });

// Pega propriedades
cy.get('.products-table tbody tr')
  .invoke('length')
  .then((length) => {
    console.log('📝 Número de linhas:', length);
  });
```

---

### 8. `.should()` com Callback

Faz asserções e debug ao mesmo tempo.

```typescript
cy.get('.products-table tbody tr').should(($rows) => {
  console.log('🔍 Rows:', $rows.length);
  expect($rows).to.have.length.greaterThan(0);
});
```

---

### 9. Cypress Studio (Modo Interativo)

Grava interações visualmente.

1. Adicione `experimentalStudio: true` no `cypress.config.ts`
2. Clique com botão direito no teste
3. Selecione "Add Commands to Test"

---

### 10. Time Travel Debugging

O Cypress automaticamente tira snapshots de cada comando.

**Como usar:**

1. Execute o teste
2. Passe o mouse sobre os comandos no Command Log
3. Veja o estado da aplicação naquele momento
4. Clique para fixar o snapshot

---

## Exemplo Prático: Debug de Tabela

```typescript
it('debug example', () => {
  cy.visit('/admin/products');

  // Aguarda a página carregar
  cy.get('h1').should('be.visible');

  // Debug: Verifica se a tabela existe
  cy.get('body').then(($body) => {
    const tableExists = $body.find('.products-table').length > 0;
    cy.log('🔍 Table exists?', tableExists);

    if (!tableExists) {
      cy.log('⚠️ Table not found! Available classes:');
      console.log('Available elements:', $body.find('[class*="table"]').toArray());
      cy.screenshot('table-not-found');
      return;
    }

    // Debug: Conta as linhas
    const rows = $body.find('.products-table tbody tr');
    cy.log('🔍 Rows found:', rows.length);

    // Debug: Mostra o conteúdo de cada linha
    rows.each((index, row) => {
      const text = $(row).text().trim();
      console.log(`Row ${index}:`, text);
    });

    // Debug: Mostra o HTML completo da tabela
    console.log('📋 Table HTML:', $body.find('.products-table').html());
  });
});
```

---

## Dicas Importantes

### ✅ Use seletores específicos

```typescript
// ❌ Ruim - muito genérico
cy.get('tr');

// ✅ Bom - específico
cy.get('.products-table tbody tr');
```

### ✅ Aguarde elementos carregarem

```typescript
// Aguarda a tabela aparecer antes de contar
cy.get('.products-table').should('be.visible');
cy.get('.products-table tbody tr').should('have.length.greaterThan', 0);
```

### ✅ Use data-cy para testes

```html
<!-- No HTML -->
<table data-cy="products-table">
  <tbody>
    <tr data-cy="product-row">
      ...
    </tr>
  </tbody>
</table>
```

```typescript
// No teste
cy.get('[data-cy="products-table"]');
cy.get('[data-cy="product-row"]');
```

### ✅ Verifique o estado antes de agir

```typescript
cy.get('body').then(($body) => {
  if ($body.find('.empty-state').length > 0) {
    cy.log('⚠️ No products found - empty state');
  } else {
    cy.log('✅ Products table found');
  }
});
```

---

## Comandos Úteis do DevTools

Quando usar `cy.debug()`, você pode usar no console:

```javascript
// Ver o elemento atual
subject;

// Ver todos os comandos Cypress disponíveis
Cypress;

// Ver o estado atual
Cypress.state();

// Ver configurações
Cypress.config();

// Ver variáveis de ambiente
Cypress.env();
```

---

## Modo Headless com Debug

Para ver logs no modo headless:

```bash
# Roda com logs detalhados
npx cypress run --spec "cypress/e2e/admin-product-management.cy.ts" --browser chrome

# Salva vídeo e screenshots
npx cypress run --spec "cypress/e2e/admin-product-management.cy.ts" --record
```

---

## Troubleshooting Comum

### Problema: Elemento não encontrado

```typescript
// Adicione wait ou should para aguardar
cy.get('.products-table', { timeout: 10000 }).should('exist');
```

### Problema: Timing issues

```typescript
// Use cy.wait() com cuidado
cy.wait(1000); // Aguarda 1 segundo

// Melhor: aguarde um elemento específico
cy.get('.loading-spinner').should('not.exist');
cy.get('.products-table').should('be.visible');
```

### Problema: Seletor errado

```typescript
// Debug: Liste todos os seletores disponíveis
cy.get('body').then(($body) => {
  const allClasses = [];
  $body.find('*').each((i, el) => {
    const classes = $(el).attr('class');
    if (classes) allClasses.push(classes);
  });
  console.log('All classes:', [...new Set(allClasses)]);
});
```
