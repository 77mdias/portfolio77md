#!/bin/bash

# ===================================
# Script de Teste Local
# ===================================
# Testa a aplicação com Docker antes do deploy

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Teste Local com Docker${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Verificar .env
if [ ! -f .env ]; then
    print_warning "Arquivo .env não encontrado. Criando do exemplo..."
    cp .env.example .env
    print_info "Configure o .env antes de continuar: nano .env"
    exit 1
fi

print_success ".env encontrado"

# Parar containers antigos
print_info "Parando containers antigos..."
docker-compose -f docker-compose.vps.yml down 2>/dev/null || true

# Build
print_info "Building images..."
docker-compose -f docker-compose.vps.yml build --no-cache

# Start
print_info "Starting containers..."
docker-compose -f docker-compose.vps.yml up -d

# Aguardar
print_info "Aguardando containers iniciarem..."
sleep 10

# Status
echo ""
print_info "Status dos containers:"
docker-compose -f docker-compose.vps.yml ps

# Health check
echo ""
print_info "Verificando saúde..."

# Backend
if curl -f http://localhost/api/ &> /dev/null; then
    print_success "Backend está respondendo"
else
    print_warning "Backend não está respondendo"
fi

# Frontend
if curl -f http://localhost/ &> /dev/null; then
    print_success "Frontend está respondendo"
else
    print_warning "Frontend não está respondendo"
fi

# Logs
echo ""
print_info "Últimos logs:"
docker-compose -f docker-compose.vps.yml logs --tail=20

echo ""
print_success "Teste concluído!"
echo ""
print_info "URLs de acesso:"
echo "  - Frontend: http://localhost"
echo "  - Backend:  http://localhost/api"
echo ""
print_info "Comandos úteis:"
echo "  - Ver logs:   docker-compose -f docker-compose.vps.yml logs -f"
echo "  - Status:     docker-compose -f docker-compose.vps.yml ps"
echo "  - Parar:      docker-compose -f docker-compose.vps.yml down"
echo ""
