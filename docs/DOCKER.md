# 🐳 Guia do Docker

## Visão Geral

Este guia explica como construir, executar e fazer deploy da aplicação Coffee Workshop usando Docker.

---

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

---

## 🚀 Início Rápido

### Usando Docker Compose (Recomendado)

```bash
# Iniciar a aplicação
docker-compose up -d

# Acessar a aplicação
open http://localhost:8080

# Ver logs
docker-compose logs -f

# Parar a aplicação
docker-compose down
```

### Usando Docker CLI

```bash
# Build da imagem
docker build -t coffee-workshop .

# Executar o container
docker run -d -p 8080:80 --name coffee-workshop coffee-workshop

# Acessar a aplicação
open http://localhost:8080

# Parar e remover
docker stop coffee-workshop
docker rm coffee-workshop
```

---

## 🏗️ Processo de Build

### Build Multi-Stage

O Dockerfile usa um build multi-stage para tamanho otimizado da imagem:

**Stage 1: Build** (node:22-alpine)

- Instalar dependências
- Build da aplicação Angular
- Saída: Arquivos estáticos prontos para produção

**Stage 2: Serve** (nginx:alpine)

- Copiar arquivos construídos
- Configurar Nginx
- Servir aplicação

### Argumentos de Build

```bash
docker build \
  --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --build-arg VCS_REF="$(git rev-parse --short HEAD)" \
  -t coffee-workshop .
```

---

## 📦 Detalhes da Imagem

### Imagens Base

- **Build**: `node:22-alpine` (~180 MB)
- **Runtime**: `nginx:alpine` (~40 MB)

### Tamanho da Imagem Final

- **Descomprimida**: ~50 MB
- **Comprimida**: ~20 MB

### Camadas

1. Camada base do Nginx
2. nginx.conf customizado
3. Arquivos da aplicação
4. Configuração de health check

---

## ⚙️ Configuração

### Configuração do Nginx

O `nginx.conf` inclui:

- Compressão Gzip
- Headers de cache para assets estáticos
- Headers de segurança
- Suporte ao roteamento do Angular
- Endpoint de health check

### Variáveis de Ambiente

```yaml
# docker-compose.yml
environment:
  - NODE_ENV=production
```

### Portas

- **Container**: 80
- **Host**: 8080 (configurável)

---

## 🔧 Scripts

### Script de Build

```bash
./scripts/docker-build.sh [tag]

# Exemplos
./scripts/docker-build.sh latest
./scripts/docker-build.sh v1.0.0
```

### Script de Push

```bash
./scripts/docker-push.sh [tag]

# Exemplos
./scripts/docker-push.sh latest
./scripts/docker-push.sh v1.0.0
```

### Script de Deploy Local

```bash
./scripts/deploy-local.sh
```

---

## 🏥 Verificações de Saúde

### Health Check do Docker

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1
```

### Endpoint de Saúde do Nginx

```bash
curl http://localhost:8080/health
# Resposta: healthy
```

### Verificar Saúde do Container

```bash
docker ps
# Procurar por status "healthy"

docker inspect coffee-workshop | grep -A 5 Health
```

---

## 🔒 Segurança

### Headers de Segurança

```nginx
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: no-referrer-when-downgrade
Content-Security-Policy: default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';
```

### Melhores Práticas

- ✅ Usuário não-root (nginx)
- ✅ Imagem base mínima (alpine)
- ✅ Build multi-stage
- ✅ Arquivo .dockerignore
- ✅ Health checks
- ✅ Headers de segurança

---

## 📊 Performance

### Otimizações

1. **Build multi-stage**: Reduz o tamanho da imagem final
2. **Alpine Linux**: Imagem base mínima
3. **Compressão Gzip**: Reduz largura de banda
4. **Headers de cache**: Melhora cache do lado cliente
5. **Servir arquivos estáticos**: Entrega rápida pelo Nginx

### Benchmarks

```bash
# Tamanho da imagem
docker images coffee-workshop
# ~50 MB

# Tempo de build
time docker build -t coffee-workshop .
# ~2-3 minutos (primeiro build)
# ~30 segundos (com cache)

# Tempo de inicialização
time docker run -d -p 8080:80 coffee-workshop
# ~2 segundos
```

---

## 🐛 Solução de Problemas

### Container não inicia

```bash
# Verificar logs
docker logs coffee-workshop

# Verificar se a porta está em uso
lsof -i :8080

# Inspecionar container
docker inspect coffee-workshop
```

### Build falha

```bash
# Limpar cache de build
docker builder prune

# Build sem cache
docker build --no-cache -t coffee-workshop .

# Verificar .dockerignore
cat .dockerignore
```

### Aplicação não acessível

```bash
# Verificar se container está rodando
docker ps

# Verificar mapeamento de porta
docker port coffee-workshop

# Testar endpoint de saúde
curl http://localhost:8080/health

# Verificar logs do nginx
docker exec coffee-workshop cat /var/log/nginx/error.log
```

---

## 🚢 Deploy

### Docker Hub

```bash
# Login
docker login

# Tag da imagem
docker tag coffee-workshop username/coffee-workshop:latest

# Push
docker push username/coffee-workshop:latest
```

### GitHub Container Registry

```bash
# Login
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag da imagem
docker tag coffee-workshop ghcr.io/username/coffee-workshop:latest

# Push
docker push ghcr.io/username/coffee-workshop:latest
```

### Pull e Executar

```bash
# Pull do registry
docker pull ghcr.io/username/coffee-workshop:latest

# Executar
docker run -d -p 8080:80 ghcr.io/username/coffee-workshop:latest
```

---

## 🔄 Docker Compose

### Serviços

```yaml
services:
  app:
    build: .
    ports:
      - '8080:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '--quiet', '--tries=1', '--spider', 'http://localhost/health']
      interval: 30s
      timeout: 10s
      retries: 3
```

### Comandos

```bash
# Iniciar serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Reiniciar serviço
docker-compose restart app

# Parar serviços
docker-compose down

# Rebuild e iniciar
docker-compose up -d --build

# Escalar serviços
docker-compose up -d --scale app=3
```

---

## 📈 Monitoramento

### Estatísticas do Container

```bash
# Estatísticas em tempo real
docker stats coffee-workshop

# Uso de recursos
docker inspect coffee-workshop | grep -A 10 Memory
```

### Logs

```bash
# Seguir logs
docker logs -f coffee-workshop

# Últimas 100 linhas
docker logs --tail 100 coffee-workshop

# Desde timestamp
docker logs --since 2024-03-09T10:00:00 coffee-workshop
```

---

## 🧪 Testes

### Testar Build

```bash
# Build da imagem de teste
docker build -t coffee-workshop:test .

# Executar testes no container
docker run --rm coffee-workshop:test npm test
```

### Testes de Integração

```bash
# Iniciar container
docker-compose up -d

# Aguardar healthy
sleep 5

# Executar testes
curl http://localhost:8080/health
curl http://localhost:8080/

# Limpeza
docker-compose down
```

---

## 📚 Recursos

### Documentação

- [Documentação do Docker](https://docs.docker.com/)
- [Documentação do Nginx](https://nginx.org/en/docs/)
- [Docker Compose](https://docs.docker.com/compose/)

### Melhores Práticas

- [Melhores Práticas do Docker](https://docs.docker.com/develop/dev-best-practices/)
- [Melhores Práticas do Dockerfile](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Builds Multi-stage](https://docs.docker.com/build/building/multi-stage/)

---

**Última Atualização**: Março 2026  
**Versão do Docker**: 20.10+  
**Status**: ✅ Pronto para Produção
