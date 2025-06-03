
# 🚀 Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Domain name (optional)

## Environment Setup

### 1. Supabase Configuration

1. Create a new Supabase project
2. Configure the database schema:
   ```bash
   supabase db push
   ```
3. Set up authentication providers
4. Configure RLS policies

### 2. Environment Variables

Create these secrets in Supabase Edge Functions:

```bash
# Required
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email
SMTP_PASS=your-password
```

## Deployment Options

### Option 1: Lovable Hosting (Recommended)

1. **Connect to GitHub:**
   ```bash
   # In Lovable editor
   GitHub → Connect to GitHub → Create Repository
   ```

2. **Deploy:**
   ```bash
   # Click Publish button in Lovable
   # Your app will be available at: yourapp.lovable.app
   ```

3. **Custom Domain:**
   ```bash
   # In Lovable: Project → Settings → Domains
   # Add your custom domain
   ```

### Option 2: Vercel Deployment

1. **Setup:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Configure `vercel.json`:**
   ```json
   {
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ],
     "env": {
       "VITE_SUPABASE_URL": "@supabase-url",
       "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
     }
   }
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 3: Netlify Deployment

1. **Build Settings:**
   ```bash
   Build command: npm run build
   Publish directory: dist
   ```

2. **Environment Variables:**
   ```bash
   VITE_SUPABASE_URL=your-url
   VITE_SUPABASE_ANON_KEY=your-key
   ```

3. **Redirects (`_redirects`):**
   ```
   /*    /index.html   200
   ```

### Option 4: Self-Hosted (Docker)

1. **Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=0 /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **nginx.conf:**
   ```nginx
   events {
     worker_connections 1024;
   }
   
   http {
     include /etc/nginx/mime.types;
     default_type application/octet-stream;
     
     server {
       listen 80;
       root /usr/share/nginx/html;
       index index.html;
       
       location / {
         try_files $uri $uri/ /index.html;
       }
     }
   }
   ```

3. **Deploy:**
   ```bash
   docker build -t poker-app .
   docker run -p 80:80 poker-app
   ```

## Database Migration

### Initial Setup
```bash
# Run migrations
supabase db reset
supabase db push

# Seed initial data
supabase seed run
```

### Production Migration
```bash
# Backup current database
supabase db dump > backup.sql

# Run migrations
supabase db push --linked

# Verify migration
supabase db diff
```

## SSL Certificate

### Automatic (Recommended)
Most hosting providers handle SSL automatically.

### Manual (Self-hosted)
```bash
# Using Certbot
sudo certbot --nginx -d yourdomain.com
```

## Monitoring Setup

### Performance Monitoring
```typescript
// Add to main.tsx
import { initializeApp } from 'firebase/app';
import { getPerformance } from 'firebase/performance';

const app = initializeApp(firebaseConfig);
const perf = getPerformance(app);
```

### Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN",
  integrations: [
    new Sentry.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
});
```

## Security Checklist

- [ ] Enable RLS on all tables
- [ ] Configure CORS properly
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Set up CSP headers
- [ ] Configure authentication
- [ ] Enable audit logging
- [ ] Regular security updates

## Performance Optimization

### Build Optimization
```bash
# Build with optimization
npm run build

# Analyze bundle
npm run build -- --analyze
```

### CDN Setup
```bash
# Configure static asset CDN
# Upload assets to CDN
# Update asset URLs
```

### Caching Strategy
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}
```

## Backup Strategy

### Database Backup
```bash
# Daily backup
supabase db dump > backup-$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
supabase db dump > "backups/backup-$DATE.sql"
aws s3 cp "backups/backup-$DATE.sql" s3://your-backup-bucket/
```

### Asset Backup
```bash
# Backup uploaded assets
aws s3 sync s3://your-assets-bucket s3://your-backup-bucket/assets
```

## Rollback Procedure

1. **Database Rollback:**
   ```bash
   supabase db reset --linked
   psql -f backup-previous.sql
   ```

2. **Application Rollback:**
   ```bash
   # Vercel
   vercel rollback
   
   # Netlify
   netlify sites:rollback
   ```

## Health Checks

### API Health Check
```typescript
// Add to your app
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  });
});
```

### Database Health
```sql
-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;

-- Check table sizes
SELECT schemaname,tablename,attname,n_distinct,correlation 
FROM pg_stats;
```
