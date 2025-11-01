# ✅ Checklist de Deploy VPS Hostinger

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Pré-Deploy (Na sua máquina)

- [ ] Código testado localmente
- [ ] Todas as dependências atualizadas
- [ ] Build de produção funcionando
- [ ] `.env.vps.example` revisado
- [ ] Dockerfiles validados
- [ ] Commit e push do código
- [ ] Repositório Git acessível

## 🌐 Configuração VPS

- [ ] VPS contratada e acessível
- [ ] Acesso SSH funcionando
- [ ] Sistema operacional atualizado (`apt update && apt upgrade`)
- [ ] Firewall configurado (portas 22, 80, 443)
- [ ] Domínio apontado para IP (se aplicável)
- [ ] DNS propagado (teste: `nslookup seudominio.com`)

## 🔐 Segurança

- [ ] Senha forte para usuário root/sudo
- [ ] Chave SSH configurada (opcional)
- [ ] UFW ou iptables configurado
- [ ] Fail2ban instalado (recomendado)
- [ ] Portas desnecessárias fechadas
- [ ] `DB_PASSWORD` forte (min 16 caracteres)
- [ ] `BETTER_AUTH_SECRET` aleatório (32+ caracteres)

## 🐳 Docker

- [ ] Docker instalado (`docker --version`)
- [ ] Docker Compose instalado (`docker-compose --version`)
- [ ] Usuário no grupo docker (opcional)
- [ ] Docker daemon rodando (`systemctl status docker`)

## 📝 Configuração

- [ ] Repositório clonado em `/var/www/app`
- [ ] Arquivo `.env` criado e configurado
- [ ] `DB_PASSWORD` configurada
- [ ] `BETTER_AUTH_SECRET` configurada
- [ ] `BETTER_AUTH_URL` com domínio/IP correto
- [ ] `DOMAIN` configurado
- [ ] OAuth configurado (se usar)

## 🚀 Deploy

- [ ] Script `deploy-vps.sh` executável
- [ ] Deploy executado sem erros
- [ ] Todos os containers iniciados
- [ ] Containers com status "healthy"
- [ ] Logs sem erros críticos

## ✅ Verificações Pós-Deploy

### Containers
- [ ] Nginx rodando
- [ ] Backend rodando
- [ ] Frontend rodando
- [ ] PostgreSQL rodando
- [ ] Nenhum container reiniciando constantemente

### Conectividade
- [ ] Frontend acessível via navegador
- [ ] Backend API respondendo (`/api/`)
- [ ] Banco de dados conectado
- [ ] Health checks passando

### Funcionalidades
- [ ] Página inicial carrega
- [ ] Login funciona
- [ ] Registro funciona
- [ ] OAuth funciona (se configurado)
- [ ] Navegação funciona
- [ ] API responde corretamente

### Performance
- [ ] Tempo de resposta < 3s
- [ ] Recursos da VPS adequados
- [ ] Nenhum memory leak
- [ ] CPU < 80% em uso normal

## 🔒 SSL/HTTPS (Opcional)

- [ ] Domínio configurado e propagado
- [ ] Certbot executado
- [ ] Certificado SSL obtido
- [ ] Nginx configurado para HTTPS
- [ ] Redirect HTTP → HTTPS ativo
- [ ] Site acessível via HTTPS
- [ ] Certificado válido (sem warnings)
- [ ] Renovação automática configurada

## 📊 Monitoramento

- [ ] Logs configurados em `/logs`
- [ ] Backup automático configurado
- [ ] Cron job de backup testado
- [ ] Alertas configurados (opcional)
- [ ] Monitoramento de uptime (opcional)

## 📱 Testes Finais

### Frontend
- [ ] `http://seu-dominio.com` carrega
- [ ] Assets (CSS, JS) carregam
- [ ] Imagens carregam
- [ ] Navegação funciona
- [ ] Console sem erros

### Backend
- [ ] `http://seu-dominio.com/api` responde
- [ ] Endpoints funcionam
- [ ] Autenticação funciona
- [ ] Banco de dados conectado
- [ ] Migrations aplicadas

### Geral
- [ ] Mobile responsivo
- [ ] Desktop responsivo
- [ ] Diferentes navegadores
- [ ] Performance adequada
- [ ] SEO básico (se aplicável)

## 🔄 Manutenção

- [ ] Processo de atualização documentado
- [ ] Processo de backup documentado
- [ ] Processo de rollback documentado
- [ ] Equipe sabe como acessar logs
- [ ] Equipe sabe como fazer deploy
- [ ] Contatos de emergência definidos

## 📞 Informações de Acesso

Documente estas informações em local seguro:

```
VPS:
- IP: _______________
- SSH User: _______________
- SSH Port: _______________

Domínio:
- URL: _______________
- Provider: _______________

Banco de Dados:
- Host: localhost (dentro do container)
- Port: 5432
- Database: auth
- User: postgres
- Password: [CONFIDENCIAL]

Better Auth:
- Secret: [CONFIDENCIAL]
- URL: _______________

OAuth (se aplicável):
- Google Client ID: [CONFIDENCIAL]
- Discord Client ID: [CONFIDENCIAL]

Certificado SSL:
- Provider: Let's Encrypt
- Expira em: [DATA]
- Renovação: Automática
```

## 🎯 Métricas de Sucesso

- [ ] Uptime > 99%
- [ ] Tempo de resposta < 2s
- [ ] Taxa de erro < 1%
- [ ] Zero incidentes de segurança
- [ ] Backup diário funcionando
- [ ] SSL válido e atualizado

## 🆘 Contatos de Emergência

- **Hostinger Suporte**: _______________
- **Responsável Técnico**: _______________
- **Email**: _______________
- **Telefone**: _______________

## 📚 Links Úteis

- Documentação: [DEPLOY-VPS-HOSTINGER.md](./DEPLOY-VPS-HOSTINGER.md)
- Quick Start: [QUICK-START-VPS.md](./QUICK-START-VPS.md)
- Painel Hostinger: https://hpanel.hostinger.com
- Repositório: _______________

---

**Data do Deploy**: _______________
**Versão**: _______________
**Responsável**: _______________

---

## ✅ Status Geral

- [ ] **TUDO VERIFICADO E FUNCIONANDO**
- [ ] **DOCUMENTAÇÃO COMPLETA**
- [ ] **EQUIPE TREINADA**
- [ ] **DEPLOY CONCLUÍDO COM SUCESSO** 🎉

---

*Mantenha este checklist atualizado e use em cada deploy!*
