#!/bin/bash

# Development deployment script for egde-fx website
SERVER_IP="165.232.183.241"
SERVER_USER="root"
PROJECT_PATH="/var/www/egdefx_website"

echo "🚀 Starting development deployment..."

# Function to run command on server
run_on_server() {
    ssh $SERVER_USER@$SERVER_IP "$1"
}

# 1. Install Docker and Docker Compose on server (if not already installed)
echo "🐳 Setting up Docker on server..."
run_on_server "
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh && 
        sh get-docker.sh &&
        systemctl start docker &&
        systemctl enable docker
    fi

    if ! command -v docker-compose &> /dev/null; then
        curl -L 'https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)' -o /usr/local/bin/docker-compose &&
        chmod +x /usr/local/bin/docker-compose
    fi
"

# 2. Upload project files
echo "📤 Uploading project files..."
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'venv' \
    --exclude 'dist' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.env' \
    ./ $SERVER_USER@$SERVER_IP:$PROJECT_PATH/

# 3. Set up development environment on server
echo "🔧 Setting up development environment..."
run_on_server "cd $PROJECT_PATH && 
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        cp .env.example .env
        # Generate Django secret key
        DJANGO_SECRET=\$(python3 -c 'import secrets; print(secrets.token_urlsafe(50))')
        sed -i \"s/your-very-secure-secret-key-here/\$DJANGO_SECRET/\" .env
    fi

    # Start development environment
    docker-compose -f docker-compose.dev.yml down
    docker-compose -f docker-compose.dev.yml build --no-cache
    docker-compose -f docker-compose.dev.yml up -d
"

echo "✅ Development environment deployed!"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend: http://$SERVER_IP"
echo "   Backend API: http://$SERVER_IP:8000/api"
echo "   Django Admin: http://$SERVER_IP:8000/admin"
echo ""
echo "📝 Development Commands:"
echo "   View logs: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_PATH && docker-compose -f docker-compose.dev.yml logs -f'"
echo "   Restart: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_PATH && docker-compose -f docker-compose.dev.yml restart'"
echo "   Stop: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_PATH && docker-compose -f docker-compose.dev.yml down'"
echo ""
echo "💡 Live Development:"
echo "   1. The frontend and backend support hot reloading"
echo "   2. Any changes you make to the source files will be reflected immediately"
echo "   3. The database is persisted between restarts"
