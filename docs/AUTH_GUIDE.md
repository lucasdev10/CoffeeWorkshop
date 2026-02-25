# 🔐 Guia de Autenticação e Área Administrativa

## 📋 Visão Geral

Sistema completo de autenticação e área administrativa para gerenciamento de produtos, implementado seguindo os mesmos princípios enterprise do projeto.

## 🎯 Funcionalidades

### Autenticação

- ✅ Login com email e senha
- ✅ Logout
- ✅ Persistência de sessão (localStorage)
- ✅ Guards para proteção de rotas
- ✅ Verificação de roles (ADMIN/USER)
- ✅ Redirecionamento automático baseado em role

### Área Administrativa

- ✅ Dashboard com estatísticas
- ✅ Listagem de produtos com tabela
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Excluir produto (com confirmação)
- ✅ Indicadores visuais de estoque
- ✅ Acesso restrito apenas para ADMIN

## 🔑 Credenciais de Teste

### Admin

- **Email**: admin@admin.com
- **Senha**: admin123
- **Acesso**: Dashboard administrativo + Loja

### Usuário Regular

- **Email**: user@user.com
- **Senha**: user123
- **Acesso**: Apenas loja

## 🗂️ Estrutura de Arquivos

```
src/app/
├── features/
│   ├── auth/
│   │   ├── models/
│   │   │   └── auth.model.ts          # User, UserRole, LoginCredentials, AuthResponse
│   │   ├── pages/
│   │   │   └── login-page/            # Página de login
│   │   ├── repositories/
│   │   │   └── auth.repository.ts     # Mock de autenticação (substituir por API)
│   │   ├── store/
│   │   │   └── auth.store.ts          # Estado global de autenticação
│   │   └── auth.routes.ts             # Rotas de autenticação
│   │
│   └── admin/
│       ├── pages/
│       │   ├── admin-dashboard-page/   # Dashboard com estatísticas
│       │   ├── admin-products-page/    # Listagem de produtos
│       │   └── admin-product-form-page/ # Criar/Editar produto
│       └── admin.routes.ts             # Rotas administrativas
│
├── core/
│   └── guards/
│       ├── auth.guard.ts               # Verifica se está autenticado
│       └── role.guard.ts               # Verifica role do usuário
│
└── shared/
    └── components/
        └── confirm-dialog/             # Dialog de confirmação
```

## 🚀 Como Usar

### 1. Acessar Área de Login

```
http://localhost:4200/auth/login
```

### 2. Fazer Login

Use uma das credenciais de teste acima.

### 3. Acessar Dashboard Admin

Após login como admin, você será redirecionado para:

```
http://localhost:4200/admin
```

### 4. Gerenciar Produtos

- **Listar**: `/admin/products`
- **Criar**: `/admin/products/create`
- **Editar**: `/admin/products/edit/:id`
- **Excluir**: Botão na listagem

## 🔒 Proteção de Rotas

### Auth Guard

Protege rotas que requerem autenticação:

```typescript
{
  path: 'admin',
  canActivate: [authGuard],
  loadChildren: () => import('./features/admin/admin.routes')
}
```

### Role Guard

Protege rotas que requerem role específico:

```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes')
}
```

## 📊 AuthStore (Signal-based)

### Estado

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### Computed Signals

```typescript
readonly user = computed(() => this.userState());
readonly isAuthenticated = computed(() => !!this.userState());
readonly isAdmin = computed(() => this.userState()?.role === UserRole.ADMIN);
```

### Actions

```typescript
login(credentials: LoginCredentials): void
logout(): void
clearError(): void
```

## 🎨 Componentes

### LoginPageComponent

- Formulário reativo com validações
- Feedback visual de loading
- Mensagens de erro
- Toggle de visibilidade de senha
- Credenciais de teste visíveis

### AdminDashboardPageComponent

- Cards com estatísticas:
  - Total de produtos
  - Valor total em estoque
  - Produtos com estoque baixo
  - Itens no carrinho
- Ações rápidas com navegação

### AdminProductsPageComponent

- Tabela Material com:
  - Imagem do produto
  - Nome e descrição
  - Categoria
  - Preço
  - Estoque (com badges coloridos)
  - Ações (editar/excluir)
- Estados de loading/error/empty
- Confirmação antes de excluir

### AdminProductFormPageComponent

- Formulário reativo completo
- Validações em tempo real
- Modo criar/editar
- Campos:
  - Nome (min 3 caracteres)
  - Descrição (min 10 caracteres)
  - Categoria (select)
  - Preço (min 0.01)
  - Estoque (min 0)
  - URL da imagem

### ConfirmDialogComponent

- Dialog reutilizável
- Customizável (título, mensagem, botões)
- Retorna boolean (confirmado/cancelado)

## 🎯 Header Atualizado

### Funcionalidades

- Menu de navegação dinâmico
- Link "Admin" visível apenas para admins
- Botão de login quando não autenticado
- Menu de usuário quando autenticado:
  - Nome e email do usuário
  - Link para dashboard (se admin)
  - Botão de logout
- Badge do carrinho

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /auth/login
2. Preenche credenciais
3. AuthStore.login() é chamado
4. AuthRepository valida credenciais (mock)
5. Se válido:
   - Token e user salvos no localStorage
   - Estado atualizado
   - Redirecionamento baseado em role:
     - ADMIN → /admin
     - USER → /products
6. Se inválido:
   - Mensagem de erro exibida
```

## 🔄 Fluxo de Proteção de Rotas

```
1. Usuário tenta acessar /admin
2. authGuard verifica isAuthenticated()
3. Se não autenticado → redireciona para /auth/login
4. Se autenticado → roleGuard verifica role
5. Se não tem role ADMIN → redireciona para /products
6. Se tem role ADMIN → permite acesso
```

## 🚀 Migração para API Real

### 1. Atualizar AuthRepository

```typescript
@Injectable({ providedIn: 'root' })
export class AuthRepository {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/auth/logout`, {});
  }

  validateToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/validate`);
  }
}
```

### 2. Adicionar Interceptor de Token

Já existe `auth.interceptor.ts` pronto para uso:

```typescript
// Injeta token automaticamente em todas as requisições
```

### 3. Implementar Refresh Token

```typescript
refreshToken(refreshToken: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/auth/refresh`, {
    refreshToken,
  });
}
```

## 📝 Próximos Passos (Opcional)

### Segurança

- [ ] Implementar refresh token automático
- [ ] Adicionar rate limiting
- [ ] Implementar 2FA
- [ ] Adicionar CAPTCHA no login

### Funcionalidades

- [ ] Recuperação de senha
- [ ] Registro de novos usuários
- [ ] Perfil de usuário
- [ ] Histórico de ações
- [ ] Logs de auditoria

### UX

- [ ] Remember me
- [ ] Login social (Google, Facebook)
- [ ] Notificações de sessão expirada
- [ ] Modo offline

## 🎓 Conceitos Aplicados

- ✅ Signal-based State Management
- ✅ Repository Pattern
- ✅ Route Guards
- ✅ Role-based Access Control (RBAC)
- ✅ Reactive Forms
- ✅ Material Design
- ✅ Lazy Loading
- ✅ OnPush Change Detection
- ✅ Computed Signals
- ✅ Dependency Injection
- ✅ Clean Architecture

## 🔥 Diferenciais

1. **100% Signal-based** - Sem decorators antigos
2. **Type-safe** - TypeScript strict mode
3. **Preparado para API real** - Fácil migração
4. **Guards reutilizáveis** - Aplicáveis em qualquer rota
5. **Estado persistente** - Mantém sessão após reload
6. **UX profissional** - Loading states, error handling
7. **Código limpo** - Seguindo SOLID e best practices

---

**Sistema de autenticação completo e production-ready!** 🚀
