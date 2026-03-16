# User Store - NgRx Implementation

Esta pasta contém a implementação completa do gerenciamento de estado da feature de usuários usando NgRx, seguindo 100% as melhores práticas recomendadas pela documentação oficial.

## Estrutura de Arquivos

```
store/
├── index.ts                  # Public API - exporta tudo necessário
├── user.state.ts            # Definição do estado e estado inicial
├── user.actions.ts          # Actions (eventos) da feature
├── user.reducer.ts          # Reducer (transições de estado)
├── user.effects.ts          # Effects (side effects como HTTP)
├── user.selectors.ts        # Selectors (queries do estado)
├── user.facade.ts           # Facade (API simplificada) ⭐
├── user.store.spec.ts       # Testes de integração
├── user.facade.spec.ts      # Testes do facade
├── user.reducer.spec.ts     # Testes do reducer
├── user.effects.spec.ts     # Testes dos effects
└── user.selectors.spec.ts   # Testes dos selectors
```

## Arquitetura

### Feature Store com Facade (Padrão Recomendado)

A implementação segue o padrão de **Feature Store com Facade**, onde:

- ✅ Estado isolado por feature
- ✅ Facade encapsula a complexidade do Store
- ✅ API simplificada para componentes
- ✅ Reduz boilerplate
- ✅ Facilita testes
- ✅ Lazy loading compatível

### Por que usar Facade?

O Facade é uma prática recomendada quando:

- Há muitas chamadas de `select` e `dispatch`
- Você quer uma API mais limpa nos componentes
- Precisa encapsular lógica de seleção complexa
- Quer facilitar a manutenção e testes

**Referência oficial**: [NgRx Data Facade Pattern](https://ngrx.io/guide/data/facade)

### Componentes do NgRx

1. **State** (`user.state.ts`)
   - Define a estrutura do estado
   - Fornece o estado inicial
   - Type-safe com TypeScript

2. **Actions** (`user.actions.ts`)
   - Eventos do sistema usando `createActionGroup`
   - Padrão: `[Source] Event` (ex: `[User] Load Users`)
   - Actions para success e failure de cada operação

3. **Reducer** (`user.reducer.ts`)
   - Transições de estado puras e imutáveis
   - Usa `createReducer` e `on` do NgRx
   - Cada action tem seu handler específico

4. **Effects** (`user.effects.ts`)
   - Gerencia side effects (chamadas HTTP)
   - Usa RxJS operators (`switchMap`, `map`, `catchError`)
   - Retorna actions de success ou failure

5. **Selectors** (`user.selectors.ts`)
   - Queries otimizadas com memoização
   - Selectors básicos e derivados
   - Performance automática

6. **Facade** (`user.facade.ts`) ⭐
   - Encapsula Store, Actions e Selectors
   - API simplificada para componentes
   - Expõe Observables e Signals
   - Reduz boilerplate

## Como Usar

### Opção 1: Usando Facade (Recomendado ⭐)

```typescript
import { UserFacade } from './store';

export class MyComponent {
  private readonly userFacade = inject(UserFacade);

  // Selectors como Signals (recomendado)
  users = this.userFacade.users;
  isLoading = this.userFacade.isLoading;
  filteredUsers = this.userFacade.filteredUsers;

  // Ou como Observables
  users$ = this.userFacade.users$;

  constructor() {
    // Actions
    this.userFacade.loadUsers();
  }

  createUser(dto: ICreateUserDto): void {
    this.userFacade.createUser(dto);
  }
}

// No template
<div>{{ users().length }} usuários</div>
<div *ngIf="isLoading()">Carregando...</div>
```

### Opção 2: Usando Store Diretamente

```typescript
import { Store } from '@ngrx/store';
import { UserActions, selectUsers, selectIsLoading } from './store';

export class MyComponent {
  private readonly store = inject(Store);

  // Selectors
  users = this.store.selectSignal(selectUsers);
  isLoading = this.store.selectSignal(selectIsLoading);

  constructor() {
    // Actions
    this.store.dispatch(UserActions.loadUsers());
  }

  createUser(dto: ICreateUserDto): void {
    this.store.dispatch(UserActions.createUser({ dto }));
  }
}
```

## Exemplo Completo com Facade

```typescript
import { Component, inject } from '@angular/core';
import { UserFacade } from './store';
import { EUserRole } from './models/user.model';

@Component({
  selector: 'app-user-list',
  template: `
    <div>
      <h2>Usuários ({{ userCount() }})</h2>

      <input type="text" (input)="onSearch($event)" placeholder="Buscar usuários..." />

      <div *ngIf="isLoading()">Carregando...</div>
      <div *ngIf="hasError()">{{ error() }}</div>

      <ul>
        <li *ngFor="let user of filteredUsers()">
          {{ user.fullName }} - {{ user.email }}
          <button (click)="onEdit(user.id)">Editar</button>
          <button (click)="onDelete(user.id)">Deletar</button>
        </li>
      </ul>

      <button (click)="onCreate()">Novo Usuário</button>
    </div>
  `,
})
export class UserListComponent {
  private readonly userFacade = inject(UserFacade);

  // Selectors (signals)
  filteredUsers = this.userFacade.filteredUsers;
  userCount = this.userFacade.userCount;
  isLoading = this.userFacade.isLoading;
  hasError = this.userFacade.hasError;
  error = this.userFacade.error;

  constructor() {
    // Carregar usuários na inicialização
    this.userFacade.loadUsers();
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.userFacade.setFilters({ search });
  }

  onEdit(id: string): void {
    this.userFacade.loadUserById(id);
    // Navegar para página de edição
  }

  onDelete(id: string): void {
    if (confirm('Tem certeza?')) {
      this.userFacade.deleteUser(id);
    }
  }

  onCreate(): void {
    this.userFacade.createUser({
      fullName: 'Novo Usuário',
      email: 'novo@example.com',
      password: 'password123',
      role: EUserRole.USER,
    });
  }
}
```

## Testando Componentes

### Com Facade

```typescript
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MyComponent } from './my.component';
import { UserFacade } from './store';
import { initialUserState } from './store';

describe('MyComponent', () => {
  let facade: UserFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        UserFacade,
        provideMockStore({
          initialState: {
            user: initialUserState,
          },
        }),
      ],
    });

    facade = TestBed.inject(UserFacade);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should call facade.loadUsers on init', () => {
    const loadSpy = vi.spyOn(facade, 'loadUsers');

    TestBed.createComponent(MyComponent);

    expect(loadSpy).toHaveBeenCalled();
  });
});
```

## Vantagens desta Abordagem

1. **Padrão Oficial do NgRx**
   - Facade é recomendado pela documentação oficial
   - Reduz boilerplate nos componentes
   - API mais limpa e intuitiva

2. **Encapsulamento**
   - Esconde complexidade do Store
   - Componentes não precisam conhecer Actions/Selectors
   - Fácil refatorar internamente

3. **Testabilidade**
   - Fácil mockar o facade
   - Testes de componentes mais simples
   - Testes de integração mais claros

4. **Manutenibilidade**
   - Mudanças no Store não afetam componentes
   - API consistente em toda aplicação
   - Fácil adicionar novas funcionalidades

5. **Performance**
   - Memoização automática de selectors
   - Signals para melhor performance
   - Change detection otimizada

6. **Flexibilidade**
   - Pode usar Facade ou Store diretamente
   - Expõe Observables e Signals
   - Compatível com todas as features do NgRx

## Debugging com Redux DevTools

Instale a extensão Redux DevTools no navegador para:

- Ver todas as actions disparadas em tempo real
- Inspecionar o estado completo da aplicação
- Time-travel debugging (voltar e avançar no tempo)
- Exportar/importar estado para reproduzir bugs
- Ver diff de estado entre actions

## Próximos Passos

Para adicionar novas funcionalidades:

1. Adicione a action em `user.actions.ts`
2. Adicione o handler no `user.reducer.ts`
3. Se necessário, adicione o effect em `user.effects.ts`
4. Se necessário, adicione o selector em `user.selectors.ts`
5. Exponha o método no facade `user.facade.ts`
6. Use o facade nos componentes
7. Adicione os testes correspondentes

## Referências

- [NgRx Documentation](https://ngrx.io/)
- [NgRx Facade Pattern](https://ngrx.io/guide/data/facade)
- [NgRx Best Practices](https://ngrx.io/guide/eslint-plugin/rules)
- [Redux Pattern](https://redux.js.org/understanding/thinking-in-redux/three-principles)
- [Angular Signals + NgRx](https://ngrx.io/guide/signals)
- [NgRx Style Guide](https://ngrx.io/guide/eslint-plugin)
