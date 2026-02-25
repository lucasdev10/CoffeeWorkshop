# 🚀 Guia de Desenvolvimento

## 📋 Pré-requisitos

- Node.js 20+
- npm 10+
- Angular CLI 21+

## 🛠️ Setup do Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start

# Build para produção
npm run build

# Rodar linter
npm run lint

# Formatar código
npm run format
```

## 🏗️ Estrutura do Projeto

Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para detalhes completos da arquitetura.

## 📝 Convenções de Código

### Nomenclatura

- **Components**: `*.component.ts` - PascalCase + Component suffix
- **Services**: `*.service.ts` - PascalCase + Service suffix
- **Guards**: `*.guard.ts` - camelCase + guard suffix
- **Pipes**: `*.pipe.ts` - PascalCase + Pipe suffix
- **Models**: `*.model.ts` - PascalCase
- **Enums**: `*.enum.ts` - PascalCase

### Imports

Use barrel exports:

```typescript
// ✅ Bom
import { SafeHtmlPipe, TimeAgoPipe } from '@app/shared';

// ❌ Ruim
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
```

### Signals

Use signal-based APIs:

```typescript
// ✅ Bom - Signal-based
export class MyComponent {
  data = input.required<string>();
  change = output<string>();
}

// ❌ Evite - Decorator-based
export class MyComponent {
  @Input() data!: string;
  @Output() change = new EventEmitter<string>();
}
```

## 🎯 Criando Nova Feature

```bash
# 1. Criar estrutura de pastas
src/app/features/minha-feature/
├── components/
├── models/
├── pages/
├── repositories/
├── store/
└── minha-feature.routes.ts

# 2. Criar models
# minha-feature.model.ts

# 3. Criar repository
# minha-feature.repository.ts

# 4. Criar store
# minha-feature.store.ts

# 5. Criar componentes e páginas

# 6. Registrar rotas
# app.routes.ts
```

### Exemplo de Feature Completa

```typescript
// 1. Model
export interface MyEntity {
  id: string;
  name: string;
  createdAt: Date;
}

// 2. Repository
@Injectable({ providedIn: 'root' })
export class MyEntityRepository {
  private mockData = inject(MockDataService);

  findAll(): Observable<MyEntity[]> {
    return this.mockData.get<MyEntity[]>('my-entities');
  }
}

// 3. Store
@Injectable({ providedIn: 'root' })
export class MyEntityStore {
  private repository = inject(MyEntityRepository);
  private state = signal<MyEntity[]>([]);

  readonly entities = computed(() => this.state());

  loadEntities(): void {
    this.repository.findAll().subscribe({
      next: (entities) => this.state.set(entities),
      error: (error) => console.error(error),
    });
  }
}

// 4. Component
@Component({
  selector: 'app-my-list',
  template: `
    @for (entity of entities(); track entity.id) {
      <div>{{ entity.name }}</div>
    }
  `,
})
export class MyListComponent {
  private store = inject(MyEntityStore);
  readonly entities = this.store.entities;

  constructor() {
    this.store.loadEntities();
  }
}
```

## 🔧 Ferramentas e Utilitários

### Performance Tracking

```typescript
import { TrackPerformance } from '@app/shared/decorators';

export class MyService {
  @TrackPerformance('loadData')
  loadData(): void {
    // Automaticamente loga tempo de execução
  }
}
```

### Memoização

```typescript
import { Memoize } from '@app/shared/decorators';

export class MyService {
  @Memoize()
  expensiveCalculation(n: number): number {
    // Resultado é cacheado
  }
}
```

### Debounce/Throttle

```typescript
import { Debounce, Throttle } from '@app/shared/decorators';

export class MyComponent {
  @Debounce(300)
  onSearch(term: string): void {
    // Executado apenas após 300ms sem novas chamadas
  }

  @Throttle(1000)
  onScroll(): void {
    // Executado no máximo 1x por segundo
  }
}
```

### Retry Strategy

```typescript
import { retryStrategy } from '@app/core/operators';

this.http
  .get('/api/data')
  .pipe(retryStrategy({ maxRetries: 3, delay: 1000, backoff: true }))
  .subscribe();
```

## 📊 Analytics

```typescript
import { AnalyticsService } from '@app/core';

export class MyComponent {
  private analytics = inject(AnalyticsService);

  onButtonClick(): void {
    this.analytics.trackEvent({
      category: 'User',
      action: 'Click Button',
      label: 'Submit Form',
    });
  }
}
```

## 🔍 SEO

```typescript
import { SeoService } from '@app/core';

export class ProductDetailComponent {
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateSeo({
      title: 'Product Name - Coffee Workshop',
      description: 'Product description',
      image: 'product-image.jpg',
      type: 'product',
    });

    this.seo.addProductStructuredData({
      name: 'Product Name',
      description: 'Description',
      image: 'image.jpg',
      price: 29.99,
      currency: 'USD',
      availability: 'InStock',
    });
  }
}
```

## 🎨 Temas

```typescript
import { ThemeService } from '@app/core';

export class HeaderComponent {
  private theme = inject(ThemeService);

  toggleTheme(): void {
    this.theme.toggleTheme();
  }
}
```

## 🔐 Guards

```typescript
// Proteger rota
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes')
}

// Prevenir saída com mudanças não salvas
{
  path: 'edit/:id',
  canDeactivate: [unsavedChangesGuard],
  component: EditComponent
}
```

## 📦 Build e Deploy

### Development

```bash
npm start
# Acesse http://localhost:4200
```

### Production

```bash
npm run build
# Arquivos em dist/
```

### Análise de Bundle

```bash
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/stats.json
```

## 🐛 Debug

### Chrome DevTools

- Angular DevTools extension
- Performance profiling
- Network throttling

### VS Code

- Breakpoints
- Debug configuration em `.vscode/launch.json`

## 📚 Recursos

- [Angular Docs](https://angular.dev)
- [Angular Material](https://material.angular.io)
- [RxJS](https://rxjs.dev)
- [TypeScript](https://www.typescriptlang.org)

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit suas mudanças: `git commit -m 'Add: minha feature'`
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request

### Commit Messages

Siga o padrão:

- `Add: nova funcionalidade`
- `Fix: correção de bug`
- `Refactor: refatoração de código`
- `Docs: atualização de documentação`
- `Style: formatação de código`
- `Test: adição de testes`
- `Chore: tarefas de manutenção`

## ⚡ Performance Tips

1. Use `OnPush` change detection
2. Use `trackBy` em `*ngFor`
3. Lazy load features
4. Use Web Workers para operações pesadas
5. Otimize imagens (WebP, lazy loading)
6. Use Service Workers para cache
7. Minimize bundle size

## 🔒 Segurança

1. Sanitize user input
2. Use HTTPS
3. Implement CSP headers
4. Validate on backend
5. Use environment variables para secrets
6. Implement rate limiting
7. Keep dependencies updated

---

**Happy Coding! 🚀**
