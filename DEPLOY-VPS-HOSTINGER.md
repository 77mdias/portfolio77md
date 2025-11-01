# 🚀 Deploy na VPS Hostinger - Guia Completo

Este guia mostra como fazer o deploy da sua aplicação Full Stack (React + Bun + PostgreSQL) em uma VPS da Hostinger usando Docker.

## 📋 Pré-requisitos

- VPS Hostinger contratada (recomendado: mínimo 2GB RAM)
- Acesso SSH à VPS
- Domínio configurado (opcional, mas recomendado para SSL)
- Git instalado localmente

## 🔧 Preparação Local

### 1. Configure as Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env
nano .env
```

**Variáveis obrigatórias:**
```env
DB_NAME=auth
DB_USER=postgres
DB_PASSWORD=SuaSenhaForte123!

BETTER_AUTH_SECRET=ChaveSecretaAleatoria32Caracteres

# Se tiver domínio:
BETTER_AUTH_URL=https://seudominio.com
DOMAIN=seudominio.com

# Se não tiver domínio (usar IP):
BETTER_AUTH_URL=http://seu-ip-vps
DOMAIN=seu-ip-vps
```

**Gerar senha segura:**
```bash
# No Linux/Mac:
openssl rand -base64 32

# Ou online: https://passwordsgenerator.net/
```

### 2. Teste Localmente (Opcional)

```bash
# Build e teste
docker-compose -f docker-compose.vps.yml build
docker-compose -f docker-compose.vps.yml up -d

# Verificar
docker-compose -f docker-compose.vps.yml ps
docker-compose -f docker-compose.vps.yml logs -f

# Parar
docker-compose -f docker-compose.vps.yml down
```

## 🌐 Configuração da VPS Hostinger

### 1. Conectar via SSH

```bash
ssh root@seu-ip-vps
# Ou se tiver usuário diferente:
ssh usuario@seu-ip-vps
```

### 2. Atualizar Sistema

```bash
apt update && apt upgrade -y
```

### 3. Instalar Git

```bash
apt install -y git
```

### 4. Clonar o Repositório

```bash
# Criar diretório
mkdir -p /var/www
cd /var/www

# Clonar (ajuste a URL do seu repositório)
git clone https://github.com/seu-usuario/seu-repo.git app
cd app
```

### 5. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env
nano .env
```

Cole as variáveis configuradas anteriormente e ajuste:
- `BETTER_AUTH_URL` para seu domínio ou IP
- `DOMAIN` para seu domínio ou IP
- Senhas fortes para `DB_PASSWORD` e `BETTER_AUTH_SECRET`

## 🚀 Deploy Automático

### Opção 1: Deploy Completo (Primeira Vez)

```bash
# Executar script de deploy
sudo ./deploy-vps.sh
```

Selecione a opção **1) Deploy Completo**

O script irá:
- ✅ Instalar Docker e Docker Compose (se necessário)
- ✅ Configurar firewall
- ✅ Criar diretórios necessários
- ✅ Fazer build das imagens
- ✅ Iniciar todos os containers
- ✅ Verificar saúde da aplicação
- ✅ Oferecer configuração SSL (opcional)

### Opção 2: Deploy Manual

```bash
# 1. Criar diretórios
mkdir -p logs/nginx nginx/ssl backups

# 2. Build das imagens
docker-compose -f docker-compose.vps.yml build --no-cache

# 3. Iniciar containers
docker-compose -f docker-compose.vps.yml up -d

# 4. Verificar logs
docker-compose -f docker-compose.vps.yml logs -f
```

## 🔒 Configurar SSL (HTTPS)

### Com Domínio Próprio

1. **Apontar Domínio para VPS:**
   - No painel do seu domínio, crie um registro A:
     - Nome: `@` (ou `www`)
     - Tipo: `A`
     - Valor: IP da VPS
     - TTL: 3600

2. **Aguardar Propagação DNS** (até 24h, geralmente minutos)

3. **Obter Certificado SSL:**

```bash
# Via script
sudo ./deploy-vps.sh
# Selecione opção 6) Configurar SSL

# Ou manualmente:
docker run -it --rm \
  -v "$(pwd)/nginx/ssl:/etc/letsencrypt" \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --agree-tos \
  --email seu-email@exemplo.com \
  -d seudominio.com
```

4. **Ativar SSL no Nginx:**

```bash
# Editar configuração
nano nginx/vps.conf

# Descomentar linhas SSL (remover #):
# - listen 443 ssl http2;
# - ssl_certificate
# - ssl_certificate_key
# - Bloco de redirect HTTP para HTTPS

# Reiniciar Nginx
docker-compose -f docker-compose.vps.yml restart nginx
```

## 📊 Monitoramento e Manutenção

### Ver Logs

```bash
# Todos os containers
docker-compose -f docker-compose.vps.yml logs -f

# Apenas backend
docker-compose -f docker-compose.vps.yml logs -f backend

# Apenas frontend
docker-compose -f docker-compose.vps.yml logs -f frontend

# Últimas 100 linhas
docker-compose -f docker-compose.vps.yml logs --tail=100
```

### Status dos Containers

```bash
docker-compose -f docker-compose.vps.yml ps
```

### Restart dos Containers

```bash
# Todos
docker-compose -f docker-compose.vps.yml restart

# Apenas um
docker-compose -f docker-compose.vps.yml restart backend
```

### Atualizar Aplicação

```bash
# 1. Fazer pull do código
git pull origin main

# 2. Rebuild e restart
sudo ./deploy-vps.sh
# Selecione opção 2) Atualizar Aplicação

# Ou manualmente:
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml build --no-cache
docker-compose -f docker-compose.vps.yml up -d
```

## 💾 Backup do Banco de Dados

### Backup Manual

```bash
# Via script
sudo ./deploy-vps.sh
# Selecione opção 5) Backup Banco de Dados

# Ou manualmente:
docker-compose -f docker-compose.vps.yml exec postgres \
  pg_dump -U postgres auth > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Backup Automático (Cron)

```bash
# Editar crontab
crontab -e

# Adicionar linha (backup diário às 2h da manhã):
0 2 * * * cd /var/www/app && docker-compose -f docker-compose.vps.yml exec -T postgres pg_dump -U postgres auth > backups/backup_$(date +\%Y\%m\%d).sql

# Limpeza de backups antigos (manter últimos 7 dias):
0 3 * * * find /var/www/app/backups -name "*.sql" -mtime +7 -delete
```

### Restaurar Backup

```bash
# Parar backend
docker-compose -f docker-compose.vps.yml stop backend

# Restaurar
cat backups/backup_20240101.sql | \
  docker-compose -f docker-compose.vps.yml exec -T postgres \
  psql -U postgres auth

# Reiniciar
docker-compose -f docker-compose.vps.yml start backend
```

## 🔥 Firewall e Segurança

### Configurar UFW (Ubuntu Firewall)

```bash
# Habilitar firewall
ufw enable

# Permitir SSH (IMPORTANTE fazer antes de habilitar!)
ufw allow 22/tcp

# Permitir HTTP e HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Ver regras
ufw status verbose

# Recarregar
ufw reload
```

### Fail2Ban (Proteção contra Brute Force)

```bash
# Instalar
apt install -y fail2ban

# Configurar
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
nano /etc/fail2ban/jail.local

# Habilitar e iniciar
systemctl enable fail2ban
systemctl start fail2ban
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose -f docker-compose.vps.yml logs container-name

# Ver recursos
docker stats

# Entrar no container
docker-compose -f docker-compose.vps.yml exec backend sh
```

### Banco de dados com erro

```bash
# Verificar logs
docker-compose -f docker-compose.vps.yml logs postgres

# Acessar banco
docker-compose -f docker-compose.vps.yml exec postgres psql -U postgres auth

# Verificar conexão
docker-compose -f docker-compose.vps.yml exec backend sh
ping postgres
```

### Portas em uso

```bash
# Ver o que está usando a porta
netstat -tulpn | grep :80
netstat -tulpn | grep :443

# Parar processo
kill -9 PID
```

### Limpeza de espaço em disco

```bash
# Via script
sudo ./deploy-vps.sh
# Selecione opção 9) Limpeza de Recursos

# Ou manualmente:
docker system prune -af
docker volume prune -f

# Ver uso de disco
df -h
docker system df
```

## 📱 Acessar Aplicação

- **Frontend:** `http://seu-ip-vps` ou `https://seudominio.com`
- **Backend API:** `http://seu-ip-vps/api` ou `https://seudominio.com/api`

## ⚙️ Variáveis de Ambiente - Referência Completa

```env
# === Database ===
DB_NAME=auth                      # Nome do banco
DB_USER=postgres                  # Usuário do banco
DB_PASSWORD=senha-forte           # Senha do banco

# === Better Auth ===
BETTER_AUTH_SECRET=chave-32-chars # Chave secreta (32+ caracteres)
BETTER_AUTH_URL=https://domain.com # URL pública da aplicação

# === Domain ===
DOMAIN=seudominio.com             # Seu domínio

# === OAuth (Opcional) ===
GOOGLE_CLIENT_ID=                 # Google OAuth
GOOGLE_CLIENT_SECRET=
DISCORD_CLIENT_ID=                # Discord OAuth
DISCORD_CLIENT_SECRET=
```

## 📚 Comandos Úteis

```bash
# Ver todos os containers
docker ps -a

# Parar tudo
docker-compose -f docker-compose.vps.yml down

# Remover volumes (CUIDADO: apaga dados!)
docker-compose -f docker-compose.vps.yml down -v

# Ver uso de recursos
docker stats

# Seguir logs em tempo real
docker-compose -f docker-compose.vps.yml logs -f --tail=100

# Executar comando no container
docker-compose -f docker-compose.vps.yml exec backend sh

# Ver IP dos containers
docker network inspect app-network
```

## 🎯 Checklist de Deploy

- [ ] VPS configurada e acessível via SSH
- [ ] Domínio apontado para IP da VPS (opcional)
- [ ] Arquivo `.env` configurado com senhas fortes
- [ ] Firewall configurado (portas 22, 80, 443)
- [ ] Docker e Docker Compose instalados
- [ ] Containers rodando sem erros
- [ ] Banco de dados acessível
- [ ] Backend respondendo em `/api`
- [ ] Frontend acessível
- [ ] SSL configurado (se tiver domínio)
- [ ] Backups automáticos configurados

## 🆘 Suporte

Se tiver problemas:

1. Verifique os logs: `docker-compose -f docker-compose.vps.yml logs`
2. Verifique status: `docker-compose -f docker-compose.vps.yml ps`
3. Verifique firewall: `ufw status`
4. Verifique DNS: `nslookup seudominio.com`
5. Teste conectividade: `curl -I http://seu-ip-vps`

---

**Desenvolvido com ❤️ usando Docker, Bun, React e PostgreSQL**
