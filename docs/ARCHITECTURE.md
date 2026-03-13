# 🏗️ Arquitetura do Projeto

## 📁 Estrutura de Pastas

```
src/app/
├── core/                          # Módulo Core (singleton services, guards, interceptors)
│   ├── data/                      # Mock data service
│   │   └── mock-data.service.ts
│   ├── guards/                    # Route guards
│   │   ├── auth.guard.ts
│   │   ├── role.guard.ts
│   │   └── unsaved-changes.guard.ts
│   ├── interceptors/              # HTTP interceptors
│   │   ├── auth.interceptor.ts
│   │   ├── error.interceptor.ts
│   │   ├── loading.interceptor.ts
│   │   └── cache.interceptor.ts
│   ├── layout/                    # Layout components (header, footer, sidebar)
│   │   └── header/
│   ├── services/                  # Global services
│   │   ├── loading.service.ts
│   │   ├── notification.service.ts
│   │   ├── theme.service.ts
│   │   └── logger.service.ts
│   ├── storage/                   # Storage abstraction
│   │   └── storage.ts
│   └── index.ts                   # Barrel exports
│
├── features/                      # Feature modules (feature-based architecture)
│   ├── products/
│   │   ├── components/            # Feature-specific components
│   │   │   ├── product-card/
│   │   │   └── product-form/
│   │   ├── models/                # Domain models & DTOs
│   │   │   └── product.model.ts
│   │   ├── pages/                 # Smart components (containers)
│   │   │   ├── product-list-page/
│   │   │   └── product-create-page/
│   │   ├── repositories/          # Data access layer
│   │   │   └── product.repository.ts
│   │   ├── store/                 # State management (NgRx)
│   │   │   └── product.store.ts
│   │   └── products.route.ts      # Feature routes
│   │
│   └── cart/
│       ├── models/
│       ├── pages/
│       ├── store/
│       └── cart.route.ts
│
├── shared/                        # Shared module (reusable components, pipes, directives)
│   ├── components/                # Dumb/Presentational components
│   │   ├── form-error/
│   │   └── input/
│   ├── directives/                # Custom directives
│   │   ├── click-outside.directive.ts
│   │   ├── lazy-load.directive.ts
│   │   ├── debounce-click.directive.ts
│   │   └── auto-focus.directive.ts
│   ├── pipes/                     # Custom pipes
│   │   ├── safe-html.pipe.ts
│   │   ├── time-ago.pipe.ts
│   │   ├── truncate.pipe.ts
│   │   ├── filter.pipe.ts
│   │   └── highlight.pipe.ts
│   ├── validators/                # Custom form validators
│   │   └── custom-validators.ts
│   ├── models/                    # Shared models/interfaces
│   │   ├── api-response.model.ts
│   │   └── user.model.ts
│   ├── enums/                     # Enumerations
│   │   ├── order-status.enum.ts
│   │   └── payment-method.enum.ts
│   ├── utils/                     # Utility functions
│   │   ├── date.utils.ts
│   │   ├── string.utils.ts
│   │   └── array.utils.ts
│   └── index.ts                   # Barrel exports
│
├── app.config.ts                  # Application configuration
├── app.routes.ts                  # Root routes
└── app.ts                         # Root component
```

## 🎯 Princípios Arquiteturais

### 1. **Feature-Based Architecture**

- Cada feature é auto-contida com seus próprios componentes, serviços e estado
- Facilita escalabilidade e manutenção
- Permite lazy loading por feature

### 2. **Clean Architecture**

- **Presentation Layer**: Components e Pages
- **Business Logic Layer**: Stores e Services
- **Data Access Layer**: Repositories
- **Domain Layer**: Models e DTOs

### 3. **SOLID Principles**

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependa de abstrações, não de implementações

### 4. **Design Patterns**

#### Repository Pattern

```typescript
// Abstrai a camada de dados
export class ProductRepository {
  findAll(): Observable<Product[]>;
  findById(id: string): Observable<Product>;
  create(dto: CreateProductDto): Observable<Product>;
  update(id: string, dto: UpdateProductDto): Observable<Product>;
  delete(id: string): Observable<void>;
}
```

#### Store Pattern (State Management)

```typescript
// Gerencia estado com NgRx
export const productFeature = createFeature({
  name: 'product',
  reducer: createReducer(initialState, ...),
  extraSelectors: ({ selectProducts }) => ({
    selectFilteredProducts: ...
  })
});
```

#### Facade Pattern

```typescript
// MockDataService abstrai complexidade do mock
export class MockDataService {
  get<T>(key: string): Observable<T>;
  post<T>(key: string, item: T): Observable<T>;
}
```

## 📦 Camadas da Aplicação

### Core Layer

**Responsabilidade**: Funcionalidades singleton usadas em toda aplicação

- Guards para proteção de rotas
- Interceptors para requisições HTTP
- Serviços globais (Loading, Notification, Theme, Logger)
- Storage abstraction

### Features Layer

**Responsabilidade**: Módulos de negócio isolados

Cada feature contém:

- **Components**: Componentes específicos da feature
- **Pages**: Smart components (containers)
- **Models**: Domain models e DTOs
- **Repositories**: Acesso a dados
- **Store**: State management
- **Routes**: Rotas da feature

### Shared Layer

**Responsabilidade**: Código reutilizável entre features

- Components genéricos
- Pipes para transformação de dados
- Directives para comportamentos
- Validators para formulários
- Utils para funções auxiliares
- Models compartilhados

## 🔄 Fluxo de Dados

```
Component (UI)
    ↓
Store (State Management)
    ↓
Repository (Data Access)
    ↓
MockDataService / HttpClient (API)
```

## 🚀 Como Usar

### Guards

```typescript
// app.routes.ts
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes')
}
```

### Interceptors

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor, cacheInterceptor]),
    ),
  ],
};
```

### Pipes

```typescript
// template
{{ longText | truncate:100 }}
{{ date | timeAgo }}
<div [innerHTML]="html | safeHtml"></div>
```

### Directives

```typescript
// template
<div (clickOutside)="close()">...</div>
<img [lazyLoad]="imageUrl">
<button (debounceClick)="search()" [debounceTime]="500">Search</button>
```

### Validators

```typescript
// component
this.form = new FormGroup({
  email: new FormControl('', [CustomValidators.email()]),
  password: new FormControl('', [CustomValidators.strongPassword()]),
  cpf: new FormControl('', [CustomValidators.cpf()]),
});
```

### Utils

```typescript
// component
import { DateUtils, StringUtils, ArrayUtils } from '@app/shared';

const formatted = DateUtils.format(new Date(), 'dd/MM/yyyy');
const slug = StringUtils.slugify('Hello World');
const unique = ArrayUtils.unique([1, 2, 2, 3]);
```

## 📝 Convenções

### Nomenclatura

- **Components**: `*.component.ts` (PascalCase + Component suffix)
- **Services**: `*.service.ts` (PascalCase + Service suffix)
- **Guards**: `*.guard.ts` (camelCase + guard suffix)
- **Interceptors**: `*.interceptor.ts` (camelCase + interceptor suffix)
- **Pipes**: `*.pipe.ts` (PascalCase + Pipe suffix)
- **Directives**: `*.directive.ts` (PascalCase + Directive suffix)

### Imports

Use barrel exports para importações limpas:

```typescript
// ❌ Ruim
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
import { TimeAgoPipe } from '@app/shared/pipes/time-ago.pipe';

// ✅ Bom
import { SafeHtmlPipe, TimeAgoPipe } from '@app/shared';
```

## 🎓 Boas Práticas

1. **OnPush Change Detection**: Use em todos os componentes
2. **Signal-based APIs**: Use `input()` e `output()` em vez de decorators
3. **Standalone Components**: Todos os componentes são standalone
4. **Type Safety**: Sempre defina tipos explícitos
5. **Immutability**: Use operadores imutáveis (spread, map, filter)
6. **Error Handling**: Sempre trate erros em Observables
7. **Loading States**: Sempre mostre feedback visual
8. **Accessibility**: Use ARIA labels e semântica HTML correta

## 🔧 Extensibilidade

Para adicionar novas features:

1. Crie pasta em `features/`
2. Siga a estrutura: `components/`, `pages/`, `models/`, `repositories/`, `store/`
3. Crie arquivo de rotas `*.routes.ts`
4. Registre no `app.routes.ts` com lazy loading

Para adicionar novos shared components:

1. Crie em `shared/components/`
2. Exporte no `shared/index.ts`
3. Use em qualquer feature

---

**Projeto preparado para crescimento enterprise! 🚀**
