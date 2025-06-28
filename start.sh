#!/bin/bash

# E-commerce Microservices Platform Startup Script
# This script helps you start the entire platform with one command

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for service to be ready
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    print_status "Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$service_name is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "$service_name failed to start within expected time"
    return 1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_tools+=("docker-compose")
    fi
    
    if ! command_exists node; then
        missing_tools+=("node")
    fi
    
    if ! command_exists npm; then
        missing_tools+=("npm")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_error "Please install the missing tools and try again."
        exit 1
    fi
    
    # Check Docker daemon
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker and try again."
        exit 1
    fi
    
    print_success "All prerequisites are satisfied!"
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p data/images/products
    mkdir -p data/images/categories
    mkdir -p logs
    mkdir -p services/api-gateway/logs
    
    print_success "Directories created!"
}

# Function to download sample images
download_sample_images() {
    print_status "Setting up sample product images..."
    
    # Create placeholder images if they don't exist
    local image_dir="data/images/products"
    
    if [ ! -f "$image_dir/iphone-15-pro-1.jpg" ]; then
        # Create placeholder images using ImageMagick or simple colored rectangles
        # For now, we'll create simple placeholder files
        echo "Creating placeholder product images..."
        
        # iPhone images
        touch "$image_dir/iphone-15-pro-1.jpg"
        touch "$image_dir/iphone-15-pro-2.jpg"
        touch "$image_dir/iphone-15-pro-3.jpg"
        
        # MacBook images
        touch "$image_dir/macbook-pro-14-1.jpg"
        touch "$image_dir/macbook-pro-14-2.jpg"
        touch "$image_dir/macbook-pro-14-3.jpg"
        
        # Galaxy images
        touch "$image_dir/galaxy-s24-ultra-1.jpg"
        touch "$image_dir/galaxy-s24-ultra-2.jpg"
        touch "$image_dir/galaxy-s24-ultra-3.jpg"
        
        # Nike images
        touch "$image_dir/nike-air-max-270-1.jpg"
        touch "$image_dir/nike-air-max-270-2.jpg"
        touch "$image_dir/nike-air-max-270-3.jpg"
        
        # Book images
        touch "$image_dir/great-gatsby-1.jpg"
        touch "$image_dir/great-gatsby-2.jpg"
        
        print_success "Placeholder images created!"
    else
        print_success "Product images already exist!"
    fi
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build all services
    docker-compose build --parallel
    
    print_success "Docker images built successfully!"
}

# Function to start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services..."
    
    # Start databases and message brokers first
    docker-compose up -d mongodb redis postgresql zookeeper kafka vault
    
    # Wait for services to be ready
    wait_for_service "MongoDB" "http://localhost:27017" || true
    wait_for_service "Redis" "http://localhost:6379" || true
    wait_for_service "PostgreSQL" "http://localhost:5432" || true
    wait_for_service "Kafka" "http://localhost:9092" || true
    wait_for_service "Vault" "http://localhost:8200/v1/sys/health"
    
    print_success "Infrastructure services started!"
}

# Function to start microservices
start_microservices() {
    print_status "Starting microservices..."
    
    # Start all microservices
    docker-compose up -d api-gateway user-service product-service cart-service \
                       order-service payment-service inventory-service \
                       review-service notification-service admin-service
    
    # Wait for API Gateway to be ready
    wait_for_service "API Gateway" "http://localhost:8080/health"
    
    print_success "Microservices started!"
}

# Function to start frontend applications
start_frontend() {
    print_status "Starting frontend applications..."
    
    # Start frontend services
    docker-compose up -d web-frontend admin-frontend
    
    # Wait for frontend to be ready
    wait_for_service "Web Frontend" "http://localhost:3000" || true
    wait_for_service "Admin Frontend" "http://localhost:3001" || true
    
    print_success "Frontend applications started!"
}

# Function to show service status
show_status() {
    print_status "Service Status:"
    echo ""
    
    # Infrastructure
    echo "🗄️  Infrastructure Services:"
    echo "   MongoDB:      http://localhost:27017"
    echo "   Redis:        http://localhost:6379"
    echo "   PostgreSQL:   http://localhost:5432"
    echo "   Kafka:        http://localhost:9092"
    echo "   Vault:        http://localhost:8200"
    echo ""
    
    # Microservices
    echo "🔧 Microservices:"
    echo "   API Gateway:       http://localhost:8080"
    echo "   User Service:      http://localhost:8001"
    echo "   Product Service:   http://localhost:8002"
    echo "   Cart Service:      http://localhost:8003"
    echo "   Order Service:     http://localhost:8004"
    echo "   Payment Service:   http://localhost:8005"
    echo "   Inventory Service: http://localhost:8006"
    echo "   Review Service:    http://localhost:8007"
    echo "   Notification Svc:  http://localhost:8008"
    echo "   Admin Service:     http://localhost:8009"
    echo ""
    
    # Frontend
    echo "🌐 Frontend Applications:"
    echo "   Web App:       http://localhost:3000"
    echo "   Admin Panel:   http://localhost:3001"
    echo ""
    
    # API Documentation
    echo "📚 API Documentation:"
    echo "   Swagger UI:    http://localhost:8080/api-docs"
    echo ""
    
    # Sample Credentials
    echo "🔐 Sample Credentials:"
    echo "   Admin:  admin@ecommerce.com / admin123"
    echo "   User:   user@example.com / user123"
    echo ""
}

# Function to run health checks
health_check() {
    print_status "Running health checks..."
    
    local failed_services=()
    
    # Check each service
    services=(
        "API Gateway:http://localhost:8080/health"
        "User Service:http://localhost:8001/health"
        "Product Service:http://localhost:8002/products/health"
        "Web Frontend:http://localhost:3000/health"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name url <<< "$service"
        if curl -f -s "$url" > /dev/null 2>&1; then
            print_success "$name is healthy"
        else
            print_error "$name is not responding"
            failed_services+=("$name")
        fi
    done
    
    if [ ${#failed_services[@]} -eq 0 ]; then
        print_success "All services are healthy!"
    else
        print_warning "Some services are not healthy: ${failed_services[*]}"
    fi
}

# Main execution
main() {
    echo "🚀 E-commerce Microservices Platform Startup"
    echo "=============================================="
    echo ""
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            check_prerequisites
            create_directories
            download_sample_images
            build_images
            start_infrastructure
            sleep 10  # Give infrastructure time to fully start
            start_microservices
            sleep 5   # Give microservices time to start
            start_frontend
            echo ""
            print_success "🎉 E-commerce platform started successfully!"
            echo ""
            show_status
            ;;
        "stop")
            print_status "Stopping all services..."
            docker-compose down
            print_success "All services stopped!"
            ;;
        "restart")
            print_status "Restarting all services..."
            docker-compose down
            sleep 2
            $0 start
            ;;
        "status")
            show_status
            ;;
        "health")
            health_check
            ;;
        "logs")
            service_name=${2:-""}
            if [ -n "$service_name" ]; then
                docker-compose logs -f "$service_name"
            else
                docker-compose logs -f
            fi
            ;;
        "build")
            build_images
            ;;
        *)
            echo "Usage: $0 {start|stop|restart|status|health|logs [service]|build}"
            echo ""
            echo "Commands:"
            echo "  start    - Start all services"
            echo "  stop     - Stop all services"
            echo "  restart  - Restart all services"
            echo "  status   - Show service URLs and status"
            echo "  health   - Run health checks"
            echo "  logs     - Show logs (optionally for specific service)"
            echo "  build    - Build Docker images"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
