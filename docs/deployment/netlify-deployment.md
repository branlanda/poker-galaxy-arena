
# Netlify Deployment

Deploy your poker application to Netlify.

## Prerequisites

- Netlify account
- GitHub repository
- Node.js 18+

## Quick Setup

### 1. GitHub Integration
1. Connect GitHub to Netlify
2. Select your repository
3. Configure build settings

### 2. Build Settings
```yaml
# Build command
npm run build

# Publish directory
dist

# Node version
18
```

### 3. Environment Variables
In Netlify dashboard:
- Site settings → Environment variables
- Add required variables:
  ```
  VITE_SUPABASE_URL=your-url
  VITE_SUPABASE_ANON_KEY=your-key
  ```

## Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

### _redirects (Alternative)
```
/*    /index.html   200
```

## Netlify Functions

For serverless functions:

### Function Example
```javascript
// netlify/functions/health.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString()
    }),
  };
};
```

### Environment Variables for Functions
```javascript
// netlify/functions/example.js
const API_KEY = process.env.API_KEY;
```

## Custom Domain

### 1. Add Domain
In Netlify dashboard:
- Domain settings → Add custom domain
- Enter your domain name

### 2. DNS Configuration
Point your domain to Netlify:
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

### 3. SSL Certificate
- Automatic Let's Encrypt certificates
- Custom certificate support
- Automatic renewal

## Forms (Bonus Feature)

Netlify provides built-in form handling:

```html
<form name="contact" method="POST" data-netlify="true">
  <input type="hidden" name="form-name" value="contact" />
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## Performance Optimization

### Asset Optimization
```toml
# netlify.toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[build.processing.images]
  compress = true
```

### Prerendering
```toml
# netlify.toml
[[plugins]]
  package = "@netlify/plugin-gatsby"

[plugins.inputs]
  prerender = true
```

## Branch Deploys

### Production Branch
- `main` branch → Production site
- Custom domain attached

### Preview Branches
- Feature branches → Preview deploys
- Automatic deploy previews for PRs

### Configuration
```toml
# netlify.toml
[context.production]
  command = "npm run build"

[context.branch-deploy]
  command = "npm run build:staging"

[context.deploy-preview]
  command = "npm run build:preview"
```

## Environment-Specific Builds

```toml
# netlify.toml
[context.production.environment]
  VITE_API_URL = "https://api.yourdomain.com"
  VITE_ENVIRONMENT = "production"

[context.deploy-preview.environment]
  VITE_API_URL = "https://staging-api.yourdomain.com"
  VITE_ENVIRONMENT = "preview"
```

## Analytics

### Netlify Analytics
- Built-in analytics (paid feature)
- Server-side tracking
- No impact on performance

### Third-party Analytics
```javascript
// Add to index.html or component
<script>
  // Google Analytics, Mixpanel, etc.
</script>
```

## Monitoring

### Deploy Notifications
Configure notifications for:
- Successful deploys
- Failed builds
- Form submissions

### Build Plugins
```toml
# netlify.toml
[[plugins]]
  package = "netlify-plugin-lighthouse"

[[plugins]]
  package = "@netlify/plugin-sitemap"
```

## Security

### Access Control
```toml
# netlify.toml
[[headers]]
  for = "/admin/*"
  [headers.values]
    Basic-Auth = "admin:password"
```

### Content Security Policy
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = '''
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
    '''
```

## Troubleshooting

### Build Failures
1. Check build logs in Netlify dashboard
2. Test locally: `npm run build`
3. Verify Node.js version
4. Check environment variables

### Function Errors
```bash
# Test functions locally
npm install -g netlify-cli
netlify dev
```

### DNS Issues
```bash
# Check DNS propagation
dig yourdomain.com
nslookup yourdomain.com
```

## Cost Optimization

### Build Minutes
- 300 minutes/month (free)
- Optimize build time:
  - Use npm ci instead of npm install
  - Cache node_modules
  - Optimize dependencies

### Bandwidth
- 100GB/month (free)
- Optimize assets:
  - Compress images
  - Minify CSS/JS
  - Use CDN for large assets

## Next Steps

1. [Set up monitoring](./monitoring.md)
2. [Configure backups](./backup-strategy.md)
3. [Review security checklist](./security-checklist.md)
