# Configuração Docker para VPS Hostinger

Este diretório contém a configuração do Docker para deploy na VPS.

## 📁 Arquivos

- **docker-compose.vps.yml** - Configuração Docker Compose para produção
- **nginx/vps.conf** - Configuração Nginx com reverse proxy
- **deploy-vps.sh** - Script automatizado de deploy
- **test-docker.sh** - Script para testar localmente

## 🚀 Como usar

Veja o guia completo: [DEPLOY-VPS-HOSTINGER.md](../DEPLOY-VPS-HOSTINGER.md)

## 🔧 Arquitetura

```
                    Internet
                        |
                   [Porta 80/443]
                        |
                    Nginx Proxy
                   /          \
            [Frontend]      [Backend]
                 |              |
                 └─────┬────────┘
                       |
                  PostgreSQL
```

## 📊 Recursos

- **Nginx**: Reverse proxy + SSL
- **Frontend**: React + Nginx (container separado)
- **Backend**: Bun + Elysia
- **Database**: PostgreSQL 15 Alpine
- **Volumes**: Dados persistentes

## 🛡️ Segurança

- Containers isolados em rede privada
- Firewall configurado (UFW)
- SSL/TLS opcional (Let's Encrypt)
- Health checks automáticos
- Limites de recursos por container
