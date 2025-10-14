# Quick Start: Free Infrastructure Setup

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Test API Locally
```bash
# Start Vercel dev server
npm run api:dev

# In another terminal, test endpoints
curl http://localhost:3000/api/health
```

### Step 3: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Done!** Your APIs are live at `https://your-project.vercel.app/api/*`

---

## 🎯 Optional: Add Supabase (5 minutes)

### 1. Create Account
- Go to https://supabase.com
- Sign up (free)
- Create new project

### 2. Get Credentials
- Go to Settings > API
- Copy:
  - Project URL
  - Anon key
  - Service key

### 3. Add to Vercel
```bash
# In Vercel dashboard
Settings > Environment Variables > Add:

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

### 4. Create Database Table
```sql
-- In Supabase SQL Editor
CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  stack TEXT,
  source TEXT,
  severity TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_error_logs_timestamp ON error_logs(timestamp DESC);
```

### 5. Redeploy
```bash
vercel --prod
```

---

## 🔍 Optional: Add Sentry (3 minutes)

### 1. Create Account
- Go to https://sentry.io
- Sign up (free)
- Create JavaScript project

### 2. Install Packages
```bash
npm install @sentry/browser @sentry/tracing
```

### 3. Get DSN
- Copy DSN from project settings

### 4. Add to Vercel
```bash
# In Vercel dashboard
Settings > Environment Variables > Add:

SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 5. Initialize in Code
```typescript
// Already integrated in shared-library
import { sentryIntegration } from '@single-spa-demo/shared-library';

sentryIntegration.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production'
});
```

---

## ✅ Verification

### Test API Endpoints
```bash
# Health check
curl https://your-project.vercel.app/api/health

# Login
curl -X POST https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Log error
curl -X POST https://your-project.vercel.app/api/errors/log \
  -H "Content-Type: application/json" \
  -d '{"message":"Test","source":"test","severity":"high"}'
```

### Check Dashboards
- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://app.supabase.com
- **Sentry**: https://sentry.io

---

## 💰 Cost Summary

| Service | Setup Time | Monthly Cost |
|---------|------------|--------------|
| Vercel API | 5 min | $0 |
| Supabase | 5 min | $0 |
| Sentry | 3 min | $0 |
| **Total** | **13 min** | **$0** |

---

## 🆘 Troubleshooting

### API returns 404
- Ensure files are in `/api` directory
- Check `vercel.json` exists
- Redeploy: `vercel --prod`

### Environment variables not working
- Add in Vercel dashboard
- Redeploy after adding
- Check spelling

### CORS errors
- Check `vercel.json` headers
- Ensure origin is allowed
- Test with Postman first

---

## 📚 Next Steps

1. [Full Infrastructure Guide](./INFRASTRUCTURE_SETUP.md)
2. [Phase 2 Documentation](./PHASE2_INFRASTRUCTURE.md)
3. [API Documentation](./API_DOCUMENTATION.md)
