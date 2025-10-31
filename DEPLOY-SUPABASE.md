# Deploy em Produção com Supabase + Vercel

Este guia detalha o processo de deployment da aplicação fullstack em produção usando **Supabase** (PostgreSQL) e **Vercel** (hosting).

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com)
- Conta no [Vercel](https://vercel.com)
- Projeto configurado no Supabase com PostgreSQL
- Bun instalado localmente (para migrations)

---

## 🗄️ Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Crie um novo projeto
3. Escolha a região mais próxima (ex: South America - São Paulo)
4. Anote a senha do banco de dados

### 2. Obter Connection String

No painel do Supabase:

1. Vá em **Settings** → **Database**
2. Localize a seção **Connection String**
3. Escolha **Connection pooling** (recomendado)
4. Copie a string no formato:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```

#### 🔍 Diferenças entre Connection Modes:

| Modo | Porta | Quando usar |
|------|-------|-------------|
| **Transaction Mode** (pgBouncer) | 6543 | ✅ Recomendado para aplicações serverless (Vercel) |
| **Session Mode** (Direct) | 5432 | Use apenas se precisar de prepared statements ou transações complexas |

### 3. Configurar Políticas de Segurança (RLS)

O Supabase usa Row Level Security (RLS). Para este projeto usando Better Auth:

```sql
-- Desabilitar RLS nas tabelas de autenticação (Better Auth gerencia a segurança)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE verifications DISABLE ROW LEVEL SECURITY;
```

---

## 🔧 Configuração Local

### 1. Atualizar Backend (bun-auth/.env.production)

```bash
# Navegue até o diretório do backend
cd bun-auth

# Crie o arquivo .env.production (se não existir)
cp .env.example .env.production
```

Edite `bun-auth/.env.production` com suas credenciais:

```env
# Ambiente
NODE_ENV=production

# Database (Supabase - Connection Pooler)
DATABASE_URL="postgresql://postgres.XXXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres"
DATABASE_MAX_CONNECTIONS=10

# Better Auth
BETTER_AUTH_URL=https://seu-projeto.vercel.app
BETTER_AUTH_SECRET=seu_secret_de_32_caracteres_ou_mais

# Frontend URL para CORS
FRONTEND_URL=https://seu-projeto.vercel.app

# OAuth Providers
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

### 2. Executar Migrations no Supabase

```bash
cd bun-auth

# Gerar migrations (se houver alterações no schema)
bun run db:generate:prod

# Aplicar migrations no banco Supabase
bun run db:migrate:prod

# OU usar push (alternativa mais rápida, sem gerar arquivos de migração)
bun run db:push:prod
```

### 3. Atualizar Frontend (react-auth/.env.production)

```bash
cd react-auth
```

Edite `react-auth/.env.production`:

```env
# URL da API Backend em produção
VITE_BETTER_AUTH_URL=https://seu-projeto.vercel.app
```

---

## 🚀 Deploy na Vercel

### 1. Instalar Vercel CLI (opcional)

```bash
npm i -g vercel
```

### 2. Configurar Variáveis de Ambiente na Vercel

No painel da Vercel (**Settings** → **Environment Variables**), adicione:

| Nome | Valor | Tipo |
|------|-------|------|
| `NODE_ENV` | `production` | Production |
| `DATABASE_URL` | `postgresql://postgres.[ref]:...` | Production |
| `DATABASE_MAX_CONNECTIONS` | `10` | Production |
| `BETTER_AUTH_SECRET` | Seu secret (32+ chars) | Production (Secret) |
| `BETTER_AUTH_URL` | `https://seu-projeto.vercel.app` | Production |
| `FRONTEND_URL` | `https://seu-projeto.vercel.app` | Production |
| `GOOGLE_CLIENT_ID` | Seu Google Client ID | Production |
| `GOOGLE_CLIENT_SECRET` | Seu Google Client Secret | Production (Secret) |

### 3. Deploy via Git (Recomendado)

1. Faça commit das mudanças:
   ```bash
   git add .
   git commit -m "Configure production environment for Supabase"
   git push
   ```

2. Conecte o repositório na Vercel:
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Selecione seu repositório
   - Configure o projeto:
     - **Framework Preset**: Other
     - **Root Directory**: `./`
   - A Vercel detectará automaticamente o `vercel.json`

3. Clique em **Deploy**

### 4. Deploy via CLI (Alternativa)

```bash
# Na raiz do projeto
vercel

# Para deploy em produção
vercel --prod
```

---

## ✅ Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] DATABASE_URL do Supabase configurado (porta 6543)
- [ ] Migrations executadas no banco Supabase
- [ ] BETTER_AUTH_SECRET gerado (32+ caracteres)
- [ ] URLs atualizadas (BETTER_AUTH_URL, FRONTEND_URL)
- [ ] OAuth credentials configuradas (Google, Discord)
- [ ] RLS desabilitado nas tabelas de autenticação
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Arquivo .env.production **NÃO** commitado no git

---

## 🔍 Verificação Pós-Deploy

### 1. Testar Conexão com Banco

Acesse a URL da API:
```
https://seu-projeto.vercel.app/
```

Deve retornar: `"Hello Elysia"`

### 2. Testar Autenticação

```bash
# Criar usuário
curl -X POST https://77mdiasdev.vercel.app/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'
```

### 3. Verificar Logs

- **Vercel**: Acesse o painel do projeto → **Deployments** → Selecione o deploy → **Functions**
- **Supabase**: Acesse **Database** → **Logs** para ver queries

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ou "ECONNREFUSED"

**Causa**: Variável DATABASE_URL incorreta ou banco inacessível

**Solução**:
1. Verifique se copiou a Connection String correta do Supabase
2. Confirme que está usando a porta 6543 (Connection Pooler)
3. Verifique se o projeto no Supabase está ativo

### Erro: "SSL required"

**Causa**: NODE_ENV não está configurado como "production"

**Solução**:
```bash
# Adicione na Vercel
NODE_ENV=production
```

### Erro: "prepared statement already exists"

**Causa**: Usando porta 5432 (Session Mode) com prepared statements habilitados

**Solução**:
1. Use porta 6543 (Transaction Mode), OU
2. Configure `prepare: false` no cliente do banco (já configurado em `src/database/client.ts`)

### Erro: "Too many connections"

**Causa**: Pool de conexões esgotado

**Solução**:
1. Aumente `DATABASE_MAX_CONNECTIONS` (padrão: 10)
2. Verifique limites do plano do Supabase
3. Considere usar Connection Pooler (porta 6543)

---

## 📊 Monitoramento

### Supabase Dashboard

- **Database** → **Logs**: Monitore queries e erros
- **Database** → **Reports**: Visualize métricas de uso
- **Database** → **Advisors**: Receba recomendações de performance

### Vercel Analytics

- **Analytics**: Monitore requests e performance
- **Speed Insights**: Analise velocidade de carregamento
- **Logs**: Veja logs em tempo real das functions

---

## 🔐 Segurança em Produção

### Melhores Práticas

1. **Nunca** commite arquivos `.env.production` no git
2. Use secrets da Vercel para credenciais sensíveis
3. Gere um BETTER_AUTH_SECRET forte:
   ```bash
   openssl rand -base64 32
   ```
4. Configure CORS apenas para domínios conhecidos
5. Habilite RLS no Supabase para tabelas de dados de usuário
6. Use HTTPS apenas (Vercel já fornece)
7. Mantenha dependências atualizadas

### Rotação de Credenciais

Periodicamente, atualize:
- DATABASE_URL (caso necessite trocar senha)
- BETTER_AUTH_SECRET (invalida todas as sessões)
- OAuth secrets (Google, Discord)

---

## 📚 Recursos Adicionais

- [Documentação do Supabase](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Better Auth Docs](https://better-auth.com)
- [Drizzle ORM Docs](https://orm.drizzle.team)

---

## 💡 Dicas de Performance

1. **Use Connection Pooler** (porta 6543) - Reduz latência
2. **Configure DATABASE_MAX_CONNECTIONS** adequadamente
3. **Implemente caching** para sessões (Better Auth já faz isso)
4. **Monitore query performance** no Supabase Dashboard
5. **Use índices** nas colunas mais consultadas

---

Última atualização: 2025-10-31
