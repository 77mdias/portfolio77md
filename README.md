# 🚀 Full Stack Application - React + Bun + PostgreSQL

Aplicação Full Stack moderna com autenticação completa usando Better Auth, React, Bun/Elysia e PostgreSQL.

## 📋 Stack Tecnológica

### Frontend
- ⚛️ **React 19** - Interface de usuário
- 🎨 **Tailwind CSS** - Estilização
- 🎯 **React Router** - Roteamento
- 📝 **React Hook Form** - Formulários
- 🔐 **Better Auth** - Autenticação

### Backend
- 🚀 **Bun** - Runtime JavaScript ultra-rápido
- 🦊 **Elysia** - Framework web
- 🔒 **Better Auth** - Sistema de autenticação
- 🗃️ **Drizzle ORM** - ORM TypeScript-first
- ✅ **Zod** - Validação de schemas

### Banco de Dados
- 🐘 **PostgreSQL 15** - Banco relacional
- 📊 **Drizzle Kit** - Migrações

### DevOps
- 🐳 **Docker** - Containerização
- 🔧 **Docker Compose** - Orquestração
- 🌐 **Nginx** - Reverse proxy

## 🎯 Funcionalidades

- ✅ Autenticação completa (Login/Registro)
- ✅ OAuth (Google, Discord)
- ✅ Gerenciamento de sessões
- ✅ Perfil de usuário
- ✅ Segurança (rate limiting, CORS)
- ✅ API RESTful
- ✅ Documentação OpenAPI

## 🚀 Deploy

### Deploy na VPS Hostinger (Recomendado)

Para fazer deploy na VPS da Hostinger, siga o guia completo:

**📖 [DEPLOY-VPS-HOSTINGER.md](./DEPLOY-VPS-HOSTINGER.md)** - Guia completo passo a passo

**⚡ [QUICK-START-VPS.md](./QUICK-START-VPS.md)** - Guia rápido (15 minutos)

**Resumo:**
```bash
# 1. Na VPS
ssh root@seu-ip-vps
cd /var/www
git clone https://github.com/seu-usuario/seu-repo.git app
cd app

# 2. Configurar
cp .env.vps.example .env
nano .env  # Ajuste as configurações

# 3. Deploy
sudo ./deploy-vps.sh
```

### Outras Opções de Deploy

- **Render.com**: Veja [DEPLOY-RENDER.md](./DEPLOY-RENDER.md)
- **Supabase**: Veja [DEPLOY-SUPABASE.md](./DEPLOY-SUPABASE.md)

## 💻 Desenvolvimento Local

### Pré-requisitos

- [Bun](https://bun.sh) instalado
- [Node.js](https://nodejs.org) 18+ (para o frontend)
- [PostgreSQL](https://postgresql.org) 15+ (ou Docker)
- [Git](https://git-scm.com)

### Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

2. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
# Edite o .env com suas configurações
```

3. **Inicie com Docker (Recomendado):**
```bash
docker-compose up -d
```

Ou manualmente:

**Backend:**
```bash
cd bun-auth
bun install
bun db:migrate
bun dev
```

**Frontend:**
```bash
cd react-auth
npm install
npm run dev
```

### URLs de Desenvolvimento

- Frontend: http://localhost:5173
- Backend: http://localhost:3333
- Banco: localhost:5432

## 🧪 Testes

### Testar Docker Localmente

```bash
./test-docker.sh
```

Este script:
- ✅ Faz build das imagens
- ✅ Inicia todos os containers
- ✅ Verifica saúde da aplicação
- ✅ Mostra logs e status

## 📁 Estrutura do Projeto

```
.
├── bun-auth/              # Backend (Bun + Elysia)
│   ├── src/
│   │   ├── database/      # Schemas e migrações
│   │   ├── http/          # Rotas e plugins
│   │   └── index.ts       # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── react-auth/            # Frontend (React)
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── lib/           # Utilitários
│   │   └── main.tsx       # Entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── nginx/                 # Configurações Nginx
│   ├── vps.conf          # Config para VPS
│   └── ssl/              # Certificados SSL
│
├── backups/              # Backups do banco
├── logs/                 # Logs da aplicação
│
├── docker-compose.yml            # Desenvolvimento
├── docker-compose.vps.yml        # Produção VPS
├── docker-compose.prod.yml       # Produção geral
│
├── deploy-vps.sh                 # Script deploy VPS
├── test-docker.sh                # Teste local
│
├── .env.example                  # Exemplo variáveis dev
├── .env.vps.example             # Exemplo variáveis VPS
│
└── README.md
```

## 🔧 Scripts Úteis

### Backend (bun-auth/)
```bash
bun dev              # Desenvolvimento com hot reload
bun db:generate      # Gerar migrations
bun db:migrate       # Executar migrations
```

### Frontend (react-auth/)
```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run build:prod   # Build otimizado
npm run preview      # Preview do build
```

### Docker
```bash
# Desenvolvimento
docker-compose up -d
docker-compose logs -f
docker-compose down

# VPS/Produção
docker-compose -f docker-compose.vps.yml up -d
docker-compose -f docker-compose.vps.yml logs -f
docker-compose -f docker-compose.vps.yml down
```

## 🌍 Variáveis de Ambiente

### Desenvolvimento (.env.example)
```env
DB_USER=docker
DB_PASSWORD=docker
BETTER_AUTH_SECRET=dev-secret
BETTER_AUTH_URL=http://localhost:3333
```

### Produção (.env.vps.example)
```env
DB_PASSWORD=senha-forte
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=https://seudominio.com
DOMAIN=seudominio.com
```

## 🔐 Segurança

- ✅ Variáveis de ambiente para secrets
- ✅ CORS configurado
- ✅ Rate limiting na API
- ✅ Helmet headers
- ✅ SSL/TLS (produção)
- ✅ Firewall configurado
- ✅ Containers isolados

## 📚 Documentação

- [Deploy VPS Hostinger](./DEPLOY-VPS-HOSTINGER.md) - Guia completo
- [Quick Start VPS](./QUICK-START-VPS.md) - Guia rápido
- [Deploy Render](./DEPLOY-RENDER.md) - Deploy alternativo
- [Deploy Supabase](./DEPLOY-SUPABASE.md) - Deploy alternativo

## 🐛 Troubleshooting

### Container não inicia
```bash
docker-compose -f docker-compose.vps.yml logs nome-container
```

### Porta em uso
```bash
sudo netstat -tulpn | grep :80
sudo kill -9 PID
```

### Limpar Docker
```bash
docker system prune -af
docker volume prune -f
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Seu Nome]

## 🙏 Agradecimentos

- [Better Auth](https://better-auth.com)
- [Bun](https://bun.sh)
- [Elysia](https://elysiajs.com)
- [Drizzle](https://orm.drizzle.team)

---

**⭐ Se este projeto foi útil, considere dar uma estrela!**
