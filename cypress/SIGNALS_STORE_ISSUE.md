# 🔄 Problema: Signals e Store não atualizam no Cypress

## O Problema

```typescript
// ❌ Não funciona - produto não aparece na lista pública
it('test', () => {
  cy.visit('/admin/products/create');
  // ... cria produto ...
  cy.visit('/products'); // Produto não aparece!
});
```

## Por que isso acontece?

### 1. Store Singleton com Constructor Loading

```typescript
@Injectable({ providedIn: 'root' })
export class ProductStore {
  constructor() {
    // ⚠️ Carrega produtos apenas UMA VEZ na inicialização
    this.loadProducts();
  }
}
```

**O fluxo:**

1. Aplicação inicia → `ProductStore` é criada → `constructor()` carrega produtos
2. Você cria um novo produto no admin
3. Navega para `/products` → Store JÁ EXISTE → `constructor()` NÃO executa novamente
4. Lista mostra produtos antigos (sem o novo)

### 2. Angular não reinicializa services entre navegações

```
[App Start] → ProductStore criada → loadProducts() → [produtos: A, B, C]
                    ↓
[Cria produto D] → produtos no backend: [A, B, C, D]
                    ↓
[Navega /products] → ProductStore AINDA tem [A, B, C] em memória
                    ↓
                  Produto D não aparece! ❌
```

## ✅ Soluções

### Solução 1: Reload completo da página (Recomendado para testes)

```typescript
it('should create and see product', () => {
  // Cria produto
  cy.visit('/admin/products/create');
  // ... preenche formulário ...
  cy.contains('button', 'Register').click();

  // ✅ Força reload completo - reinicializa toda a aplicação
  cy.reload();
  cy.visit('/products');

  // Agora o produto aparece!
  cy.contains(productName).should('be.visible');
});
```

**Por que funciona:**

- `cy.reload()` reinicia a aplicação Angular
- `ProductStore` é recriada
- `constructor()` executa novamente
- `loadProducts()` busca dados atualizados do backend

### Solução 2: Interceptar e mockar a resposta

```typescript
it('should create and see product', () => {
  // Intercepta a chamada de produtos
  cy.intercept('GET', '/api/products', (req) => {
    req.reply((res) => {
      // Adiciona o novo produto na resposta
      res.body.push(newProduct);
      return res;
    });
  }).as('getProducts');

  cy.visit('/products');
  cy.wait('@getProducts');
  cy.contains(productName).should('be.visible');
});
```

### Solução 3: Aguardar com timeout maior

```typescript
it('should create and see product', () => {
  // ... cria produto ...

  cy.visit('/products');

  // Aguarda mais tempo para a store atualizar
  cy.contains(productName, { timeout: 10000 }).should('be.visible');
});
```

**⚠️ Atenção:** Isso pode não funcionar se a store não recarrega automaticamente!

### Solução 4: Modificar a aplicação (Melhor para produção)

#### Opção A: Recarregar na navegação

```typescript
// product-list-page.component.ts
export class ProductListPageComponent implements OnInit {
  private readonly productStore = inject(ProductStore);

  ngOnInit() {
    // ✅ Recarrega produtos toda vez que a página é acessada
    this.productStore.loadProducts();
  }
}
```

#### Opção B: Usar Router Events

```typescript
// product.store.ts
export class ProductStore {
  private readonly router = inject(Router);

  constructor() {
    this.loadProducts();

    // ✅ Recarrega quando navega para /products
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.url.includes('/products')),
      )
      .subscribe(() => {
        this.loadProducts();
      });
  }
}
```

#### Opção C: Usar Signals com effect

```typescript
// product.store.ts
export class ProductStore {
  private readonly refreshTrigger = signal(0);

  constructor() {
    effect(() => {
      // ✅ Recarrega quando refreshTrigger muda
      this.refreshTrigger();
      this.loadProducts();
    });
  }

  refresh() {
    this.refreshTrigger.update((v) => v + 1);
  }
}
```

## 🎯 Recomendação para Testes E2E

Para testes Cypress, use **Solução 1** (reload):

```typescript
it('should create product and see in public list', () => {
  // 1. Cria produto
  cy.visit('/admin/products/create');
  fillProductForm();
  cy.contains('button', 'Register').click();

  // 2. Aguarda confirmação
  cy.url().should('include', '/admin/products');
  cy.contains(productName).should('be.visible');

  // 3. ✅ Força reload completo
  cy.reload();

  // 4. Navega para lista pública
  cy.visit('/products');

  // 5. Aguarda carregar
  cy.contains('h1', 'Our Products').should('be.visible');
  cy.get('mat-spinner').should('not.exist');
  cy.get('app-product-card').should('have.length.greaterThan', 0);

  // 6. Verifica produto
  cy.contains(productName, { timeout: 10000 }).should('be.visible');
});
```

## 🔍 Como Debugar

### 1. Verifique se o produto foi criado no backend

```typescript
cy.request('GET', '/api/products').then((response) => {
  console.log('Products in backend:', response.body);
  const exists = response.body.some((p) => p.name === productName);
  cy.log('Product exists in backend?', exists);
});
```

### 2. Verifique o estado da store

```typescript
cy.window().then((win) => {
  // Acessa a store através do Angular
  const store = win['ng'].getInjector().get('ProductStore');
  console.log('Store products:', store.products());
});
```

### 3. Verifique chamadas HTTP

```typescript
// Intercepta todas as chamadas
cy.intercept('GET', '/api/products').as('getProducts');

cy.visit('/products');
cy.wait('@getProducts').then((interception) => {
  console.log('Products loaded:', interception.response.body);
});
```

## 📊 Comparação de Soluções

| Solução        | Prós                                                      | Contras                                   | Quando usar     |
| -------------- | --------------------------------------------------------- | ----------------------------------------- | --------------- |
| `cy.reload()`  | ✅ Simples<br>✅ Confiável<br>✅ Testa comportamento real | ⚠️ Mais lento                             | Testes E2E      |
| Intercept/Mock | ✅ Rápido<br>✅ Controle total                            | ❌ Não testa backend<br>❌ Complexo       | Testes isolados |
| Timeout maior  | ✅ Simples                                                | ❌ Pode não funcionar<br>❌ Testes lentos | Último recurso  |
| Modificar app  | ✅ Resolve na raiz<br>✅ Melhora UX                       | ⚠️ Requer mudança de código               | Produção        |

## 💡 Dicas

### 1. Sempre aguarde confirmação antes de navegar

```typescript
// ✅ Bom
cy.contains('button', 'Register').click();
cy.url().should('include', '/admin/products'); // Aguarda redirect
cy.contains(productName).should('be.visible'); // Aguarda produto aparecer
cy.reload(); // Agora pode recarregar

// ❌ Ruim
cy.contains('button', 'Register').click();
cy.reload(); // Pode recarregar antes do produto ser criado!
```

### 2. Use timeouts generosos

```typescript
// Dá tempo para a store carregar
cy.contains(productName, { timeout: 10000 }).should('be.visible');
cy.get('app-product-card', { timeout: 10000 }).should('exist');
```

### 3. Aguarde spinners desaparecerem

```typescript
cy.get('mat-spinner').should('not.exist'); // Aguarda loading terminar
cy.get('app-product-card').should('exist'); // Aguarda conteúdo aparecer
```

## 🚀 Exemplo Completo

```typescript
describe('Product Creation Flow', () => {
  it('should create product and verify in all views', () => {
    // Login
    cy.visit('/auth/login');
    cy.get('input[type="email"]').type('admin@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Cria produto
    cy.visit('/admin/products/create');
    const productName = `Test ${Date.now()}`;
    cy.get('input[name="name"]').type(productName);
    cy.get('textarea[name="description"]').type('Description');
    cy.get('input[name="price"]').type('99.99');
    cy.contains('button', 'Register').click();

    // Verifica na lista admin
    cy.url().should('include', '/admin/products');
    cy.contains(productName).should('be.visible');

    // ✅ Força reload para reinicializar store
    cy.reload();

    // Verifica na lista pública
    cy.visit('/products');
    cy.contains('h1', 'Our Products').should('be.visible');
    cy.get('mat-spinner').should('not.exist');
    cy.contains(productName, { timeout: 10000 }).should('be.visible');

    // Verifica via API
    cy.request('GET', '/api/products').then((response) => {
      const product = response.body.find((p) => p.name === productName);
      expect(product).to.exist;
      cy.log('✅ Product exists in backend');
    });
  });
});
```

## 🎓 Resumo

**Problema:** Store carrega dados apenas no `constructor()`, não recarrega automaticamente

**Causa:** Angular mantém services singleton entre navegações

**Solução para testes:** Use `cy.reload()` antes de navegar para forçar reinicialização

**Solução para produção:** Implemente recarga automática na navegação ou use eventos do router
