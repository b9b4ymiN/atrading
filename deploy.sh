#!/bin/bash

# Quick deployment script for Crypto Trading Platform
# Usage: ./deploy.sh [start|stop|restart|logs|update|status]

set -e

PROJECT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
}

start_services() {
    print_info "Starting services..."
    docker-compose up -d
    print_info "Services started successfully!"
    print_info "Application is running at: http://localhost:3000"
    print_info "Health check: http://localhost:3000/health"
}

stop_services() {
    print_info "Stopping services..."
    docker-compose down
    print_info "Services stopped successfully!"
}

restart_services() {
    print_info "Restarting services..."
    docker-compose restart
    print_info "Services restarted successfully!"
}

view_logs() {
    print_info "Viewing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

update_application() {
    print_info "Updating application..."

    # Pull latest code
    if [ -d .git ]; then
        print_info "Pulling latest code from git..."
        git pull origin main || print_warning "Failed to pull from git. Continuing..."
    fi

    # Rebuild containers
    print_info "Rebuilding containers..."
    docker-compose down
    docker-compose build --no-cache
    docker-compose up -d

    print_info "Application updated successfully!"
    print_info "Viewing logs for 10 seconds..."
    timeout 10 docker-compose logs -f || true
}

show_status() {
    print_info "Container Status:"
    docker-compose ps

    echo ""
    print_info "Resource Usage:"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

    echo ""
    print_info "Health Check:"
    if curl -sf http://localhost:3000/health > /dev/null; then
        print_info "Application is healthy ✓"
    else
        print_error "Application is not responding ✗"
    fi
}

backup_data() {
    print_info "Creating backup..."
    BACKUP_DIR="$PROJECT_DIR/backups"
    mkdir -p "$BACKUP_DIR"

    DATE=$(date +%Y%m%d_%H%M%S)
    BACKUP_FILE="$BACKUP_DIR/backup_$DATE.tar.gz"

    tar -czf "$BACKUP_FILE" \
        --exclude='node_modules' \
        --exclude='.next' \
        --exclude='.git' \
        --exclude='backups' \
        .

    print_info "Backup created: $BACKUP_FILE"

    # Keep only last 5 backups
    ls -t "$BACKUP_DIR"/backup_*.tar.gz | tail -n +6 | xargs -r rm
}

show_help() {
    echo "Crypto Trading Platform - Deployment Script"
    echo ""
    echo "Usage: ./deploy.sh [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start      Start all services"
    echo "  stop       Stop all services"
    echo "  restart    Restart all services"
    echo "  logs       View logs (follow mode)"
    echo "  update     Update application (git pull + rebuild)"
    echo "  status     Show status of services"
    echo "  backup     Create backup of application"
    echo "  help       Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./deploy.sh start"
    echo "  ./deploy.sh logs"
    echo "  ./deploy.sh update"
}

# Main script
main() {
    check_docker

    case "${1:-}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        logs)
            view_logs
            ;;
        update)
            update_application
            ;;
        status)
            show_status
            ;;
        backup)
            backup_data
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: ${1:-}"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
