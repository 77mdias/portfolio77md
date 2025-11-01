#!/bin/bash

# ===================================
# 🎨 Visualização da Configuração Docker
# ===================================

# Cores
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

clear

echo -e "${BLUE}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🚀  CONFIGURAÇÃO DOCKER - VPS HOSTINGER  🚀              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    📊 ARQUITETURA                           │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "${YELLOW}                         Internet${NC}"
echo -e "${YELLOW}                            │${NC}"
echo -e "${YELLOW}                    [ Porta 80/443 ]${NC}"
echo -e "${YELLOW}                            │${NC}"
echo -e "${GREEN}                    ┌───────┴────────┐${NC}"
echo -e "${GREEN}                    │  Nginx Proxy   │${NC}"
echo -e "${GREEN}                    │  (Container)   │${NC}"
echo -e "${GREEN}                    └───────┬────────┘${NC}"
echo -e "${YELLOW}                            │${NC}"
echo -e "${YELLOW}              ┌─────────────┼─────────────┐${NC}"
echo -e "${YELLOW}              │             │             │${NC}"
echo -e "${MAGENTA}       ┌──────┴──────┐ ┌──────┴──────┐ │${NC}"
echo -e "${MAGENTA}       │   Frontend  │ │   Backend   │ │${NC}"
echo -e "${MAGENTA}       │ React+Nginx │ │  Bun+Elysia │ │${NC}"
echo -e "${MAGENTA}       │ (Container) │ │ (Container) │ │${NC}"
echo -e "${MAGENTA}       └─────────────┘ └──────┬──────┘ │${NC}"
echo -e "${YELLOW}                               │        │${NC}"
echo -e "${YELLOW}                        ┌──────┴────────┘${NC}"
echo -e "${YELLOW}                        │${NC}"
echo -e "${CYAN}                 ┌──────┴───────┐${NC}"
echo -e "${CYAN}                 │  PostgreSQL  │${NC}"
echo -e "${CYAN}                 │  (Container) │${NC}"
echo -e "${CYAN}                 └──────────────┘${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    📦 CONTAINERS                            │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} ${YELLOW}app-nginx-proxy${NC}  - Reverse Proxy (Portas 80, 443)"
echo -e "  ${GREEN}✓${NC} ${YELLOW}app-frontend${NC}     - React Application"
echo -e "  ${GREEN}✓${NC} ${YELLOW}app-backend${NC}      - Bun/Elysia API"
echo -e "  ${GREEN}✓${NC} ${YELLOW}app-postgres${NC}     - PostgreSQL Database"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    🌐 ENDPOINTS                             │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${GREEN}Frontend:${NC}    http://seu-dominio.com"
echo -e "  ${GREEN}Backend:${NC}     http://seu-dominio.com/api"
echo -e "  ${GREEN}Health:${NC}      http://seu-dominio.com/health"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    📁 ARQUIVOS CRIADOS                      │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${GREEN}📄${NC} docker-compose.vps.yml      - Config Docker para VPS"
echo -e "  ${GREEN}📄${NC} deploy-vps.sh               - Script automático de deploy"
echo -e "  ${GREEN}📄${NC} test-docker.sh              - Testa localmente"
echo -e "  ${GREEN}📄${NC} .env.vps.example            - Exemplo de variáveis"
echo -e "  ${GREEN}📄${NC} nginx/vps.conf              - Config Nginx"
echo -e "  ${GREEN}📄${NC} .dockerignore               - Ignora arquivos no build"
echo ""
echo -e "  ${MAGENTA}📚 DOCUMENTAÇÃO:${NC}"
echo -e "  ${GREEN}📘${NC} DEPLOY-VPS-HOSTINGER.md     - Guia completo"
echo -e "  ${GREEN}📗${NC} QUICK-START-VPS.md          - Guia rápido (15min)"
echo -e "  ${GREEN}📙${NC} CHECKLIST-DEPLOY.md         - Checklist de deploy"
echo -e "  ${GREEN}📕${NC} README.md                   - Documentação geral"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    🚀 COMANDOS RÁPIDOS                      │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${YELLOW}Deploy Completo:${NC}"
echo -e "    ${GREEN}sudo ./deploy-vps.sh${NC}"
echo ""
echo -e "  ${YELLOW}Teste Local:${NC}"
echo -e "    ${GREEN}./test-docker.sh${NC}"
echo ""
echo -e "  ${YELLOW}Ver Logs:${NC}"
echo -e "    ${GREEN}docker-compose -f docker-compose.vps.yml logs -f${NC}"
echo ""
echo -e "  ${YELLOW}Status:${NC}"
echo -e "    ${GREEN}docker-compose -f docker-compose.vps.yml ps${NC}"
echo ""
echo -e "  ${YELLOW}Restart:${NC}"
echo -e "    ${GREEN}docker-compose -f docker-compose.vps.yml restart${NC}"
echo ""
echo -e "  ${YELLOW}Parar:${NC}"
echo -e "    ${GREEN}docker-compose -f docker-compose.vps.yml down${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    ⚙️  RECURSOS                             │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${GREEN}✓${NC} Containers isolados em rede privada"
echo -e "  ${GREEN}✓${NC} Health checks automáticos"
echo -e "  ${GREEN}✓${NC} Limites de recursos configurados"
echo -e "  ${GREEN}✓${NC} SSL/TLS com Let's Encrypt"
echo -e "  ${GREEN}✓${NC} Backup automático do banco"
echo -e "  ${GREEN}✓${NC} Logs persistentes"
echo -e "  ${GREEN}✓${NC} Rate limiting configurado"
echo -e "  ${GREEN}✓${NC} Firewall (UFW)"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│                    📖 PRÓXIMOS PASSOS                       │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
echo ""
echo -e "  ${YELLOW}1.${NC} Configure o arquivo ${GREEN}.env${NC}"
echo -e "     ${CYAN}cp .env.vps.example .env${NC}"
echo -e "     ${CYAN}nano .env${NC}"
echo ""
echo -e "  ${YELLOW}2.${NC} Teste localmente (opcional)"
echo -e "     ${CYAN}./test-docker.sh${NC}"
echo ""
echo -e "  ${YELLOW}3.${NC} Commit e push para o repositório"
echo -e "     ${CYAN}git add .${NC}"
echo -e "     ${CYAN}git commit -m \"feat: add VPS deploy config\"${NC}"
echo -e "     ${CYAN}git push origin main${NC}"
echo ""
echo -e "  ${YELLOW}4.${NC} Na VPS, clone e faça deploy"
echo -e "     ${CYAN}ssh root@seu-ip-vps${NC}"
echo -e "     ${CYAN}cd /var/www && git clone [seu-repo] app${NC}"
echo -e "     ${CYAN}cd app && sudo ./deploy-vps.sh${NC}"
echo ""
echo -e "  ${YELLOW}5.${NC} Configure SSL (se tiver domínio)"
echo -e "     ${CYAN}Opção 6 no menu do deploy-vps.sh${NC}"
echo ""

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              ✨ Configuração Completa! ✨                    ║
║                                                               ║
║     Leia: DEPLOY-VPS-HOSTINGER.md para instruções           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"
echo ""
