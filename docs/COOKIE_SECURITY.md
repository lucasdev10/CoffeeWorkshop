# 🔐 Migração para Cookies Seguros

Este documento descreve a migração do armazenamento de tokens de autenticação do `localStorage` para cookies seguros, implementando melhores práticas de segurança.

## 🎯 Motivação

### Problemas do localStorage

- **Vulnerável a XSS**: JavaScript malicioso pode acessar tokens
- **Sem controle de expiração**: Tokens ficam indefinidamente no navegador
- **Sem flags de segurança**: Não há proteção contra CSRF ou transmissão insegura

### Vantagens dos Cookies Seguros

- **Flags de segurança**: `Secure`, `SameSite`, `HttpOnly` (quando configurado no servidor)
- **Expiração automática**: Controle preciso de tempo de vida
- **Proteção CSRF**: Flag `SameSite=strict` previne ataques cross-site
- **HTTPS obrigatório**: Flag `Secure` garante transmissão criptografada

## 🏗️ Arquitetura Implementada

### 1. CookieService

Serviço base para gerenciamento de cookies com opções de segurança:

```typescript
// Configuração padrão segura
private readonly defaultOptions: CookieOptions = {
  path: '/',
  secure: this.isSecureContext(), // true em HTTPS
  sameSite: 'strict',
  expires: 7, // 7 dias
};
```

### 2. SecureStorageService

Serviço inteligente que decide onde armazenar cada tipo de dado:

```typescript
// Dados sensíveis → Cookies seguros
auth_token: {
  useSecureCookies: true;
}
auth_user: {
  useSecureCookies: true;
}

// Dados não-sensíveis → localStorage
theme: {
  useSecureCookies: false;
}
cart: {
  useSecureCookies: false;
}
```

## 🔧 Configurações de Segurança

### Flags de Cookie Implementadas

| Flag       | Valor    | Descrição                    |
| ---------- | -------- | ---------------------------- |
| `Secure`   | `true`   | Apenas transmissão HTTPS     |
| `SameSite` | `strict` | Previne ataques CSRF         |
| `Path`     | `/`      | Disponível em toda aplicação |
| `Expires`  | `7 dias` | Expiração automática         |

### Detecção de Contexto Seguro

```typescript
private isSecureContext(): boolean {
  return location.protocol === 'https:' || location.hostname === 'localhost';
}
```

## 📋 Checklist de Implementação

### ✅ Implementado

- [x] CookieService com flags de segurança
- [x] SecureStorageService com estratégia híbrida
- [x] Atualização do AuthStore
- [x] Atualização do AuthInterceptor
- [x] Documentação completa

### 🔄 Próximos Passos (Opcional)

- [ ] Implementar refresh token automático
- [ ] Configurar HttpOnly no servidor (backend)
- [ ] Implementar rotação de tokens
- [ ] Adicionar monitoramento de segurança

## 🛡️ Considerações de Segurança

### 1. HTTPS Obrigatório

```typescript
// Cookies seguros só funcionam em HTTPS
secure: this.isSecureContext();
```

### 2. Proteção CSRF

```typescript
// SameSite=strict previne ataques cross-site
sameSite: 'strict';
```

### 3. Expiração Controlada

```typescript
// Tokens expiram automaticamente
expires: 7; // dias
```

### 4. Validação de Contexto

- Desenvolvimento: `localhost` permite cookies seguros
- Produção: Apenas HTTPS

## 📊 Comparação: Antes vs Depois

| Aspecto             | localStorage (Antes) | Cookies Seguros (Depois) |
| ------------------- | -------------------- | ------------------------ |
| **Segurança XSS**   | ❌ Vulnerável        | ✅ Protegido com flags   |
| **Expiração**       | ❌ Manual            | ✅ Automática            |
| **HTTPS**           | ❌ Opcional          | ✅ Obrigatório           |
| **CSRF**            | ❌ Vulnerável        | ✅ Protegido (SameSite)  |
| **Performance**     | ✅ Rápido            | ✅ Rápido                |
| **Compatibilidade** | ✅ Universal         | ✅ Moderno               |

## 📚 Referências

- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [Web Security Best Practices](https://web.dev/secure/)
