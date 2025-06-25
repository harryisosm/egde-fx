# EgdeFX Website

A full-stack trading platform built with React frontend and Django backend, ready for production deployment on Digital Ocean.

## 🏗️ Architecture

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- Supabase for authentication

**Backend:**
- Django 5.0 with Django REST Framework
- PostgreSQL database
- WhiteNoise for static file serving
- Gunicorn WSGI server

**Infrastructure:**
- Docker & Docker Compose
- Nginx reverse proxy
- Let's Encrypt SSL certificates
- Digital Ocean deployment ready

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- PostgreSQL (optional, SQLite used by default in development)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd django_project/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

## 🌐 Production Deployment on Digital Ocean

### Prerequisites
- Digital Ocean Droplet (Ubuntu 20.04+ recommended)
- Domain name pointed to your droplet's IP
- SSH access to your droplet

### Deployment Steps

1. **Clone the repository on your droplet:**
```bash
git clone <your-repo-url>
cd egdefx_website
```

2. **Configure environment variables:**
```bash
# Copy environment template
cp .env.example .env

# Edit with your actual values
nano .env
```

Required environment variables:
- `DOMAIN`: Your domain name (e.g., example.com)
- `EMAIL`: Your email for SSL certificates
- `DJANGO_SECRET_KEY`: Generate a secure secret key
- `DB_PASSWORD`: Secure database password

3. **Run the deployment script:**
```bash
sudo ./deploy.sh
```

The script will:
- Install Docker and Docker Compose
- Configure firewall settings
- Build and start all services
- Set up SSL certificates
- Create database and run migrations
- Create a default admin user

4. **Configure DNS:**
Point your domain's A record to your droplet's IP address.

### Manual Deployment (Alternative)

If you prefer manual deployment:

```bash
# Build and start services
docker-compose up -d --build

# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Get SSL certificates
docker-compose run --rm certbot
```

## 🔧 Configuration

### Environment Variables

**Root `.env` file:**
```env
DOMAIN=your-domain.com
EMAIL=your-email@example.com
DJANGO_SECRET_KEY=your-secret-key
DB_NAME=egdefx_db
DB_USER=egdefx_user
DB_PASSWORD=your-password
VITE_API_URL=https://your-domain.com/api
```

**Backend `.env` file (django_project/backend/.env):**
```env
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com
DATABASE_URL=postgres://user:password@db:5432/dbname
DJANGO_CORS_ALLOWED_ORIGINS=https://your-domain.com
```

## 📁 Project Structure

```
egdefx_website/
├── src/                          # React frontend source
├── django_project/backend/       # Django backend
├── public/                       # Static assets
├── docker-compose.yml           # Docker orchestration
├── Dockerfile                   # Frontend Docker image
├── nginx.conf                   # Nginx configuration
├── deploy.sh                    # Deployment script
└── .env.example                 # Environment template
```

## 🛠️ Development Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
python manage.py runserver       # Start development server
python manage.py migrate         # Run database migrations
python manage.py collectstatic   # Collect static files
python manage.py test            # Run tests
```

### Docker
```bash
docker-compose up -d             # Start all services
docker-compose down              # Stop all services
docker-compose logs              # View logs
docker-compose exec backend bash # Access backend container
```

## 🔒 Security Features

- HTTPS/SSL encryption with Let's Encrypt
- Security headers (HSTS, XSS protection, etc.)
- CORS configuration
- Django security middleware
- PostgreSQL for production database
- Environment-based configuration

## 📊 Monitoring & Maintenance

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

### Update Application
```bash
git pull origin main
docker-compose up -d --build
```

### Backup Database
```bash
docker-compose exec db pg_dump -U egdefx_user egdefx_db > backup.sql
```

### Restore Database
```bash
docker-compose exec -T db psql -U egdefx_user egdefx_db < backup.sql
```

## 🆘 Troubleshooting

### Common Issues

1. **SSL Certificate Issues:**
```bash
# Renew certificates
docker-compose run --rm certbot renew
docker-compose restart nginx
```

2. **Database Connection Issues:**
```bash
# Check database status
docker-compose exec db pg_isready -U egdefx_user
```

3. **Static Files Not Loading:**
```bash
# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

## 📞 Support

For deployment issues or questions, check the logs and ensure all environment variables are properly configured.

## 🔄 Updates

To update the application:
1. Pull latest changes: `git pull origin main`
2. Rebuild containers: `docker-compose up -d --build`
3. Run migrations if needed: `docker-compose exec backend python manage.py migrate`
