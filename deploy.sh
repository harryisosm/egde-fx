#!/bin/bash

# Digital Ocean Deployment Script for EgdeFX Website
# Make sure to run this script with sudo privileges

set -e

echo "🚀 Starting deployment to Digital Ocean..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy .env.example to .env and configure it."
    exit 1
fi

# Load environment variables
source .env

# Check required environment variables
if [ -z "$DOMAIN" ] || [ -z "$DJANGO_SECRET_KEY" ] || [ -z "$DB_PASSWORD" ]; then
    echo "❌ Required environment variables are missing. Please check your .env file."
    exit 1
fi

echo "📦 Installing Docker and Docker Compose..."
# Install Docker if not already installed
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker $USER
fi

# Install Docker Compose if not already installed
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
fi

echo "🔧 Setting up firewall..."
# Configure UFW firewall
ufw allow ssh
ufw allow 80
ufw allow 443
ufw --force enable

echo "🏗️ Building and starting services..."
# Build and start services
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 30

echo "🗄️ Running database migrations..."
# Run Django migrations
docker-compose exec backend python manage.py migrate

echo "👤 Creating Django superuser (if needed)..."
# Create superuser (optional)
docker-compose exec backend python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@$DOMAIN', 'changeme123')
    print('Superuser created: admin/changeme123')
else:
    print('Superuser already exists')
"

echo "🔒 Setting up SSL certificates..."
# Get SSL certificates
docker-compose run --rm certbot

echo "🔄 Reloading nginx with SSL..."
# Update nginx configuration for SSL
cat > nginx-ssl.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle React Router
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static files
    location /static/ {
        alias /usr/share/nginx/static/;
    }

    # Media files
    location /media/ {
        alias /usr/share/nginx/media/;
    }
}
EOF

# Replace nginx configuration
docker cp nginx-ssl.conf $(docker-compose ps -q nginx):/etc/nginx/conf.d/default.conf
docker-compose restart nginx

echo "🎉 Deployment completed successfully!"
echo "🌐 Your website should be available at: https://$DOMAIN"
echo "🔧 Admin panel: https://$DOMAIN/admin (admin/changeme123)"
echo ""
echo "📝 Next steps:"
echo "1. Change the default admin password"
echo "2. Configure your domain's DNS to point to this server's IP"
echo "3. Test all functionality"
echo ""
echo "🔄 To update the application, run: docker-compose pull && docker-compose up -d --build"
