
# ✅ Production Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code coverage above 80%
- [ ] No console.log or debug statements
- [ ] TypeScript strict mode enabled
- [ ] ESLint warnings resolved
- [ ] Bundle size optimized

### Security
- [ ] Environment variables secured
- [ ] API keys in Supabase secrets
- [ ] RLS policies enabled on all tables
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] SQL injection protection verified
- [ ] XSS protection in place
- [ ] CSRF protection enabled

### Performance
- [ ] Lighthouse score > 90
- [ ] Core Web Vitals optimized
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Images optimized and compressed
- [ ] Lazy loading implemented
- [ ] Code splitting configured
- [ ] CDN configured for static assets

### Database
- [ ] Database migrations tested
- [ ] Backup strategy implemented
- [ ] Indexes optimized
- [ ] Query performance verified
- [ ] Connection pooling configured
- [ ] RLS policies tested

## Deployment

### Infrastructure
- [ ] SSL certificate configured
- [ ] Domain name configured
- [ ] CDN setup for assets
- [ ] Load balancer configured (if needed)
- [ ] Health checks implemented
- [ ] Auto-scaling configured

### Monitoring
- [ ] Error tracking (Sentry) configured
- [ ] Performance monitoring setup
- [ ] Uptime monitoring enabled
- [ ] Database monitoring active
- [ ] Log aggregation configured
- [ ] Alert rules defined

### Supabase Configuration
- [ ] Production database created
- [ ] Authentication providers configured
- [ ] Storage buckets created
- [ ] Edge functions deployed
- [ ] Secrets configured
- [ ] API rate limits set

## Post-Deployment

### Verification
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Game functionality tested
- [ ] Payment processing verified
- [ ] Real-time features working
- [ ] Mobile responsiveness confirmed
- [ ] Cross-browser compatibility checked

### Monitoring Setup
- [ ] Error alerts configured
- [ ] Performance baselines established
- [ ] User analytics tracking
- [ ] Business metrics tracking
- [ ] Backup verification
- [ ] Disaster recovery plan documented

### Documentation
- [ ] Deployment guide updated
- [ ] API documentation current
- [ ] User documentation complete
- [ ] Admin documentation available
- [ ] Troubleshooting guide created
- [ ] Runbook for operations team

## Production Environment Configuration

### Environment Variables
```bash
# Required for production
NODE_ENV=production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional for enhanced features
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_SENTRY_DSN=https://...
VITE_ANALYTICS_ID=G-...
```

### Supabase Secrets
```bash
# Set via Supabase Dashboard → Settings → Secrets
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
SMTP_HOST=smtp.provider.com
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=your-password
JWT_SECRET=your-jwt-secret
```

### Database Performance
```sql
-- Create indexes for performance
CREATE INDEX idx_lobby_tables_status ON lobby_tables(status);
CREATE INDEX idx_hands_table_id ON hands(table_id);
CREATE INDEX idx_players_last_login ON players(last_login_at);

-- Enable query optimization
SET shared_preload_libraries = 'pg_stat_statements';
```

## Security Hardening

### Supabase RLS Policies
```sql
-- Secure player data
CREATE POLICY "Users can only see their own data" ON players
  FOR ALL USING (id = auth.uid());

-- Secure game data
CREATE POLICY "Players can only see games they're in" ON hands
  FOR SELECT USING (
    players_json::jsonb ? auth.uid()::text
  );

-- Secure financial data
CREATE POLICY "Users can only see their own transactions" ON ledger_entries
  FOR SELECT USING (
    credit_account IN (
      SELECT id FROM accounts WHERE player_id = auth.uid()
    ) OR debit_account IN (
      SELECT id FROM accounts WHERE player_id = auth.uid()
    )
  );
```

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-eval' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' wss: https://api.stripe.com;
">
```

## Performance Monitoring

### Core Web Vitals Targets
```javascript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.value),
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Database Monitoring
```sql
-- Monitor slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 100
ORDER BY mean_time DESC;

-- Monitor connection usage
SELECT 
  count(*) as connections,
  state,
  application_name
FROM pg_stat_activity
GROUP BY state, application_name;
```

## Backup and Recovery

### Automated Backups
```bash
#!/bin/bash
# Daily backup script

DATE=$(date +%Y%m%d)
BACKUP_FILE="backup-$DATE.sql"

# Database backup
supabase db dump > "$BACKUP_FILE"

# Upload to cloud storage
aws s3 cp "$BACKUP_FILE" "s3://your-backup-bucket/daily/"

# Keep only last 30 days
aws s3 ls "s3://your-backup-bucket/daily/" | \
  awk '{print $4}' | \
  sort | \
  head -n -30 | \
  xargs -I {} aws s3 rm "s3://your-backup-bucket/daily/{}"
```

### Recovery Procedures
```bash
# Database recovery
# 1. Download backup
aws s3 cp "s3://your-backup-bucket/daily/backup-YYYYMMDD.sql" ./

# 2. Restore database
supabase db reset --linked
psql -f backup-YYYYMMDD.sql

# 3. Verify data integrity
psql -c "SELECT COUNT(*) FROM lobby_tables;"
psql -c "SELECT COUNT(*) FROM players;"
```

## Monitoring Alerts

### Critical Alerts
- Database connection failures
- High error rates (>1%)
- Response time >2s
- Memory usage >90%
- Disk usage >85%
- SSL certificate expiration

### Warning Alerts
- Error rate >0.5%
- Response time >1s
- Memory usage >75%
- Unusual traffic patterns
- Failed login attempts spike

## Launch Day Checklist

### T-1 Week
- [ ] Final performance testing
- [ ] Security audit completed
- [ ] Backup procedures tested
- [ ] Monitoring systems verified
- [ ] Documentation finalized

### T-1 Day
- [ ] Final code deployment
- [ ] Database migration
- [ ] DNS changes propagated
- [ ] SSL certificates verified
- [ ] Monitoring alerts tested

### Launch Day
- [ ] Deployment verification
- [ ] User acceptance testing
- [ ] Performance monitoring active
- [ ] Support team ready
- [ ] Communication plan executed

### T+1 Day
- [ ] Performance metrics reviewed
- [ ] Error logs analyzed
- [ ] User feedback collected
- [ ] Scaling adjustments made
- [ ] Post-launch retrospective scheduled

## Success Metrics

### Technical KPIs
- Uptime: >99.9%
- Response time: <1s average
- Error rate: <0.1%
- Core Web Vitals: All green

### Business KPIs
- User registration rate
- Game completion rate
- Average session duration
- Revenue per user
- Customer satisfaction score

This checklist ensures a robust, secure, and performant production deployment of your poker platform.
