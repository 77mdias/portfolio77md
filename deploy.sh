#!/bin/bash

# Script de deploy para diferentes ambientes
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para logging
log() {
    echo -e "${GREEN}[DEPLOY]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker primeiro."
        exit 1
    fi
}

# Build e deploy para desenvolvimento
deploy_dev() {
    log "🚀 Iniciando deploy de desenvolvimento..."
    check_docker
    
    # Parar containers existentes
    docker-compose down
    
    # Build e iniciar
    docker-compose up --build -d
    
    # Aguardar serviços ficarem prontos
    log "⏳ Aguardando serviços ficarem prontos..."
    sleep 10
    
    # Verificar status
    docker-compose ps
    
    log "✅ Deploy de desenvolvimento concluído!"
    log "🌐 Frontend: http://localhost"
    log "🔧 Backend: http://localhost:3333"
    log "🗄️  pgAdmin: http://localhost:8080"
}

# Build e deploy para produção
deploy_prod() {
    log "🚀 Iniciando deploy de produção..."
    check_docker
    
    # Verificar variáveis obrigatórias
    if [ -z "$DB_PASSWORD" ] || [ -z "$BETTER_AUTH_SECRET" ] || [ -z "$DOMAIN" ]; then
        error "Variáveis obrigatórias não definidas!"
        error "Configure: DB_PASSWORD, BETTER_AUTH_SECRET, DOMAIN"
        exit 1
    fi
    
    # Backup do banco (se existir)
    if docker-compose -f docker-compose.prod.yml ps postgres | grep -q "Up"; then
        log "📦 Fazendo backup do banco..."
        docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U postgres -d auth > "./backups/backup-$(date +%Y%m%d-%H%M%S).sql"
    fi
    
    # Deploy
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.prod.yml up --build -d
    
    log "✅ Deploy de produção concluído!"
    log "🌐 Aplicação: https://$DOMAIN"
}

# Logs dos serviços
logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$service"
    fi
}

# Status dos serviços
status() {
    docker-compose ps
}

# Backup do banco
backup() {
    local filename="backup-$(date +%Y%m%d-%H%M%S).sql"
    log "📦 Criando backup: $filename"
    
    docker-compose exec postgres pg_dump -U docker -d auth > "./backups/$filename"
    
    log "✅ Backup criado: ./backups/$filename"
}

# Restaurar backup
restore() {
    local backup_file=$1
    if [ -z "$backup_file" ]; then
        error "Especifique o arquivo de backup"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        error "Arquivo de backup não encontrado: $backup_file"
        exit 1
    fi
    
    log "📥 Restaurando backup: $backup_file"
    docker-compose exec -T postgres psql -U docker -d auth < "$backup_file"
    log "✅ Backup restaurado com sucesso!"
}

# Limpar containers e volumes
clean() {
    warn "⚠️  Isso irá remover todos os containers e volumes!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        log "🧹 Limpeza concluída!"
    else
        log "Operação cancelada."
    fi
}

# Menu principal
case "$1" in
    "dev")
        deploy_dev
        ;;
    "prod")
        deploy_prod
        ;;
    "logs")
        logs "$2"
        ;;
    "status")
        status
        ;;
    "backup")
        backup
        ;;
    "restore")
        restore "$2"
        ;;
    "clean")
        clean
        ;;
    *)
        echo "🐳 Script de Deploy Docker"
        echo ""
        echo "Uso: $0 {dev|prod|logs|status|backup|restore|clean}"
        echo ""
        echo "Comandos:"
        echo "  dev      - Deploy para desenvolvimento"
        echo "  prod     - Deploy para produção"
        echo "  logs     - Visualizar logs (opcional: especificar serviço)"
        echo "  status   - Status dos containers"
        echo "  backup   - Backup do banco de dados"
        echo "  restore  - Restaurar backup (especificar arquivo)"
        echo "  clean    - Limpar containers e volumes"
        echo ""
        echo "Exemplos:"
        echo "  $0 dev"
        echo "  $0 logs backend"
        echo "  $0 restore ./backups/backup-20231031-143000.sql"
        exit 1
        ;;
esac