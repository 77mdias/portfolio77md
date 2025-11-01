#!/bin/bash

# ===================================
# Script de Deploy para VPS Hostinger
# ===================================

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  ${1}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Verificar se está rodando como root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "Este script precisa ser executado como root (use sudo)"
        exit 1
    fi
}

# Verificar se o arquivo .env existe
check_env_file() {
    if [ ! -f .env ]; then
        print_error "Arquivo .env não encontrado!"
        print_info "Copie o arquivo .env.example para .env e configure as variáveis:"
        print_info "  cp .env.example .env"
        print_info "  nano .env"
        exit 1
    fi
}

# Verificar dependências
check_dependencies() {
    print_header "Verificando Dependências"
    
    # Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado!"
        print_info "Instalando Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        systemctl enable docker
        systemctl start docker
        print_success "Docker instalado com sucesso"
    else
        print_success "Docker encontrado: $(docker --version)"
    fi
    
    # Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado!"
        print_info "Instalando Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        print_success "Docker Compose instalado com sucesso"
    else
        print_success "Docker Compose encontrado: $(docker-compose --version)"
    fi
}

# Criar diretórios necessários
create_directories() {
    print_header "Criando Diretórios"
    
    mkdir -p logs/nginx
    mkdir -p nginx/ssl
    mkdir -p backups
    
    print_success "Diretórios criados"
}

# Configurar firewall
configure_firewall() {
    print_header "Configurando Firewall"
    
    if command -v ufw &> /dev/null; then
        ufw --force enable
        ufw allow 22/tcp
        ufw allow 80/tcp
        ufw allow 443/tcp
        ufw reload
        print_success "Firewall configurado"
    else
        print_warning "UFW não encontrado, pulando configuração de firewall"
    fi
}

# Parar containers antigos
stop_old_containers() {
    print_header "Parando Containers Antigos"
    
    if [ -f docker-compose.vps.yml ]; then
        docker-compose -f docker-compose.vps.yml down || true
        print_success "Containers antigos parados"
    else
        print_warning "Nenhum container encontrado para parar"
    fi
}

# Build e start dos containers
deploy_containers() {
    print_header "Fazendo Deploy dos Containers"
    
    print_info "Building images..."
    docker-compose -f docker-compose.vps.yml build --no-cache
    
    print_info "Starting containers..."
    docker-compose -f docker-compose.vps.yml up -d
    
    print_success "Containers iniciados com sucesso"
}

# Verificar saúde dos containers
check_health() {
    print_header "Verificando Saúde dos Containers"
    
    sleep 10  # Aguardar containers iniciarem
    
    # Verificar status
    docker-compose -f docker-compose.vps.yml ps
    
    # Verificar logs de erro
    print_info "Verificando logs..."
    docker-compose -f docker-compose.vps.yml logs --tail=50
}

# Configurar SSL com Let's Encrypt
setup_ssl() {
    print_header "Configuração SSL (Opcional)"
    
    read -p "Deseja configurar SSL com Let's Encrypt? (s/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        read -p "Digite seu domínio (ex: exemplo.com): " domain
        read -p "Digite seu email: " email
        
        print_info "Obtendo certificado SSL..."
        
        docker run -it --rm \
            -v "$(pwd)/nginx/ssl:/etc/letsencrypt" \
            -v "$(pwd)/nginx/ssl:/var/lib/letsencrypt" \
            -p 80:80 \
            certbot/certbot certonly \
            --standalone \
            --preferred-challenges http \
            --agree-tos \
            --email "$email" \
            -d "$domain"
        
        print_success "Certificado SSL obtido!"
        print_warning "Descomente as linhas SSL no arquivo nginx/vps.conf"
        print_info "Depois execute: docker-compose -f docker-compose.vps.yml restart nginx"
    else
        print_info "Pulando configuração SSL"
    fi
}

# Backup do banco de dados
backup_database() {
    print_header "Criando Backup do Banco de Dados"
    
    BACKUP_FILE="backups/db_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose -f docker-compose.vps.yml exec -T postgres pg_dump -U postgres auth > "$BACKUP_FILE"
    
    if [ -f "$BACKUP_FILE" ]; then
        print_success "Backup criado: $BACKUP_FILE"
    else
        print_error "Falha ao criar backup"
    fi
}

# Limpeza de recursos antigos
cleanup() {
    print_header "Limpando Recursos Antigos"
    
    docker system prune -f
    docker volume prune -f
    
    print_success "Limpeza concluída"
}

# Menu principal
show_menu() {
    echo ""
    print_header "Deploy VPS Hostinger - Menu"
    echo "1) Deploy Completo (primeira instalação)"
    echo "2) Atualizar Aplicação (rebuild + restart)"
    echo "3) Restart Containers"
    echo "4) Ver Logs"
    echo "5) Backup Banco de Dados"
    echo "6) Configurar SSL"
    echo "7) Status dos Containers"
    echo "8) Parar Aplicação"
    echo "9) Limpeza de Recursos"
    echo "0) Sair"
    echo ""
    read -p "Escolha uma opção: " choice
    
    case $choice in
        1)
            check_root
            check_env_file
            check_dependencies
            create_directories
            configure_firewall
            deploy_containers
            check_health
            setup_ssl
            print_success "Deploy completo finalizado!"
            ;;
        2)
            check_root
            stop_old_containers
            deploy_containers
            check_health
            print_success "Atualização concluída!"
            ;;
        3)
            docker-compose -f docker-compose.vps.yml restart
            print_success "Containers reiniciados"
            ;;
        4)
            docker-compose -f docker-compose.vps.yml logs -f
            ;;
        5)
            backup_database
            ;;
        6)
            check_root
            setup_ssl
            ;;
        7)
            docker-compose -f docker-compose.vps.yml ps
            ;;
        8)
            docker-compose -f docker-compose.vps.yml down
            print_success "Aplicação parada"
            ;;
        9)
            cleanup
            ;;
        0)
            print_info "Saindo..."
            exit 0
            ;;
        *)
            print_error "Opção inválida"
            show_menu
            ;;
    esac
}

# Executar menu
if [ "$1" == "--full" ]; then
    check_root
    check_env_file
    check_dependencies
    create_directories
    configure_firewall
    deploy_containers
    check_health
    setup_ssl
else
    show_menu
fi
