
# Vercel Deployment

Deploy your poker application to Vercel for production use.

## Prerequisites

- Vercel account
- GitHub repository
- Node.js 18+

## Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 2. Configure Project
Create `vercel.json`:
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

### 3. Set Environment Variables
```bash
# Add environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production

# Optional variables
vercel env add STRIPE_PUBLISHABLE_KEY production
vercel env add OPENAI_API_KEY production
```

### 4. Deploy
```bash
# Preview deployment
vercel

# Production deployment
vercel --prod
```

## GitHub Integration

### Automatic Deployments
1. Connect repository to Vercel
2. Configure branch settings:
   - Production: `main` branch
   - Preview: `develop` branch
3. Enable automatic deployments

### Environment Variables
Set in Vercel dashboard:
- Project Settings → Environment Variables
- Add production and preview environments

## Performance Optimization

### Caching Strategy
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Edge Functions
For API routes, use Vercel Edge Functions:
```javascript
// api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
```

## Custom Domain

### 1. Add Domain
```bash
vercel domains add yourdomain.com
```

### 2. Configure DNS
Point your domain to Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate
- Automatically provisioned
- Supports custom certificates
- Automatic renewal

## Monitoring

### Analytics
Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

```javascript
// main.tsx
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

### Real User Monitoring
```javascript
// main.tsx
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      <YourApp />
      <SpeedInsights />
    </>
  );
}
```

## Scaling

### Function Limits
- Execution time: 10s (hobby), 900s (pro)
- Memory: 1GB (hobby), 3GB (pro)
- Invocations: 100/day (hobby), unlimited (pro)

### Bandwidth
- 100GB/month (hobby)
- 1TB/month (pro)
- Overage charges apply

## Troubleshooting

### Build Errors
```bash
# Check build locally
npm run build

# Debug on Vercel
vercel logs [deployment-url]
```

### Function Timeouts
- Optimize database queries
- Use caching strategies
- Consider Edge Functions for faster execution

### Domain Issues
```bash
# Check domain status
vercel domains ls

# Verify DNS
dig yourdomain.com
```

## Security

### Environment Variables
- Never commit secrets to Git
- Use Vercel's encrypted environment variables
- Rotate keys regularly

### Content Security Policy
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'"
        }
      ]
    }
  ]
}
```

## Cost Optimization

### Bundle Analysis
```bash
npm run build -- --analyze
```

### Image Optimization
Use Vercel's Image Optimization:
```javascript
import Image from 'next/image';

// Note: Requires Next.js or custom implementation
```

## Next Steps

1. [Set up monitoring](./monitoring.md)
2. [Configure CI/CD](../devops/ci-cd.md)
3. [Review security checklist](./security-checklist.md)
