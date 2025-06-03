
# Lovable Hosting Deployment

The easiest way to deploy your poker application.

## Quick Deployment

### 1. Connect to GitHub
```bash
# In Lovable editor
GitHub → Connect to GitHub → Create Repository
```

### 2. Deploy
1. Click the **Publish** button in Lovable
2. Your app will be available at: `yourapp.lovable.app`
3. Deployment typically takes 2-3 minutes

### 3. Custom Domain (Optional)
1. Go to Project → Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate is automatically provisioned

## Environment Variables

Set environment variables in Lovable:
1. Go to Project → Settings → Environment
2. Add your Supabase credentials
3. Add any additional variables needed

## Automatic Updates

- Changes in Lovable automatically deploy
- GitHub pushes automatically sync and deploy
- No manual deployment steps required

## Monitoring

Lovable provides basic monitoring:
- Deployment status
- Build logs
- Error tracking
- Performance metrics

## Limitations

- Limited to Lovable's infrastructure
- Cannot modify server configuration
- No access to server logs beyond builds

## Custom Domain Setup

### DNS Configuration
Point your domain to Lovable:
```
Type: CNAME
Name: www (or @)
Value: yourapp.lovable.app
```

### SSL Certificate
- Automatic provisioning
- Auto-renewal
- Supports wildcard domains

## Troubleshooting

### Build Failures
1. Check build logs in Lovable
2. Verify environment variables
3. Test build locally: `npm run build`

### Domain Issues
1. Verify DNS propagation: `dig yourdomain.com`
2. Check CNAME configuration
3. Wait up to 24 hours for propagation

### Performance Issues
1. Check bundle size: `npm run build -- --analyze`
2. Optimize images and assets
3. Use lazy loading for components

## Support

- Lovable Discord community
- Built-in support chat
- Documentation at docs.lovable.dev

## Next Steps

1. [Set up monitoring](./monitoring.md)
2. [Configure backups](./backup-strategy.md)
3. [Review security checklist](./security-checklist.md)
