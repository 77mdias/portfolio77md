# 🚀 Guia Rápido - Deploy VPS Hostinger

## ⚡ Quick Start

### 1️⃣ Na sua máquina local

```bash
# Clone o repositório (se ainda não tiver)
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo

# Configure variáveis
cp .env.example .env
nano .env  # Ajuste as configurações
```

### 2️⃣ Na VPS Hostinger

```bash
# Conecte via SSH
ssh root@seu-ip-vps

# Clone o projeto
cd /var/www
git clone https://github.com/seu-usuario/seu-repo.git app
cd app

# Configure .env
nano .env
# Cole suas configurações

# Execute o deploy
sudo ./deploy-vps.sh
# Escolha opção 1 (Deploy Completo)
```

### 3️⃣ Acesse sua aplicação

```
http://seu-ip-vps
```

---

## 📋 Configuração Mínima (.env)

```env
# Banco de Dados
DB_PASSWORD=SuaSenhaForte123!

# Autenticação
BETTER_AUTH_SECRET=$(openssl rand -base64 32)

# Domínio (use seu IP se não tiver domínio)
BETTER_AUTH_URL=http://seu-ip-vps
DOMAIN=seu-ip-vps
```

---

## 🔑 Comandos Essenciais

### Ver logs
```bash
docker-compose -f docker-compose.vps.yml logs -f
```

### Restart
```bash
docker-compose -f docker-compose.vps.yml restart
```

### Atualizar código
```bash
git pull
./deploy-vps.sh  # Opção 2
```

### Status
```bash
docker-compose -f docker-compose.vps.yml ps
```

### Backup
```bash
./deploy-vps.sh  # Opção 5
```

---

## 🆘 Problemas Comuns

### Container não inicia
```bash
docker-compose -f docker-compose.vps.yml logs nome-container
```

### Porta em uso
```bash
netstat -tulpn | grep :80
# Matar processo: kill -9 PID
```

### Espaço em disco cheio
```bash
docker system prune -af
```

---

## 📚 Documentação Completa

Para instruções detalhadas, veja: **[DEPLOY-VPS-HOSTINGER.md](./DEPLOY-VPS-HOSTINGER.md)**

---

## ✅ Checklist

- [ ] VPS com acesso SSH
- [ ] `.env` configurado
- [ ] Firewall: portas 22, 80, 443 abertas
- [ ] Deploy executado
- [ ] Aplicação acessível

---

**Tempo estimado:** 15-30 minutos
