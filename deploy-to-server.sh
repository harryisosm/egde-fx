#!/bin/bash

# Deploy egde-fx website to Digital Ocean server
# Usage: ./deploy-to-server.sh

SERVER_IP="165.232.183.241"
SERVER_USER="root"
PROJECT_NAME="egdefx_website"
REMOTE_PATH="/var/www/$PROJECT_NAME"

echo "🚀 Starting deployment to Digital Ocean server..."

# Check if we can connect to the server
echo "📡 Testing connection to server..."
if ! ssh -o ConnectTimeout=10 $SERVER_USER@$SERVER_IP "echo 'Connection successful'"; then
    echo "❌ Cannot connect to server. Please check:"
    echo "   1. Server IP is correct: $SERVER_IP"
    echo "   2. SSH key is set up or password is available"
    echo "   3. Server is running and accessible"
    exit 1
fi

echo "✅ Server connection successful!"

# Create project directory on server
echo "📁 Creating project directory on server..."
ssh $SERVER_USER@$SERVER_IP "mkdir -p $REMOTE_PATH"

# Copy project files to server
echo "📤 Uploading project files..."
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'venv' --exclude 'dist' --exclude '__pycache__' \
    ./ $SERVER_USER@$SERVER_IP:$REMOTE_PATH/

# Install dependencies and setup on server
echo "🔧 Setting up application on server..."
ssh $SERVER_USER@$SERVER_IP << 'EOF'
cd /var/www/egdefx_website

# Update system packages
apt update && apt upgrade -y

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null; then
    echo "🐳 Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate a secure Django secret key
    DJANGO_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
    sed -i "s/your-very-secure-secret-key-here/$DJANGO_SECRET/" .env
    
    # Set default database password
    DB_PASSWORD=$(openssl rand -base64 32)
    sed -i "s/your-secure-database-password/$DB_PASSWORD/" .env
    
    echo "⚠️  Please edit .env file with your domain and email:"
    echo "   - DOMAIN=your-domain.com"
    echo "   - EMAIL=your-email@example.com"
fi

# Stop any existing containers
docker-compose down

# Build and start the application
echo "🏗️  Building and starting application..."
docker-compose up --build -d

# Show status
echo "📊 Application status:"
docker-compose ps

echo "✅ Deployment completed!"
echo "🌐 Your application should be accessible at:"
echo "   - HTTP: http://$(curl -s ifconfig.me)"
echo "   - If you have a domain configured, it will be available at your domain"
echo ""
echo "📝 Next steps:"
echo "   1. Configure your domain DNS to point to this server IP"
echo "   2. Edit /var/www/egdefx_website/.env with your domain and email"
echo "   3. Run: cd /var/www/egdefx_website && docker-compose restart"
echo "   4. SSL certificates will be automatically generated for your domain"

EOF

echo "🎉 Deployment script completed!"
echo "📋 To check logs: ssh $SERVER_USER@$SERVER_IP 'cd $REMOTE_PATH && docker-compose logs'"
echo "🔄 To restart: ssh $SERVER_USER@$SERVER_IP 'cd $REMOTE_PATH && docker-compose restart'"
