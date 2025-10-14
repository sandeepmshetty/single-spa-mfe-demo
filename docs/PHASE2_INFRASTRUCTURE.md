# Phase 2: Production Infrastructure

## Overview
Complete free-tier infrastructure for authentication, error logging, and monitoring.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Vercel Edge Network                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │ Shell App  │  │ React MFE  │  │  Vue MFE   │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                  │
│         └────────────────┴────────────────┘                  │
│                          │                                   │
│                  ┌───────▼────────┐                         │
│                  │  API Routes    │                         │
│                  │  /api/*        │                         │
│                  └───────┬────────┘                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
     ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
     │  Supabase   │ │  Sentry  │ │   Vercel   │
     │  (Database) │ │ (Errors) │ │ (Analytics)│
     │  FREE       │ │  FREE    │ │   FREE     │
     └─────────────┘ └──────────┘ └────────────┘
```

## Components Implemented

### 1. Vercel Serverless Functions ✅
**Location**: `/api/*`

**Endpoints**:
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Token refresh
- `POST /api/errors/log` - Error logging
- `GET /api/health` - Health check

**Features**:
- Auto-scaling
- Zero cold starts (edge functions)
- Built-in CORS support
- Environment variable management

### 2. Supabase Integration (Optional) 🔄
**Free Tier**: 500MB database, 50K MAU

**Setup Required**:
```bash
# 1. Create account at https://supabase.com
# 2. Create project
# 3. Add environment variables to Vercel
```

**Database Schema**:
```sql
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  stack TEXT,
  source TEXT,
  severity TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);
```

### 3. Sentry Integration ✅
**Free Tier**: 5,000 errors/month

**Already Integrated**:
- Error tracking
- Performance monitoring
- User context
- Breadcrumbs

**Setup**:
```bash
npm install @sentry/browser @sentry/tracing
```

### 4. Vercel Analytics ✅
**Free Tier**: Built-in, unlimited

**Features**:
- Real User Monitoring (RUM)
- Core Web Vitals
- Page views
- Geographic data

## Deployment

### Prerequisites
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

### Deploy to Production
```bash
# Deploy all MFEs + API
npm run deploy:all

# Or deploy individually
vercel --prod
```

### Environment Variables
Add in Vercel Dashboard (Settings > Environment Variables):

```
# Optional: Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Optional: Sentry
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# API Configuration
NODE_ENV=production
```

## Local Development

### Start API Server
```bash
# Install dependencies
npm install

# Start Vercel dev server
npm run api:dev

# APIs available at http://localhost:3000/api
```

### Test API Endpoints
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Health check
curl http://localhost:3000/api/health

# Log error
curl -X POST http://localhost:3000/api/errors/log \
  -H "Content-Type: application/json" \
  -d '{"message":"Test error","source":"test","severity":"high"}'
```

## Cost Analysis

| Service | Free Tier | Monthly Cost | Upgrade Threshold |
|---------|-----------|--------------|-------------------|
| Vercel Hosting | 100GB bandwidth | $0 | >100GB traffic |
| Vercel Functions | Unlimited invocations | $0 | >100GB-hours |
| Supabase | 500MB DB, 50K MAU | $0 | >500MB or >50K users |
| Sentry | 5K errors/month | $0 | >5K errors |
| **Total** | **All services** | **$0** | **Scales with usage** |

## Monitoring

### Vercel Dashboard
- **Deployments**: https://vercel.com/dashboard
- **Analytics**: https://vercel.com/dashboard/analytics
- **Logs**: https://vercel.com/dashboard/logs

### View Logs
```bash
# Real-time logs
vercel logs --follow

# Function logs
vercel logs [deployment-url]
```

### Sentry Dashboard
- **Errors**: https://sentry.io/organizations/[org]/issues/
- **Performance**: https://sentry.io/organizations/[org]/performance/

## Security

### API Security
- ✅ CORS configured
- ✅ HTTPS only
- ✅ Environment variables for secrets
- ⏳ Rate limiting (TODO)
- ⏳ Input validation (TODO)

### Authentication
- ✅ JWT tokens
- ✅ Token refresh
- ⏳ Token expiration validation
- ⏳ Secure cookie storage

## Next Steps

### Phase 2.1: Enhanced Security
- [ ] Add rate limiting to API routes
- [ ] Implement JWT validation
- [ ] Add API key authentication
- [ ] Enable Vercel WAF

### Phase 2.2: Database Integration
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Implement Row Level Security
- [ ] Add database migrations

### Phase 2.3: Advanced Monitoring
- [ ] Set up Sentry alerts
- [ ] Configure performance budgets
- [ ] Add custom metrics
- [ ] Create monitoring dashboard

## Troubleshooting

### API not accessible
```bash
# Check vercel.json configuration
# Ensure API routes are in /api directory
# Restart vercel dev
```

### CORS errors
```bash
# Check vercel.json headers
# Verify origin in request
# Test with curl first
```

### Environment variables not loading
```bash
# Local: Add to .env.local
# Production: Add in Vercel dashboard
# Redeploy after changes
```

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Sentry Documentation](https://docs.sentry.io)
- [Infrastructure Setup Guide](./INFRASTRUCTURE_SETUP.md)
