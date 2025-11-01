# Deploy do Backend no Render.com

Este guia detalha o processo de deployment do backend Elysia/Bun no **Render.com**, uma plataforma com plano gratuito generoso e suporte nativo a Docker/Bun.

## 🎯 Por que Render?

- ✅ **Plano gratuito para web services** - Sem limitações artificiais
- ✅ **Suporte nativo a Docker** - Funciona perfeitamente com Bun
- ✅ **Deploy automático via Git** - Push e deploy automático
- ✅ **SSL gratuito** - HTTPS automático
- ✅ **Sem cartão de crédito** - Trial totalmente gratuito
- ✅ **750 horas/mês grátis** - Suficiente para projetos pessoais
- ⚠️ **Sleep após inatividade** - Após 15min sem requests (acorda em ~30s)

---

## 📋 Pré-requisitos

- Conta no [Render.com](https://render.com)
- Conta GitHub conectada ao Render
- Banco de dados Supabase configurado (veja [DEPLOY-SUPABASE.md](./DEPLOY-SUPABASE.md))
- Repositório Git com o código atualizado

---

## 🚀 Passo a Passo

### 1. Criar Conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em **Sign Up**
3. Escolha **Sign up with GitHub**
4. Autorize o Render a acessar seus repositórios

### 2. Criar Novo Web Service

1. No dashboard do Render, clique em **New +**
2. Selecione **Web Service**
3. Conecte seu repositório GitHub `portfolio77md`
4. Clique em **Connect** ao lado do repositório

### 3. Configurar o Serviço

Preencha os campos:

| Campo | Valor |
|-------|-------|
| **Name** | `bun-auth-backend` (ou nome de sua escolha) |
| **Region** | `Oregon (US West)` ou `São Paulo (South America)` |
| **Branch** | `main` |
| **Root Directory** | `bun-auth` |
| **Runtime** | `Docker` |
| **Instance Type** | `Free` |

### 4. Configurar Variáveis de Ambiente

Clique em **Advanced** e adicione as variáveis:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres.XXXXX:SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
DATABASE_MAX_CONNECTIONS=10
BETTER_AUTH_SECRET=seu_secret_de_32_caracteres_ou_mais
BETTER_AUTH_URL=https://seu-servico.onrender.com
FRONTEND_URL=https://77mdiasdev.vercel.app
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

**📝 Nota:** A `BETTER_AUTH_URL` será fornecida após o deploy. Use um placeholder por enquanto e atualize depois.

**🔐 Dica de Segurança:** Use o botão de "olho" para marcar variáveis sensíveis como `DATABASE_URL`, `BETTER_AUTH_SECRET`, e secrets do OAuth.

### 5. Health Check Path

- **Health Check Path**: `/`

Isso faz o Render verificar se o servidor está respondendo corretamente.

### 6. Criar o Serviço

1. Revise todas as configurações
2. Clique em **Create Web Service**
3. O Render começará o build automaticamente

### 7. Acompanhar o Deploy

- Você verá os logs em tempo real
- Build pode levar 3-5 minutos na primeira vez
- Aguarde até ver "Deploy live" no topo

### 8. Obter URL do Serviço

Após o deploy:
1. A URL aparecerá no topo: `https://seu-servico.onrender.com`
2. Copie essa URL

### 9. Atualizar BETTER_AUTH_URL

1. Vá em **Environment** (menu lateral)
2. Edite `BETTER_AUTH_URL` com a URL real do Render
3. Clique em **Save Changes**
4. O serviço será redeployado automaticamente

---

## 🔗 Conectar Frontend ao Backend

### Atualizar Frontend na Vercel

1. Edite localmente `react-auth/.env.production`:
   ```env
   VITE_BETTER_AUTH_URL=https://seu-servico.onrender.com
   ```

2. Commit e push:
   ```bash
   git add react-auth/.env.production
   git commit -m "Update backend URL to Render"
   git push
   ```

3. Vercel fará redeploy automaticamente

---

## ✅ Verificação Pós-Deploy

### 1. Testar Health Check

```bash
curl https://seu-servico.onrender.com/
```

Deve retornar: `"Hello Elysia"`

### 2. Testar Documentação OpenAPI

Acesse no navegador:
```
https://seu-servico.onrender.com/swagger
```

### 3. Testar Signup

```bash
curl -X POST https://seu-servico.onrender.com/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "password": "senha123",
    "name": "Teste User"
  }'
```

### 4. Verificar Logs

No Render:
1. Clique em **Logs** (menu lateral)
2. Veja logs em tempo real
3. Filtre por tipo: Info, Warning, Error

---

## 🐛 Troubleshooting

### Erro: "Connection refused" ao conectar no banco

**Causa**: DATABASE_URL incorreto ou Supabase inacessível

**Solução**:
1. Verifique a connection string do Supabase no Render
2. Confirme que está usando porta 6543 (Connection Pooler)
3. Teste conexão localmente com as mesmas credenciais:
   ```bash
   cd bun-auth
   bun run db:push:prod
   ```

### Erro: "Build failed"

**Causa**: Dockerfile ou dependências com problema

**Solução**:
1. Verifique os logs de build no Render
2. Confirme que `bun-auth` é o Root Directory
3. Teste build localmente:
   ```bash
   cd bun-auth
   docker build -t test-build .
   ```

### Serviço em "Sleep Mode"

**Causa**: Normal no plano gratuito após 15min de inatividade

**Solução**:
- **Aceitar**: Primeiro request após sleep leva ~30s
- **Prevenir** (pago): Upgrade para plano Starter ($7/mês, sem sleep)
- **Workaround** (não recomendado): Usar cron job para fazer ping regular

### Erro: "CORS policy error" no frontend

**Causa**: CORS não configurado corretamente

**Solução**:
1. Verifique `FRONTEND_URL` nas variáveis do Render
2. Confirme que `trustedOrigins` em `src/auth.ts` inclui a URL do frontend
3. Teste CORS:
   ```bash
   curl -H "Origin: https://77mdiasdev.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://seu-servico.onrender.com/auth/sign-in/email
   ```

### Porta não responde

**Causa**: Aplicação não está usando `process.env.PORT`

**Solução**:
- Já corrigido em `src/index.ts:49`: `.listen(process.env.PORT ?? 3333)`
- Verifique logs para confirmar que a porta está sendo usada

---

## 💰 Custos e Planos

### Free Tier
- ✅ **750 horas/mês** de runtime gratuito
- ✅ **100 GB de bandwidth** incluído
- ✅ **SSL automático**
- ⚠️ Sleep após 15min de inatividade
- ⚠️ Build limitado a 400 build minutes/mês

**Estimativa para este projeto**: Suficiente para desenvolvimento e projetos pessoais

### Starter Plan ($7/mês)
- ✅ **Sem sleep** - Always-on
- ✅ **400 build minutes** incluídos
- ✅ **100 GB bandwidth**
- Ideal para produção com tráfego moderado

### Standard Plan ($25/mês)
- ✅ **Sem sleep**
- ✅ **1000 build minutes**
- ✅ **500 GB bandwidth**
- ✅ **Horizontal scaling**
- Para aplicações com mais tráfego

---

## 🔄 Deploy Automático

Render já está configurado para deploy automático:

1. **Push to main** → Deploy automático
2. **Pull Request** → Preview deployment (planos pagos)
3. **Branch específica** → Configure nas settings

### Desabilitar Auto-Deploy

Se preferir deploy manual:
1. Vá em **Settings** → **Build & Deploy**
2. Desabilite **Auto-Deploy**
3. Use botão **Manual Deploy** quando quiser fazer deploy

---

## 📊 Monitoramento

### Logs em Tempo Real

No dashboard do Render:
- **Logs**: Veja stdout/stderr em tempo real
- **Events**: Histórico de deploys e events
- **Metrics**: CPU, memória, requests (planos pagos)

### Alertas

Configure alertas em **Settings** → **Notifications**:
- Deploy failed
- Service down
- High memory usage

---

## 🔐 Segurança

### Boas Práticas

1. ✅ **Use variáveis secretas** - Marque como "secret" no Render
2. ✅ **HTTPS apenas** - Render fornece automaticamente
3. ✅ **Configure CORS** apenas para domínios conhecidos
4. ✅ **Rotacione secrets** periodicamente
5. ✅ **Monitore logs** para atividades suspeitas

### Regenerar Secrets

```bash
# Gerar novo BETTER_AUTH_SECRET
openssl rand -base64 32
```

Atualize no Render → Redeploy automático

### Adicionar Domínio Customizado

1. Vá em **Settings** → **Custom Domain**
2. Adicione seu domínio (ex: `api.seudominio.com`)
3. Configure DNS conforme instruções
4. SSL será provisionado automaticamente

---

## 🔗 Links Úteis

- [Render Documentation](https://render.com/docs)
- [Render Status Page](https://status.render.com)
- [Render Community](https://community.render.com)
- [Render Pricing](https://render.com/pricing)

---

## 📝 Checklist de Deploy

Antes de fazer deploy, verifique:

- [ ] Código atualizado no GitHub
- [ ] `bun-auth/src/index.ts` usa `process.env.PORT`
- [ ] `bun-auth/Dockerfile` atualizado
- [ ] `render.yaml` criado na raiz do projeto (opcional)
- [ ] Variáveis de ambiente configuradas no Render
- [ ] DATABASE_URL do Supabase correto (porta 6543)
- [ ] `BETTER_AUTH_SECRET` gerado (32+ caracteres)
- [ ] Migrations aplicadas no Supabase (`bun run db:push:prod`)
- [ ] Frontend `.env.production` atualizado com URL do Render
- [ ] Testado health check: `curl https://seu-servico.onrender.com/`

---

## 🚀 Deploy Alternativo via render.yaml

O arquivo `render.yaml` na raiz do projeto permite deploy "infrastructure as code":

```yaml
services:
  - type: web
    name: bun-auth-backend
    runtime: docker
    rootDir: bun-auth
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false  # Será configurado manualmente
      # ... outras variáveis
```

**Para usar**:
1. Faça push do `render.yaml` para o repositório
2. No Render, escolha "New" → "Blueprint"
3. Selecione o repositório
4. Render lerá o YAML e criará automaticamente

---

## 💡 Dicas de Otimização

### Reduzir Tempo de Wake-up (Free Tier)

1. **Warm-up endpoint**: Criar rota `/health` leve
2. **Cron job externo** (não recomendado): Fazer ping regular
3. **Upgrade para Starter**: Melhor solução ($7/mês)

### Otimizar Build Time

1. **Cache de Docker layers**: Render faz automaticamente
2. **Dependências fixas**: Use `bun.lockb`
3. **Build paralelo**: Multi-stage Dockerfile já otimizado

### Monitorar Performance

1. Use **Render Metrics** (planos pagos)
2. Configure **New Relic** ou **Sentry** para APM
3. Monitore logs para erros recorrentes

---

Última atualização: 2025-10-31
