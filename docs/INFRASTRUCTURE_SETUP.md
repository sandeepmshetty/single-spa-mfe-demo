# Infrastructure Setup Guide

## Free Tier Services

### 1. Supabase (Database + Auth)
**Free Tier**: 500MB database, 50K monthly active users, 2GB bandwidth

**Setup**:
```bash
# 1. Create account at https://supabase.com
# 2. Create new project
# 3. Get credentials from Settings > API
# 4. Add to Vercel environment variables
```

**Environment Variables**:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

**Database Schema**:
```sql
-- Error logs table
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  stack TEXT,
  source TEXT,
  severity TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB
);

-- Create index for faster queries
CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity);
```

### 2. Sentry (Error Tracking)
**Free Tier**: 5,000 errors/month, 1 project

**Setup**:
```bash
# 1. Create account at https://sentry.io
# 2. Create new project (JavaScript)
# 3. Get DSN from Settings > Client Keys
# 4. Install packages
npm install @sentry/browser @sentry/tracing
```

**Environment Variables**:
```
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 3. Vercel (Hosting + Serverless Functions)
**Free Tier**: 100GB bandwidth, unlimited serverless function invocations

**Setup**:
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

**Environment Variables** (Add in Vercel Dashboard):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `SENTRY_DSN`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Error Logging
- `POST /api/errors/log` - Log errors

### Health Check
- `GET /api/health` - Service health status

## Local Development

```bash
# 1. Copy environment variables
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Run Vercel dev server
vercel dev

# 4. Access APIs at http://localhost:3000/api
```

## Deployment

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

## Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Cost |
|---------|-----------|--------------|
| Supabase | 500MB DB, 50K MAU | $25/mo (Pro) |
| Sentry | 5K errors/mo | $26/mo (Team) |
| Vercel | 100GB bandwidth | $20/mo (Pro) |
| **Total** | **$0/mo** | **$71/mo** |

## Monitoring

### Vercel Logs
```bash
# View real-time logs
vercel logs --follow

# View function logs
vercel logs [deployment-url]
```

### Supabase Dashboard
- Database: https://app.supabase.com/project/_/editor
- Auth: https://app.supabase.com/project/_/auth/users
- Logs: https://app.supabase.com/project/_/logs

### Sentry Dashboard
- Errors: https://sentry.io/organizations/[org]/issues/
- Performance: https://sentry.io/organizations/[org]/performance/

## Security Best Practices

1. **Never commit `.env` files**
2. **Use Vercel environment variables** for secrets
3. **Enable Row Level Security** in Supabase
4. **Use HTTPS only** in production
5. **Implement rate limiting** on API routes
6. **Validate all inputs** on serverless functions

## Scaling Strategy

When you exceed free tiers:
1. **Supabase**: Upgrade to Pro ($25/mo) for 8GB database
2. **Sentry**: Upgrade to Team ($26/mo) for 50K errors/mo
3. **Vercel**: Upgrade to Pro ($20/mo) for 1TB bandwidth
4. **Alternative**: Self-host on AWS/GCP free tier

## Troubleshooting

### API not working locally
```bash
# Make sure Vercel CLI is installed
npm install -g vercel

# Run dev server
vercel dev
```

### CORS errors
- Check `vercel.json` headers configuration
- Ensure API routes are under `/api` directory

### Environment variables not loading
- Add to `.env.local` for local development
- Add to Vercel dashboard for production
- Restart `vercel dev` after changes
