# Deploy do Backend no Railway

Este guia detalha o processo de deployment do backend Elysia/Bun no **Railway**, uma plataforma otimizada para Bun com suporte nativo e deploy simplificado.

## 🎯 Por que Railway?

- ✅ **Suporte nativo a Bun** - Sem hacks ou configurações complexas
- ✅ **Deploy automático via Git** - Push e deploy automático
- ✅ **Preço baseado em uso** - Pague apenas pelo que usar
- ✅ **$5 de crédito trial** - Teste gratuitamente
- ✅ **Variáveis de ambiente seguras** - Interface simples para secrets
- ✅ **Logs em tempo real** - Debug facilitado

---

## 📋 Pré-requisitos

- Conta no [Railway](https://railway.app)
- Conta GitHub conectada ao Railway
- Banco de dados Supabase configurado (veja [DEPLOY-SUPABASE.md](./DEPLOY-SUPABASE.md))
- Repositório Git com o código atualizado

---

## 🚀 Passo a Passo

### 1. Criar Projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login com GitHub
2. Clique em **New Project**
3. Selecione **Deploy from GitHub repo**
4. Escolha o repositório `portfolio77md` (ou seu nome de repo)
5. Railway detectará automaticamente que é um projeto Bun

### 2. Configurar Root Directory

Como este é um monorepo, você precisa especificar o diretório do backend:

1. No projeto Railway, clique em **Settings**
2. Em **Build**, configure:
   - **Root Directory**: `bun-auth`
   - **Watch Paths**: `bun-auth/**`
3. Clique em **Save Changes**

### 3. Configurar Variáveis de Ambiente

No painel do Railway, vá em **Variables** e adicione:

```env
# Ambiente
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://postgres.XXXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
DATABASE_MAX_CONNECTIONS=10

# Better Auth
BETTER_AUTH_SECRET=seu_secret_de_32_caracteres_ou_mais
BETTER_AUTH_URL=https://seu-projeto.up.railway.app
FRONTEND_URL=https://77mdiasdev.vercel.app

# OAuth Providers
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
DISCORD_CLIENT_ID=seu_discord_client_id (opcional)
DISCORD_CLIENT_SECRET=seu_discord_client_secret (opcional)
```

**⚠️ Importante:** A `BETTER_AUTH_URL` será fornecida pelo Railway após o primeiro deploy. Você pode usar um placeholder inicialmente e atualizar depois.

### 4. Primeiro Deploy

1. Clique em **Deploy** ou faça push para a branch principal
2. Railway começará o build automaticamente
3. Acompanhe os logs em tempo real
4. Após conclusão, você verá a URL do seu serviço

### 5. Obter URL do Serviço

1. No painel do projeto, clique em **Settings**
2. Em **Networking**, você verá a **Public URL**
3. Copie a URL (ex: `https://seu-projeto.up.railway.app`)

### 6. Atualizar BETTER_AUTH_URL

1. Volte em **Variables**
2. Edite `BETTER_AUTH_URL` com a URL real do Railway
3. O serviço será redeployado automaticamente

---

## 🔗 Conectar Frontend ao Backend

### Atualizar Frontend na Vercel

1. Edite localmente `react-auth/.env.production`:
   ```env
   VITE_BETTER_AUTH_URL=https://seu-projeto.up.railway.app
   ```

2. Commit e push:
   ```bash
   git add react-auth/.env.production
   git commit -m "Update backend URL to Railway"
   git push
   ```

3. Vercel fará redeploy automaticamente

---

## ✅ Verificação Pós-Deploy

### 1. Testar Health Check

```bash
curl https://seu-projeto.up.railway.app/
```

Deve retornar: `"Hello Elysia"`

### 2. Testar Rotas de Autenticação

```bash
# Ver OpenAPI documentation
curl https://seu-projeto.up.railway.app/swagger

# Testar signup
curl -X POST https://seu-projeto.up.railway.app/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'
```

### 3. Verificar Logs

No Railway:
1. Vá em **Deployments**
2. Clique no deploy ativo
3. Veja logs em tempo real

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao conectar no banco

**Causa**: DATABASE_URL incorreto ou Supabase inacessível

**Solução**:
1. Verifique a connection string do Supabase
2. Confirme que está usando porta 6543 (Connection Pooler)
3. Teste conexão localmente com as mesmas credenciais

### Erro: "Port already in use"

**Causa**: Railway não conseguiu atribuir porta dinâmica

**Solução**:
- O código já está configurado para `process.env.PORT ?? 3333`
- Verifique se não há conflito no `railway.json`
- Restart do serviço no Railway

### Erro: "CORS policy error" no frontend

**Causa**: CORS não configurado corretamente

**Solução**:
1. Verifique `FRONTEND_URL` nas variáveis do Railway
2. Confirme que `trustedOrigins` em `src/auth.ts` inclui a URL do frontend
3. Verifique se o CORS middleware está ativo em `src/index.ts`

### Build falha: "Command not found"

**Causa**: Railway não detectou Bun corretamente

**Solução**:
1. Verifique que `bun-auth` é o Root Directory
2. Confirme que `package.json` existe em `bun-auth/`
3. Railway usa Nixpacks que detecta Bun automaticamente

---

## 💰 Custos e Planos

### Free Trial
- $5 de crédito gratuito
- Sem necessidade de cartão de crédito inicialmente
- Ideal para testar o projeto

### Hobby Plan ($5/mês)
- $5 de crédito incluso + uso adicional
- Perfeito para projetos pessoais
- Preço baseado em:
  - Tempo de CPU
  - Memória RAM utilizada
  - Transferência de dados

### Estimativa para este projeto
- ~2-5 GB RAM/mês: $1-2
- Tráfego moderado: $0.5-1
- **Total estimado**: $2-5/mês

---

## 🔄 Deploy Automático

Railway já está configurado para deploy automático:

1. **Push to main** → Deploy automático
2. **Pull Request** → Preview deployment
3. **Branch protection** → Configure nas settings do Railway

### Desabilitar Auto-Deploy

Se preferir deploy manual:
1. Vá em **Settings** → **Deploy**
2. Desabilite **Auto-Deploy**
3. Use botão **Deploy** quando quiser fazer deploy

---

## 📊 Monitoramento

### Logs em Tempo Real

```bash
# Via Railway CLI (opcional)
npm install -g @railway/cli
railway login
railway logs
```

### Métricas no Dashboard

- **CPU Usage**: Veja uso de CPU em tempo real
- **Memory**: Monitore consumo de RAM
- **Network**: Tráfego in/out
- **Deployments**: Histórico de deploys

---

## 🔐 Segurança

### Boas Práticas

1. ✅ Use variáveis de ambiente para secrets
2. ✅ Habilite HTTPS apenas (Railway fornece automaticamente)
3. ✅ Configure CORS apenas para domínios conhecidos
4. ✅ Mantenha `DATABASE_URL` como variável secreta
5. ✅ Rotacione `BETTER_AUTH_SECRET` periodicamente

### Regenerar Secrets

```bash
# Gerar novo BETTER_AUTH_SECRET
openssl rand -base64 32
```

Atualize no Railway → Redeploy automático

---

## 🔗 Links Úteis

- [Railway Documentation](https://docs.railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli)
- [Nixpacks (Build System)](https://nixpacks.com)
- [Railway Pricing](https://railway.app/pricing)

---

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Código atualizado no GitHub
- [ ] `bun-auth/src/index.ts` usa `process.env.PORT`
- [ ] `railway.json` criado em `bun-auth/`
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] DATABASE_URL do Supabase correto (porta 6543)
- [ ] `BETTER_AUTH_SECRET` gerado (32+ caracteres)
- [ ] Migrations aplicadas no Supabase (`bun run db:push:prod`)
- [ ] Frontend `.env.production` atualizado com URL do Railway

---

Última atualização: 2025-10-31
