# NgRx Best Practices - Checklist

Este documento lista as melhores práticas do NgRx que foram seguidas nesta implementação.

## ✅ Estrutura de Arquivos

- [x] Um arquivo por conceito (state, actions, reducer, effects, selectors)
- [x] Nomenclatura consistente (`user.state.ts`, `user.actions.ts`, etc)
- [x] `index.ts` para public API
- [x] Testes separados para cada arquivo

## ✅ State

- [x] Interface TypeScript para o estado
- [x] Estado inicial exportado
- [x] Estado imutável (readonly quando possível)
- [x] Estado normalizado (sem duplicação de dados)
- [x] Tipos específicos para loading states

```typescript
export interface UserState {
  users: IUser[];
  selectedUser: IUser | null;
  filters: IUserFilters;
  loading: LoadingState;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  filters: {},
  loading: 'idle',
  error: null,
};
```

## ✅ Actions

- [x] Usar `createActionGroup` para agrupar actions relacionadas
- [x] Nomenclatura: `[Source] Event` (ex: `[User] Load Users`)
- [x] Actions para success e failure de operações assíncronas
- [x] Payloads tipados com `props<T>()`
- [x] Actions descritivas e específicas

```typescript
export const UserActions = createActionGroup({
  source: 'User',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: IUser[] }>(),
    'Load Users Failure': props<{ error: string }>(),
  },
});
```

## ✅ Reducer

- [x] Usar `createReducer` e `on`
- [x] Estado sempre imutável (spread operator)
- [x] Um handler por action
- [x] Sem lógica de negócio no reducer
- [x] Sem side effects no reducer
- [x] Retornar novo objeto de estado

```typescript
export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: 'loading' as const,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: 'success' as const,
    error: null,
  })),
);
```

## ✅ Effects

- [x] Usar `createEffect` para cada effect
- [x] Usar `inject()` para dependências
- [x] Usar `ofType` para filtrar actions
- [x] Usar `switchMap` para cancelar requisições anteriores
- [x] Sempre retornar uma action (success ou failure)
- [x] Tratar erros com `catchError`
- [x] Sem lógica de negócio nos effects

```typescript
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UserActions.loadUsers),
    switchMap(() =>
      this.repository.findAll().pipe(
        map((users) => UserActions.loadUsersSuccess({ users })),
        catchError((error) => of(UserActions.loadUsersFailure({ error: error.message }))),
      ),
    ),
  ),
);
```

## ✅ Selectors

- [x] Usar `createFeatureSelector` para feature state
- [x] Usar `createSelector` para selectors derivados
- [x] Selectors pequenos e focados
- [x] Memoização automática
- [x] Composição de selectors
- [x] Sem lógica complexa nos selectors

```typescript
export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUsers = createSelector(selectUserState, (state) => state.users);

export const selectFilteredUsers = createSelector(selectUsers, selectFilters, (users, filters) => {
  // Lógica de filtro
});
```

## ✅ Uso em Componentes

- [x] Injetar `facade` diretamente
- [x] Usar `store.selectSignal()` para signals
- [x] Usar `store.select()` para observables
- [x] Usar `store.dispatch()` para actions
- [x] Não acessar estado diretamente
- [x] Não modificar estado diretamente

```typescript
export class MyComponent {
  private readonly facade = inject(UserFacade);

  // Selectors
  users = this.facade.users$;

  // Actions
  loadUsers(): void {
    this.facade.loadUsers();
  }
}
```

## ✅ Testes

- [x] Usar `provideMockStore` para testes de componentes
- [x] Testar reducer isoladamente
- [x] Testar effects isoladamente
- [x] Testar selectors isoladamente
- [x] Usar `MockStore` para spy em dispatch
- [x] Usar `overrideSelector` para mockar selectors

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      provideMockStore({
        initialState: { user: initialUserState },
      }),
    ],
  });

  store = TestBed.inject(MockStore);
});
```

## ✅ Performance

- [x] Selectors memoizados
- [x] Usar signals para melhor performance
- [x] Evitar selectors complexos
- [x] Normalizar estado quando necessário
- [x] Lazy loading de features

## ✅ Organização

- [x] Feature store (estado por feature)
- [x] Estado global separado (auth, config, ui)
- [x] Public API clara (`index.ts`)
- [x] Documentação completa
- [x] Exemplos de uso

## ❌ Anti-Patterns Evitados

- [x] Não acessar estado diretamente
- [x] Não modificar estado diretamente
- [x] Não colocar lógica de negócio no reducer
- [x] Não colocar side effects no reducer
- [x] Não usar `any` ou `unknown` sem necessidade
- [x] Não criar actions genéricas demais
- [x] Não duplicar estado

## 📚 Referências Oficiais

1. [NgRx Store](https://ngrx.io/guide/store)
2. [NgRx Effects](https://ngrx.io/guide/effects)
3. [NgRx Selectors](https://ngrx.io/guide/store/selectors)
4. [NgRx Testing](https://ngrx.io/guide/store/testing)
5. [NgRx Style Guide](https://ngrx.io/guide/eslint-plugin)
6. [NgRx Signals](https://ngrx.io/guide/signals)

## 🎯 Resultado

Esta implementação segue 100% as melhores práticas recomendadas pela documentação oficial do NgRx, sem abstrações desnecessárias ou desvios do padrão.
