# Quick Start - User Store com NgRx + Facade

## Setup Básico

### Opção 1: Usando Facade (Recomendado ⭐)

```typescript
import { UserFacade } from './store';

export class MyComponent {
  private readonly userFacade = inject(UserFacade);
}
```

### Opção 2: Usando Store Diretamente

```typescript
import { Store } from '@ngrx/store';
import { UserActions, selectUsers } from './store';

export class MyComponent {
  private readonly store = inject(Store);
}
```

## Lendo Dados com Facade

### Signals (Recomendado ⭐)

```typescript
export class MyComponent {
  private readonly userFacade = inject(UserFacade);

  // Signals - reativo e performático
  users = this.userFacade.users;
  isLoading = this.userFacade.isLoading;
  filteredUsers = this.userFacade.filteredUsers;
  userCount = this.userFacade.userCount;
  hasError = this.userFacade.hasError;
  error = this.userFacade.error;
}

// No template
<div>{{ users().length }} usuários</div>
<div *ngIf="isLoading()">Carregando...</div>
<div *ngIf="hasError()">Erro: {{ error() }}</div>
<ul>
  <li *ngFor="let user of filteredUsers()">
    {{ user.fullName }}
  </li>
</ul>
```

### Observables

```typescript
export class MyComponent {
  private readonly userFacade = inject(UserFacade);

  // Observables - para usar com async pipe ou RxJS
  users$ = this.userFacade.users$;
  isLoading$ = this.userFacade.isLoading$;
}

// No template
<div *ngFor="let user of users$ | async">
  {{ user.fullName }}
</div>
```

## Disparando Actions com Facade

```typescript
import { UserFacade } from './store';
import { EUserRole } from './models/user.model';

export class MyComponent {
  private readonly userFacade = inject(UserFacade);

  constructor() {
    // Carregar todos os usuários
    this.userFacade.loadUsers();
  }

  // Carregar usuário específico
  loadUser(id: string): void {
    this.userFacade.loadUserById(id);
  }

  // Criar usuário
  createUser(): void {
    this.userFacade.createUser({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: EUserRole.USER,
    });
  }

  // Atualizar usuário
  updateUser(id: string): void {
    this.userFacade.updateUser(id, {
      fullName: 'Updated Name',
    });
  }

  // Deletar usuário
  deleteUser(id: string): void {
    this.userFacade.deleteUser(id);
  }

  // Filtrar usuários
  searchUsers(search: string): void {
    this.userFacade.setFilters({ search });
  }

  // Limpar filtros
  clearFilters(): void {
    this.userFacade.clearFilters();
  }

  // Limpar erro
  clearError(): void {
    this.userFacade.clearError();
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

      <input type="text" (input)="onSearch($event)" placeholder="Buscar..." />

      <div *ngIf="isLoading()">Carregando...</div>
      <div *ngIf="hasError()">{{ error() }}</div>

      <ul>
        <li *ngFor="let user of filteredUsers()">
          {{ user.fullName }}
          <button (click)="onDelete(user.id)">Deletar</button>
        </li>
      </ul>

      <button (click)="onCreate()">Novo Usuário</button>
    </div>
  `,
})
export class UserListComponent {
  private readonly userFacade = inject(UserFacade);

  // Selectors (muito mais limpo que Store diretamente!)
  users = this.userFacade.users;
  filteredUsers = this.userFacade.filteredUsers;
  userCount = this.userFacade.userCount;
  isLoading = this.userFacade.isLoading;
  hasError = this.userFacade.hasError;
  error = this.userFacade.error;

  constructor() {
    // Actions (API muito mais limpa!)
    this.userFacade.loadUsers();
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.userFacade.setFilters({ search });
  }

  onDelete(id: string): void {
    this.userFacade.deleteUser(id);
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

## Comparação: Facade vs Store Direto

### Com Facade (Mais Limpo ⭐)

```typescript
export class MyComponent {
  private readonly userFacade = inject(UserFacade);

  users = this.userFacade.users;
  isLoading = this.userFacade.isLoading;

  loadUsers(): void {
    this.userFacade.loadUsers();
  }
}
```

### Com Store Direto (Mais Verboso)

```typescript
export class MyComponent {
  private readonly store = inject(Store);

  users = this.store.selectSignal(selectUsers);
  isLoading = this.store.selectSignal(selectIsLoading);

  loadUsers(): void {
    this.store.dispatch(UserActions.loadUsers());
  }
}
```

## Testando com Facade

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

## API do Facade

### Selectors (Signals)

```typescript
facade.users; // IUser[]
facade.selectedUser; // IUser | null
facade.filters; // IUserFilters
facade.loading; // LoadingState
facade.error; // string | null
facade.isLoading; // boolean
facade.hasError; // boolean
facade.filteredUsers; // IUser[] (com filtros)
facade.userCount; // number
facade.filteredUserCount; // number
```

### Selectors (Observables)

```typescript
facade.users$; // Observable<IUser[]>
facade.selectedUser$; // Observable<IUser | null>
facade.isLoading$; // Observable<boolean>
// ... todos os selectors têm versão Observable
```

### Actions

```typescript
facade.loadUsers(); // Carregar todos
facade.loadUserById(id); // Carregar por ID
facade.createUser(dto); // Criar usuário
facade.updateUser(id, dto); // Atualizar usuário
facade.deleteUser(id); // Deletar usuário
facade.setFilters(filters); // Definir filtros
facade.clearFilters(); // Limpar filtros
facade.clearError(); // Limpar erro
```

## Vantagens do Facade

1. **API Mais Limpa**: Menos boilerplate nos componentes
2. **Encapsulamento**: Esconde complexidade do NgRx
3. **Facilita Testes**: Mais fácil mockar o facade
4. **Manutenibilidade**: Mudanças internas não afetam componentes
5. **Consistência**: API uniforme em toda aplicação
6. **Flexibilidade**: Expõe Signals e Observables

## Quando Usar Facade vs Store Direto

### Use Facade quando:

- ✅ Há muitas chamadas de select/dispatch
- ✅ Quer API mais limpa nos componentes
- ✅ Precisa encapsular lógica complexa
- ✅ Quer facilitar testes e manutenção

### Use Store Direto quando:

- ✅ Precisa de controle total sobre NgRx
- ✅ Quer seguir 100% o padrão oficial
- ✅ Tem poucos selectors/actions
- ✅ Prefere explicitidade

## Dicas

1. **Use Signals** para melhor performance
2. **Use Observables** quando precisar de RxJS operators
3. **Teste o Facade** ao invés de mockar Store
4. **Mantenha o Facade simples** - apenas delegação
5. **Documente a API** do facade para outros devs

## Debugging

### Redux DevTools

Funciona normalmente! O facade não interfere:

- Ver todas as actions em tempo real
- Inspecionar o estado completo
- Time-travel debugging
- Exportar/importar estado

### Console

```typescript
// Ver estado atual
console.log(this.userFacade.users());

// Ver se está carregando
console.log(this.userFacade.isLoading());

// Ver erros
console.log(this.userFacade.error());
```

## Padrão Recomendado

O Facade é uma prática oficial recomendada pelo NgRx:

- ✅ Reduz boilerplate significativamente
- ✅ Melhora a experiência do desenvolvedor
- ✅ Facilita manutenção e testes
- ✅ Mantém todos os benefícios do NgRx

**Referência**: [NgRx Facade Pattern](https://ngrx.io/guide/data/facade)
