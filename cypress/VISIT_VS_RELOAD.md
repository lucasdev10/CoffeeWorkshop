# 🔄 cy.visit() vs cy.reload() - Diferenças

## cy.visit()

### O que faz?

Navega para uma URL, mas **não recarrega a aplicação** se você já está no mesmo domínio.

```typescript
cy.visit('/admin/products'); // Está em localhost:4200
cy.visit('/products'); // Navega via Angular Router - NÃO recarrega!
```

### Como funciona?

```
[Aplicação Angular já carregada]
         ↓
cy.visit('/products')
         ↓
[Angular Router navega]
         ↓
[Componente muda, mas Store permanece a mesma]
         ↓
[ProductStore NÃO é recriada]
         ↓
[constructor() NÃO executa novamente]
```

### Equivalente no navegador

É como clicar em um link interno da aplicação - usa o router, não recarrega.

---

## cy.reload()

### O que faz?

**Recarrega completamente a página**, reiniciando toda a aplicação Angular.

```typescript
cy.reload(); // F5 no navegador
```

### Como funciona?

```
[Aplicação Angular em memória]
         ↓
cy.reload()
         ↓
[Navegador recarrega a página]
         ↓
[Angular reinicia do zero]
         ↓
[Todos os services são recriados]
         ↓
[ProductStore é recriada]
         ↓
[constructor() executa novamente]
         ↓
[loadProducts() busca dados atualizados]
```

### Equivalente no navegador

É como apertar F5 ou Ctrl+R.

---

## 🎯 Comparação Prática

### Cenário: Criar produto e ver na lista

#### ❌ Não funciona (sem reload)

```typescript
cy.visit('/admin/products/create');
// ... cria produto ...
cy.visit('/products'); // ❌ Apenas navega via router
// Store ainda tem dados antigos!
cy.contains(newProduct).should('be.visible'); // ❌ FALHA
```

**Por que falha?**

- `cy.visit('/products')` usa o Angular Router
- `ProductStore` não é recriada
- `constructor()` não executa
- Lista mostra produtos antigos

#### ✅ Funciona (com reload)

```typescript
cy.visit('/admin/products/create');
// ... cria produto ...
cy.reload(); // ✅ Recarrega a aplicação
cy.visit('/products'); // ✅ Agora navega com store limpa
cy.contains(newProduct).should('be.visible'); // ✅ SUCESSO
```

**Por que funciona?**

- `cy.reload()` reinicia a aplicação
- `ProductStore` é recriada
- `constructor()` executa
- `loadProducts()` busca dados atualizados

---

## 📊 Tabela Comparativa

| Aspecto              | cy.visit()     | cy.reload()   |
| -------------------- | -------------- | ------------- |
| Recarrega página?    | ❌ Não         | ✅ Sim        |
| Reinicia Angular?    | ❌ Não         | ✅ Sim        |
| Recria services?     | ❌ Não         | ✅ Sim        |
| Executa constructor? | ❌ Não         | ✅ Sim        |
| Usa Angular Router?  | ✅ Sim         | ❌ Não        |
| Velocidade           | ⚡ Rápido      | 🐢 Mais lento |
| Equivalente          | Clicar em link | Apertar F5    |

---

## 🔍 Como Verificar?

### Teste 1: Console log no constructor

```typescript
// product.store.ts
export class ProductStore {
  constructor() {
    console.log('🏗️ ProductStore constructor called!');
    this.loadProducts();
  }
}
```

**Com cy.visit():**

```typescript
cy.visit('/admin'); // Console: 🏗️ ProductStore constructor called!
cy.visit('/products'); // Console: (nada - constructor não executa)
```

**Com cy.reload():**

```typescript
cy.visit('/admin'); // Console: 🏗️ ProductStore constructor called!
cy.reload(); // Console: 🏗️ ProductStore constructor called!
cy.visit('/products'); // Console: (nada - mas store foi recriada no reload)
```

### Teste 2: Verificar instância da store

```typescript
cy.window().then((win) => {
  const store1 = win['ng'].getInjector().get('ProductStore');
  console.log('Store instance 1:', store1);

  cy.visit('/products');

  cy.window().then((win2) => {
    const store2 = win2['ng'].getInjector().get('ProductStore');
    console.log('Store instance 2:', store2);
    console.log('Same instance?', store1 === store2); // true - mesma instância!
  });
});
```

---

## 💡 Quando Usar Cada Um?

### Use cy.visit() quando:

- ✅ Quer navegar entre páginas rapidamente
- ✅ Não precisa reiniciar a aplicação
- ✅ Está testando navegação/routing
- ✅ Dados em cache são aceitáveis

```typescript
it('should navigate between pages', () => {
  cy.visit('/products');
  cy.visit('/cart');
  cy.visit('/checkout');
  // Rápido, testa navegação
});
```

### Use cy.reload() quando:

- ✅ Precisa reiniciar a aplicação
- ✅ Precisa recriar services/stores
- ✅ Precisa limpar cache/estado
- ✅ Dados devem ser recarregados do backend

```typescript
it('should see fresh data after reload', () => {
  cy.visit('/products');
  // ... modifica dados no backend ...
  cy.reload(); // ✅ Força recarga dos dados
  cy.visit('/products');
  // Agora vê dados atualizados
});
```

---

## 🎬 Exemplos Práticos

### Exemplo 1: Teste de navegação (sem reload)

```typescript
it('should navigate through app', () => {
  cy.visit('/');
  cy.contains('Products').click();
  cy.url().should('include', '/products');

  cy.contains('Cart').click();
  cy.url().should('include', '/cart');

  // Rápido, não precisa reload
});
```

### Exemplo 2: Teste com modificação de dados (com reload)

```typescript
it('should create product and see in list', () => {
  // Cria produto
  cy.visit('/admin/products/create');
  cy.get('input[name="name"]').type('New Product');
  cy.contains('button', 'Save').click();

  // ✅ Reload para reiniciar store
  cy.reload();

  // Navega para lista pública
  cy.visit('/products');

  // Agora vê o produto novo
  cy.contains('New Product').should('be.visible');
});
```

### Exemplo 3: Teste de autenticação (com reload)

```typescript
it('should logout and clear user data', () => {
  cy.visit('/dashboard');
  cy.contains('Logout').click();

  // ✅ Reload para limpar estado de autenticação
  cy.reload();

  // Verifica que foi redirecionado para login
  cy.url().should('include', '/login');
});
```

---

## 🚨 Armadilhas Comuns

### Armadilha 1: Achar que cy.visit() recarrega

```typescript
// ❌ ERRADO - Não funciona
cy.visit('/admin/products/create');
createProduct();
cy.visit('/products'); // ❌ Não recarrega store!
cy.contains(newProduct).should('be.visible'); // ❌ Falha
```

### Armadilha 2: Usar reload desnecessariamente

```typescript
// ❌ DESNECESSÁRIO - Muito lento
cy.visit('/products');
cy.reload(); // ❌ Não precisa
cy.visit('/cart');
cy.reload(); // ❌ Não precisa
```

### Armadilha 3: Reload no lugar errado

```typescript
// ❌ ERRADO - Recarrega antes de salvar
cy.contains('button', 'Save').click();
cy.reload(); // ❌ Pode recarregar antes de salvar!
cy.visit('/products');

// ✅ CORRETO - Aguarda salvar primeiro
cy.contains('button', 'Save').click();
cy.url().should('include', '/success'); // Aguarda confirmação
cy.reload(); // ✅ Agora pode recarregar
cy.visit('/products');
```

---

## 🎯 Solução Completa para o Problema

```typescript
it('should create product and verify in public list', () => {
  // 1. Cria produto
  cy.visit('/admin/products/create');
  const productName = `Test ${Date.now()}`;
  fillProductForm(productName);
  cy.contains('button', 'Register').click();

  // 2. Aguarda confirmação (importante!)
  cy.url().should('include', '/admin/products');
  cy.url().should('not.include', '/create');
  cy.contains(productName).should('be.visible');

  // 3. ✅ RELOAD - Reinicia aplicação e store
  cy.reload();

  // 4. Navega para lista pública
  cy.visit('/products');

  // 5. Aguarda carregar
  cy.contains('h1', 'Our Products').should('be.visible');
  cy.get('mat-spinner').should('not.exist');

  // 6. Verifica produto
  cy.contains(productName, { timeout: 10000 }).should('be.visible');
});
```

---

## 📝 Resumo

**cy.visit('/url')**

- Navega via Angular Router
- NÃO recarrega a aplicação
- NÃO recria services
- Rápido

**cy.reload()**

- Recarrega a página (F5)
- Reinicia a aplicação
- Recria todos os services
- Mais lento, mas necessário para dados frescos

**Regra de ouro:**

- Use `cy.visit()` para navegação normal
- Use `cy.reload()` quando precisar reiniciar a aplicação e recarregar dados
