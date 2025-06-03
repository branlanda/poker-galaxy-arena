
# Environment Setup

## Supabase Configuration

### 1. Create Project
1. Create a new Supabase project
2. Configure the database schema:
   ```bash
   supabase db push
   ```
3. Set up authentication providers
4. Configure RLS policies

### 2. Required Environment Variables

```bash
# Core Supabase
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key

# Server-side (for Edge Functions)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Optional Environment Variables

```bash
# Payments
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# AI Features
OPENAI_API_KEY=sk-...

# Email
SMTP_HOST=smtp.your-provider.com
SMTP_USER=your-email
SMTP_PASS=your-password
SMTP_PORT=587

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

## Setting Environment Variables

### For Lovable
Environment variables are managed through the Lovable interface.

### For Vercel
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### For Netlify
Set in Netlify dashboard under Site settings > Environment variables.

### For Self-Hosted
Create a `.env.production` file with your variables.

## Validation

Test your configuration:
```bash
npm run build
```

If the build succeeds, your environment is configured correctly.

## Next Steps

Choose your [deployment option](./deployment-options.md).
