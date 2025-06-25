# Manual Deployment Guide for egde-fx Website

## Server Information
- **Server IP**: 165.232.183.241
- **User**: root
- **OS**: Ubuntu 24.04.1 LTS

## Step-by-Step Deployment

### 1. Upload Project Files to Server

Since you're already connected to the server via SSH, open a new terminal on your Mac and run:

```bash
# From your Mac terminal (not the SSH session)
cd /Users/hariomsonwane/Desktop/egde-fx/egdefx_website

# Upload project files (you'll need to enter the server password)
rsync -avz --exclude 'node_modules' --exclude '.git' --exclude 'venv' --exclude 'dist' --exclude '__pycache__' \
    ./ root@165.232.183.241:/var/www/egdefx_website/
```

### 2. Install Dependencies on Server

In your SSH session (the one that's already connected), run these commands:

```bash
# Create project directory
mkdir -p /var/www/egdefx_website
cd /var/www/egdefx_website

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

### 3. Configure Environment Variables

```bash
# Copy environment template
cp .env.example .env

# Generate secure Django secret key
apt install -y python3
DJANGO_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(50))")
sed -i "s/your-very-secure-secret-key-here/$DJANGO_SECRET/" .env

# Generate secure database password
DB_PASSWORD=$(openssl rand -base64 32)
sed -i "s/your-secure-database-password/$DB_PASSWORD/" .env

# Edit the .env file with your domain (optional for now)
nano .env
```

### 4. Build and Deploy Application

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs
```

### 5. Configure Firewall (if needed)

```bash
# Allow HTTP and HTTPS traffic
ufw allow 80
ufw allow 443
ufw allow 22  # SSH
ufw --force enable
```

### 6. Test the Deployment

Your application should now be accessible at:
- **HTTP**: http://165.232.183.241

### 7. Domain Configuration (Optional)

If you have a domain name:

1. Point your domain's A record to `165.232.183.241`
2. Edit `/var/www/egdefx_website/.env`:
   ```
   DOMAIN=yourdomain.com
   EMAIL=your-email@example.com
   ```
3. Restart the application:
   ```bash
   cd /var/www/egdefx_website
   docker-compose restart
   ```

## Useful Commands

### Check Application Status
```bash
cd /var/www/egdefx_website
docker-compose ps
```

### View Logs
```bash
cd /var/www/egdefx_website
docker-compose logs -f
```

### Restart Application
```bash
cd /var/www/egdefx_website
docker-compose restart
```

### Update Application
```bash
cd /var/www/egdefx_website
docker-compose down
docker-compose up --build -d
```

## Troubleshooting

### If containers fail to start:
```bash
docker-compose logs
```

### If you need to rebuild:
```bash
docker-compose down
docker system prune -f
docker-compose up --build -d
```

### Check disk space:
```bash
df -h
```

### Check memory usage:
```bash
free -h
