# 🔐 Guia de Segurança

Este documento descreve todas as medidas de segurança implementadas no projeto.

## ✅ 1. Rotas Protegidas para Admin

As rotas administrativas estão protegidas por guards que verificam autenticação e permissões:

```typescript
// src/app/app.routes.ts
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN'] },
  loadChildren: () => import('./features/admin/admin.routes').then((r) => r.ADMIN_ROUTES),
}
```

**Proteções implementadas:**

- `authGuard`: Verifica se o usuário está autenticado
- `roleGuard`: Verifica se o usuário tem a role ADMIN
- Redirecionamento automático para login se não autenticado
- Redirecionamento para /products se não tiver permissão

## ✅ 2. Autenticação Simulada

O sistema possui autenticação completa com:

### AuthStore (src/app/features/auth/store/auth.store.ts)

```typescript
- login(credentials): Autentica usuário
- logout(): Remove autenticação
- isAuthenticated: Signal que indica se está autenticado
- isAdmin: Signal que indica se é administrador
- Persistência em localStorage (auth_token, auth_user)
```

### Fluxo de Autenticação

1. Usuário faz login com credenciais
2. Sistema valida e retorna token + dados do usuário
3. Token e usuário são salvos no localStorage
4. Token é adicionado automaticamente em todas as requisições HTTP
5. Ao fazer logout, dados são removidos e usuário é redirecionado

## ✅ 3. Guards / ProtectedRoute

### AuthGuard (src/app/core/guards/auth.guard.ts)

Protege rotas que requerem autenticação:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  if (!authStore.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  return true;
};
```

**Funcionalidades:**

- Verifica se usuário está autenticado
- Redireciona para login se não estiver
- Salva URL de retorno para redirecionar após login

### RoleGuard (src/app/core/guards/role.guard.ts)

Protege rotas baseado em permissões/roles:

```typescript
export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);

  const requiredRoles = route.data['roles'] as string[];
  const user = authStore.user();

  if (!user || !requiredRoles.includes(user.role)) {
    router.navigate(['/products']);
    return false;
  }

  return true;
};
```

**Funcionalidades:**

- Verifica se usuário tem a role necessária
- Suporta múltiplas roles por rota
- Redireciona se não tiver permissão

### UnsavedChangesGuard (src/app/core/guards/unsaved-changes.guard.ts)

Protege contra perda de dados não salvos:

```typescript
- Verifica se há mudanças não salvas em formulários
- Exibe confirmação antes de sair da página
- Previne perda acidental de dados
```

## ✅ 4. Sanitização de Inputs

### Validações em Formulários

Todos os formulários utilizam validações rigorosas:

```typescript
// src/app/features/admin/pages/admin-product-form-page/admin-product-form-page.ts
readonly productForm = form(this.productModel, (fieldPath) => {
  required(fieldPath.name, { message: 'Field required' });
  minLength(fieldPath.name, 3, { message: 'Minimum of 3 characters' });
  required(fieldPath.description, { message: 'Field required' });
  minLength(fieldPath.description, 10, { message: 'Minimum of 10 characters' });
  required(fieldPath.price, { message: 'Field required' });
  min(fieldPath.price, 0.1, { message: 'Minimum of 0.1' });
  required(fieldPath.stock, { message: 'Field required' });
  min(fieldPath.stock, 0, { message: 'Minimum of 0' });
});
```

### Validadores Customizados (src/app/shared/validators/custom-validators.ts)

**Validadores disponíveis:**

- `email()`: Valida formato de email
- `strongPassword()`: Senha forte (maiúscula, minúscula, número, caractere especial, 8+ chars)
- `matchFields()`: Compara dois campos (ex: senha e confirmação)
- `url()`: Valida URLs
- `phone()`: Valida telefone brasileiro
- `cpf()`: Valida CPF com dígitos verificadores
- `minValue()`: Valor mínimo para números
- `maxValue()`: Valor máximo para números

### Proteção contra XSS

**Angular protege automaticamente contra XSS:**

- Interpolação `{{ }}` é sanitizada automaticamente
- Property binding `[property]` é sanitizado
- Não há uso de `innerHTML` sem sanitização no projeto
- DomSanitizer é usado apenas quando necessário (pipes específicos)

**Verificação realizada:**

```bash
# Busca por innerHTML no projeto
grep -r "innerHTML" src/
# Resultado: Nenhum uso inseguro encontrado
```

## 🔒 Interceptors de Segurança

### AuthInterceptor (src/app/core/interceptors/auth.interceptor.ts)

Adiciona token de autenticação em todas as requisições:

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
```

### ErrorInterceptor (src/app/core/interceptors/error.interceptor.ts)

Trata erros HTTP globalmente:

```typescript
- 401 (Não autorizado): Redireciona para login
- 403 (Proibido): Redireciona para página de não autorizado
- 404 (Não encontrado): Log de erro
- 500 (Erro do servidor): Log de erro
```

## 📋 Checklist de Segurança

| Item                        | Status | Implementação                             |
| --------------------------- | ------ | ----------------------------------------- |
| Rotas protegidas para admin | ✅     | authGuard + roleGuard                     |
| Autenticação simulada       | ✅     | AuthStore com login/logout                |
| Guards de proteção          | ✅     | authGuard, roleGuard, unsavedChangesGuard |
| Sanitização de inputs       | ✅     | Validadores + Angular sanitization        |
| Proteção XSS                | ✅     | Angular automático                        |
| Interceptor de autenticação | ✅     | Token em todas as requisições             |
| Tratamento de erros HTTP    | ✅     | ErrorInterceptor                          |
| Validação de formulários    | ✅     | Validadores customizados                  |
| Persistência segura         | ✅     | localStorage com StorageService           |

## 🛡️ Boas Práticas Implementadas

### 1. Princípio do Menor Privilégio

- Usuários comuns não têm acesso a rotas administrativas
- Guards verificam permissões em cada navegação
- Redirecionamento automático se não autorizado

### 2. Validação em Múltiplas Camadas

- Validação no frontend (formulários)
- Validação no backend (simulada via repository)
- Sanitização automática do Angular

### 3. Gestão Segura de Tokens

- Token armazenado no localStorage
- Token adicionado automaticamente em requisições
- Token removido no logout
- Verificação de expiração (pode ser implementada)

### 4. Proteção contra CSRF

- Angular possui proteção CSRF integrada
- HttpClient adiciona token XSRF automaticamente
- Configurável via HttpClientXsrfModule

### 5. Tratamento de Erros

- Erros HTTP tratados globalmente
- Mensagens de erro amigáveis ao usuário
- Logs de erro para debugging
- Redirecionamento em casos de não autorização

## 🔍 Testes de Segurança

Todos os guards e interceptors possuem testes unitários:

```typescript
// Testes implementados:
- authGuard: Deve redirecionar se não autenticado
- roleGuard: Deve bloquear acesso sem permissão
- authInterceptor: Deve adicionar token nas requisições
- errorInterceptor: Deve tratar erro 401 corretamente
```

## 🚀 Melhorias Futuras (Opcional)

Para aumentar ainda mais a segurança:

1. **JWT com Expiração**
   - Implementar verificação de expiração do token
   - Refresh token automático
   - Logout automático ao expirar

2. **Rate Limiting**
   - Limitar tentativas de login
   - Proteção contra brute force

3. **HTTPS Only**
   - Forçar HTTPS em produção
   - Secure cookies

4. **Content Security Policy (CSP)**
   - Adicionar headers CSP
   - Prevenir injeção de scripts

5. **Auditoria de Segurança**
   - Logs de ações administrativas
   - Histórico de acessos
   - Monitoramento de atividades suspeitas

6. **2FA (Two-Factor Authentication)**
   - Autenticação em dois fatores
   - Maior segurança para admins

## 📚 Referências

- [Angular Security Guide](https://angular.io/guide/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Guards](https://angular.io/guide/router#preventing-unauthorized-access)
- [HTTP Interceptors](https://angular.io/guide/http-intercept-requests-and-responses)
