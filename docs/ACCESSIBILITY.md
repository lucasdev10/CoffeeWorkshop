# ♿ Guia de Implementação de Acessibilidade

## Visão Geral

Este documento descreve as funcionalidades de acessibilidade implementadas na aplicação de e-commerce Coffee Workshop para garantir conformidade com WCAG 2.1 Nível AA e proporcionar uma experiência inclusiva para todos os usuários.

---

## 🎯 Padrões de Acessibilidade

- Conformidade com **WCAG 2.1 Nível AA**
- **HTML semântico** para estrutura adequada do documento
- **Atributos ARIA** para suporte aprimorado a leitores de tela
- **Navegação por teclado** em toda a aplicação
- **Gerenciamento de foco** para elementos interativos

---

## 🔧 Detalhes de Implementação

### 1. Estrutura HTML Semântica

#### Estrutura do Documento

- `<html lang="pt-BR">` - Declaração de idioma para leitores de tela
- `<main role="main">` - Marco do conteúdo principal
- `<nav role="navigation">` - Marcos de navegação
- `<header role="banner">` - Cabeçalho do site
- Hierarquia adequada de cabeçalhos (h1 → h2 → h3)

#### Listas e Tabelas

- `<ul role="list">` para grades de produtos
- `<table role="table">` com cabeçalhos `<th scope="col">` adequados
- Estruturas de lista semânticas para menus de navegação

---

### 2. Atributos ARIA

#### Rótulos e Descrições

```html
<!-- aria-label dinâmico para contexto -->
<button [attr.aria-label]="'Carrinho de compras com ' + cartItemCount() + ' itens'">
  <!-- aria-describedby para contexto adicional -->
  <input aria-describedby="email-error" />

  <!-- aria-labelledby para associar rótulos -->
  <div aria-labelledby="summary-heading"></div>
</button>
```

#### Regiões Dinâmicas

```html
<!-- Anúncios educados para atualizações não críticas -->
<div role="status" aria-live="polite">Carregando produtos...</div>

<!-- Anúncios assertivos para erros -->
<div role="alert" aria-live="assertive">{{ error() }}</div>
```

#### Gerenciamento de Estado

```html
<!-- Estados de carregamento -->
<div aria-busy="true">
  <!-- Estados expandido/recolhido -->
  <button [attr.aria-expanded]="menuOpen">
    <!-- Estados pressionado para alternadores -->
    <button [attr.aria-pressed]="!hidePassword()">
      <!-- Campos obrigatórios -->
      <input aria-required="true" />

      <!-- Campos inválidos -->
      <input [attr.aria-invalid]="hasError" />
    </button>
  </button>
</div>
```

---

### 3. Navegação por Teclado

#### Ordem de Tabulação

- Todos os elementos interativos têm `tabindex="0"` para ordem natural de tabulação
- Nenhum valor positivo de tabindex (anti-padrão)
- Fluxo lógico de foco pela página

#### Indicadores de Foco

- Indicadores de foco visíveis em todos os elementos interativos
- Estilos de foco aprimorados para melhor visibilidade
- Links de pular para usuários de teclado (melhoria futura)

#### Atalhos de Teclado

- Enter/Espaço: Ativar botões e links
- Escape: Fechar modais e menus
- Setas: Navegar pelos menus (componentes Material)

---

### 4. Implementações Específicas de Componentes

#### Navegação do Cabeçalho

```html
<nav role="navigation" aria-label="Navegação principal">
  <ul role="menubar">
    <li role="none">
      <a role="menuitem" aria-label="Ver produtos">Produtos</a>
    </li>
  </ul>
</nav>
```

#### Badge do Carrinho de Compras

```html
<button [attr.aria-label]="'Carrinho de compras com ' + cartItemCount() + ' itens'">
  <mat-icon aria-hidden="true">shopping_cart</mat-icon>
</button>
```

#### Cards de Produtos

```html
<mat-card role="article" [attr.aria-label]="'Produto: ' + product().name">
  <img [alt]="product().name + ' - ' + product().description" />
  <button [attr.aria-label]="'Adicionar ' + product().name + ' ao carrinho'">
</mat-card>
```

#### Formulários

```html
<form role="form" [attr.aria-labelledby]="'form-heading'">
  <input aria-required="true" aria-describedby="field-error" [attr.aria-invalid]="hasError" />
  <div id="field-error" role="alert" aria-live="polite">Mensagem de erro</div>
</form>
```

#### Tabelas de Dados

```html
<table role="table" aria-labelledby="admin-heading">
  <th scope="col">Nome da Coluna</th>
  <td [attr.aria-label]="'Preço: ' + (product.price | currency)"></td>
</table>
```

#### Controles de Quantidade

```html
<div role="group" [attr.aria-label]="'Controles de quantidade para ' + product.name">
  <button [attr.aria-label]="'Diminuir quantidade'">-</button>
  <span role="status" aria-live="polite">{{ quantity }}</span>
  <button [attr.aria-label]="'Aumentar quantidade'">+</button>
</div>
```

---

### 5. Acessibilidade Visual

#### Ícones

- Todos os ícones decorativos têm `aria-hidden="true"`
- Botões apenas com ícones têm `aria-label` descritivo
- Alternativas de texto fornecidas quando necessário

#### Imagens

- Texto alternativo descritivo para todas as imagens
- Descrições contextuais (ex: "Nome do produto - descrição")
- Imagens de fallback com texto alternativo adequado

#### Contraste de Cores

- Componentes do Material Design fornecem taxas de contraste WCAG AA
- Estados de erro usam cor + ícones + texto
- Indicadores de foco são altamente visíveis

---

## 🧪 Recomendações de Teste

### Testes Automatizados

```bash
# Instalar axe-core para testes de acessibilidade
npm install --save-dev @axe-core/playwright

# Executar testes de acessibilidade
npm run test:a11y
```

### Checklist de Testes Manuais

#### Navegação por Teclado

- [ ] Navegar por todos os elementos interativos com Tab
- [ ] Verificar se os indicadores de foco estão visíveis
- [ ] Testar envio de formulário apenas com teclado
- [ ] Navegar pelos menus com setas

#### Testes com Leitor de Tela

- [ ] Testar com NVDA (Windows)
- [ ] Testar com JAWS (Windows)
- [ ] Testar com VoiceOver (macOS/iOS)
- [ ] Verificar se todo o conteúdo é anunciado corretamente

#### Testes Visuais

- [ ] Ampliar para 200% - o conteúdo deve permanecer utilizável
- [ ] Testar com modo de alto contraste
- [ ] Verificar se a cor não é o único indicador
- [ ] Verificar indicadores de foco em todos os níveis de zoom

---

## 📋 Checklist de Conformidade WCAG 2.1

### Nível A (Obrigatório)

- [x] 1.1.1 Conteúdo Não-textual - Texto alternativo para imagens
- [x] 1.3.1 Informações e Relacionamentos - HTML semântico
- [x] 2.1.1 Teclado - Toda funcionalidade via teclado
- [x] 2.4.1 Blocos de Contorno - Links de pular (via roteador)
- [x] 3.3.1 Identificação de Erro - Validação de formulário
- [x] 4.1.2 Nome, Função, Valor - Atributos ARIA

### Nível AA (Recomendado)

- [x] 1.4.3 Contraste (Mínimo) - Padrões do Material Design
- [x] 2.4.6 Cabeçalhos e Rótulos - Rótulos descritivos
- [x] 2.4.7 Foco Visível - Indicadores de foco
- [x] 3.2.4 Identificação Consistente - UI consistente
- [x] 3.3.3 Sugestão de Erro - Mensagens de erro úteis
- [x] 4.1.3 Mensagens de Status - Regiões dinâmicas

---

## 🚀 Melhorias Futuras

### Alta Prioridade

- [ ] Adicionar links de navegação rápida
- [ ] Implementar armadilha de foco para modais
- [ ] Adicionar documentação de atalhos de teclado
- [ ] Criar página de declaração de acessibilidade

### Média Prioridade

- [ ] Adicionar suporte a movimento reduzido
- [ ] Implementar modo escuro com contraste adequado
- [ ] Adicionar seletor de idioma (i18n)
- [ ] Criar visualizações de dados acessíveis

### Baixa Prioridade

- [ ] Adicionar suporte a controle por voz
- [ ] Implementar alternativas a gestos
- [ ] Adicionar tamanho de texto personalizável
- [ ] Criar painel de preferências de acessibilidade

---

## 📚 Recursos

### Documentação

- [Diretrizes WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Práticas de Autoria ARIA](https://www.w3.org/WAI/ARIA/apg/)
- [Acessibilidade do Angular Material](https://material.angular.io/cdk/a11y/overview)

### Ferramentas de Teste

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [Extensão WAVE para Navegador](https://wave.webaim.org/extension/)
- [Auditoria de Acessibilidade do Lighthouse](https://developers.google.com/web/tools/lighthouse)

### Leitores de Tela

- [NVDA (Gratuito)](https://www.nvaccess.org/)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/)
- [VoiceOver (Integrado no macOS/iOS)](https://www.apple.com/accessibility/voiceover/)

---

## 🤝 Contribuindo

Ao adicionar novas funcionalidades, certifique-se de:

1. Todos os elementos interativos são acessíveis por teclado
2. Atributos ARIA adequados são adicionados
3. Gerenciamento de foco é implementado
4. Testes com leitor de tela são realizados
5. Contraste de cores atende aos padrões WCAG AA

---

**Última Atualização:** Março 2026  
**Mantido por:** Equipe de Desenvolvimento
