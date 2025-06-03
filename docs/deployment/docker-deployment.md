
# Self-Hosted Docker Deployment

Deploy your poker application using Docker for full control.

## Prerequisites

- Docker & Docker Compose
- Linux server (Ubuntu/CentOS recommended)
- Domain name
- SSL certificate
- Basic DevOps knowledge

## Docker Configuration

### Dockerfile
```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  
  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
  
  # Security headers
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header X-XSS-Protection "1; mode=block" always;
  add_header X-Content-Type-Options "nosniff" always;
  
  server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    # Enable SPA routing
    location / {
      try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }
    
    # Security - hide nginx version
    server_tokens off;
    
    # Health check endpoint
    location /health {
      access_log off;
      return 200 "healthy\n";
      add_header Content-Type text/plain;
    }
  }
}
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  poker-app:
    build: .
    container_name: poker-app
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      - NODE_ENV=production
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./logs:/var/log/nginx
    networks:
      - poker-network
    depends_on:
      - redis
      
  redis:
    image: redis:7-alpine
    container_name: poker-redis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - poker-network
    command: redis-server --appendonly yes
    
  nginx-proxy:
    image: nginx:alpine
    container_name: nginx-proxy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    networks:
      - poker-network
    depends_on:
      - poker-app

volumes:
  redis-data:

networks:
  poker-network:
    driver: bridge
```

## SSL Configuration

### Using Let's Encrypt
```bash
# Install certbot
sudo apt update
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ./ssl/
```

### Nginx SSL Configuration
```nginx
server {
  listen 443 ssl http2;
  server_name yourdomain.com;
  
  ssl_certificate /etc/nginx/ssl/fullchain.pem;
  ssl_certificate_key /etc/nginx/ssl/privkey.pem;
  
  # SSL Security
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
  ssl_prefer_server_ciphers off;
  
  # HSTS
  add_header Strict-Transport-Security "max-age=63072000" always;
  
  location / {
    proxy_pass http://poker-app:80;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}

# Redirect HTTP to HTTPS
server {
  listen 80;
  server_name yourdomain.com;
  return 301 https://$server_name$request_uri;
}
```

## Deployment Script

### deploy.sh
```bash
#!/bin/bash

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Build and deploy
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Health check
echo "Waiting for application to start..."
sleep 30

if curl -f http://localhost/health; then
  echo "Deployment successful!"
else
  echo "Deployment failed - rolling back..."
  docker-compose down
  git checkout HEAD~1
  docker-compose build
  docker-compose up -d
  exit 1
fi

# Cleanup old images
docker image prune -f

echo "Deployment complete!"
```

## Monitoring

### Docker Health Checks
```bash
# Check container status
docker ps
docker stats

# View logs
docker-compose logs -f poker-app
docker-compose logs -f nginx-proxy
```

### System Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Monitor resources
htop
iotop
nethogs
```

### Log Management
```yaml
# docker-compose.yml logging
services:
  poker-app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Backup Strategy

### Database Backup
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application data
docker run --rm \
  --volumes-from poker-app \
  -v $BACKUP_DIR:/backup \
  alpine tar czf /backup/app-$DATE.tar.gz /usr/share/nginx/html

# Backup Redis data
docker exec poker-redis redis-cli BGSAVE
docker cp poker-redis:/data/dump.rdb $BACKUP_DIR/redis-$DATE.rdb

# Cleanup old backups (keep 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Automated Backups
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

## Security Hardening

### Firewall Configuration
```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### Docker Security
```yaml
# docker-compose.yml security
services:
  poker-app:
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp:noexec,nosuid,size=100m
    user: "1000:1000"
```

### File Permissions
```bash
# Secure file permissions
chmod 600 ssl/*.pem
chmod 644 nginx.conf
chmod 755 deploy.sh backup.sh
```

## Performance Optimization

### Resource Limits
```yaml
# docker-compose.yml
services:
  poker-app:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 1G
        reservations:
          cpus: '1.0'
          memory: 512M
```

### Caching Strategy
```nginx
# nginx caching
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
  gzip_static on;
}
```

## Scaling

### Load Balancing
```yaml
# docker-compose.yml
services:
  poker-app:
    deploy:
      replicas: 3
    
  nginx-lb:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    ports:
      - "80:80"
      - "443:443"
```

### Database Scaling
Consider external managed database services:
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Databases

## Troubleshooting

### Common Issues
```bash
# Container won't start
docker-compose logs poker-app

# Port conflicts
sudo netstat -tulpn | grep :80

# SSL certificate issues
openssl x509 -in ssl/fullchain.pem -text -noout

# Disk space
df -h
docker system df
```

### Recovery Procedures
```bash
# Restore from backup
docker-compose down
tar -xzf /backups/app-20240101_020000.tar.gz -C ./
docker-compose up -d
```

## Maintenance

### Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade

# Update Docker images
docker-compose pull
docker-compose up -d

# Update application
git pull origin main
./deploy.sh
```

### SSL Certificate Renewal
```bash
# Renew Let's Encrypt certificates
sudo certbot renew --dry-run
sudo certbot renew

# Update Docker containers
docker-compose restart nginx-proxy
```

## Next Steps

1. [Set up monitoring](./monitoring.md)
2. [Configure automated backups](./backup-strategy.md)
3. [Review security checklist](./security-checklist.md)
4. [Set up CI/CD pipeline](../devops/ci-cd.md)
