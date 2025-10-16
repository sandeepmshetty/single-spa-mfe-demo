# 🎯 Quick Reference - Premium Services

> **One-page cheat sheet for daily development**

---

## 🚀 Start Development

```bash
npm run dev                    # Start all MFEs (Shell + React + Vue)
# → Shell:  http://localhost:9000
# → React:  http://localhost:3001
# → Vue:    http://localhost:3002
```

---

## 🧪 Test in Browser Console

### Check Services Loaded
```javascript
// All should return objects/functions (not undefined)
window.sharedServices
window.sharedServices.supabase
window.sharedServices.supabaseAuthService
window.sharedServices.initSentry
window.sharedServices.initPostHog
```

### Supabase (Database + Auth)
```javascript
// Check configuration
window.sharedServices.isSupabaseConfigured()  // → true

// Get current user
await window.sharedServices.getCurrentUser()  // → user object or null

// Get session
await window.sharedServices.getCurrentSession()  // → session object

// Sign up new user
await window.sharedServices.supabaseAuthService.signUp('user@example.com', 'SecurePass123!')

// Sign in
await window.sharedServices.supabaseAuthService.signIn('user@example.com', 'SecurePass123!')

// OAuth
await window.sharedServices.supabaseAuthService.signInWithProvider('google')  // or 'github'

// Sign out
await window.sharedServices.signOut()
```

### Sentry (Error Tracking)
```javascript
// Initialize (do once on app load)
window.sharedServices.initSentry({ mfe: 'react' })

// Capture error
window.sharedServices.captureError(new Error('Something went wrong'))

// Capture message
window.sharedServices.captureMessage('Important info', 'info')  // 'info', 'warning', 'error'

// Add breadcrumb
window.sharedServices.addBreadcrumb({
  message: 'User clicked button',
  category: 'user-action',
  level: 'info'
})

// Set user context
window.sharedServices.setUserContext({
  id: 'user-123',
  email: 'user@example.com',
  username: 'john'
})
```

### PostHog (Analytics)
```javascript
// Initialize (do once on app load)
window.sharedServices.initPostHog()

// Track event
window.sharedServices.trackEvent('button_clicked', {
  button_name: 'signup',
  page: 'home'
})

// Identify user
window.sharedServices.identifyUser('user-123', {
  email: 'user@example.com',
  name: 'John Doe',
  plan: 'free'
})

// Reset user (on logout)
window.sharedServices.resetUser()

// Feature flags
await window.sharedServices.isFeatureEnabled('new-ui')  // → true/false
await window.sharedServices.getFeatureFlag('max-upload-size')  // → value

// Analytics helpers
window.sharedServices.analytics.buttonClick('login', { source: 'header' })
window.sharedServices.analytics.navigate('home', 'profile')
window.sharedServices.analytics.formSubmit('signup', true)
window.sharedServices.analytics.error('Failed to load', 'api_error')
```

---

## 📁 Important Files

### Integration Code (Read Only - Already Built)
- `packages/shared-library/src/config/supabase.ts` - Supabase client
- `packages/shared-library/src/auth/SupabaseAuth.ts` - Auth service
- `packages/shared-library/src/monitoring/sentry.ts` - Error tracking
- `packages/shared-library/src/analytics/posthog.ts` - Analytics

### Configuration (Modify with Care)
- `.env.local` - Environment variables (DO NOT COMMIT)
- `packages/shared-library/rollup.config.js` - Build configuration
- `packages/shell-app/webpack.config.js` - Dev server config
- `packages/shell-app/src/index.html` - Import map

### Your Code (Build Here)
- `packages/react-mfe/src/` - React components
- `packages/vue-mfe/src/` - Vue components
- `packages/shell-app/src/` - Shell app code

---

## 🔧 Common Tasks

### Rebuild Shared Library
```bash
npm run build --workspace=@single-spa-demo/shared-library
# Creates: packages/shared-library/dist/shared-library.js (2.2MB)
```

### Check Bundle Size
```bash
ls -lh packages/shared-library/dist/shared-library.js
# Should show ~2.2MB
```

### Clear Cache & Restart
```bash
npm run clean
npm install
npm run dev
```

### Test Specific MFE
```bash
npm run dev --workspace=@single-spa-demo/react-mfe
# OR
cd packages/react-mfe && npm run dev
```

---

## 🐛 Troubleshooting

### "window.sharedServices is undefined"
1. Check browser console for errors
2. Verify shared-library.js is loading (Network tab)
3. Check import map in HTML: `view-source:http://localhost:9000`
4. Rebuild: `npm run build --workspace=@single-spa-demo/shared-library`

### "Supabase client is undefined"
```javascript
// Check config
window.sharedServices.isSupabaseConfigured()

// If false, check .env.local has:
NEXT_PUBLIC_SUPABASE_URL=https://iarnsmmqgscrlqmlvvtq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

### "Process is not defined"
- **Cause**: Code trying to access `process.env` at runtime
- **Solution**: Must use build-time replacement (already fixed)
- **Verify**: Rebuild shared library

### "Sentry/PostHog not sending events"
```javascript
// Development mode only logs to console (expected)
// To test production:
// 1. Deploy to Vercel
// 2. Check dashboards (Sentry/PostHog)
```

### Bundle not updating after changes
```bash
# Force rebuild and clear cache
rm -rf packages/shared-library/dist
npm run build --workspace=@single-spa-demo/shared-library
# Hard refresh browser (Ctrl+Shift+R)
```

---

## 📊 Check Dashboards

### Supabase
- **URL**: https://supabase.com/dashboard
- **Check**: Authentication → Users (should see signups)
- **Tables**: Database → Tables (user profiles)

### Sentry
- **URL**: https://sentry.io
- **Check**: Issues (should see errors after production deploy)
- **Performance**: Performance tab (response times)

### PostHog
- **URL**: https://us.i.posthog.com
- **Check**: Activity → Live events (real-time event stream)
- **Users**: People (user list with properties)
- **Flags**: Feature Flags (create/manage flags)

---

## 🎯 Quick Copy-Paste Examples

### Add Login Button (React)
```typescript
<button onClick={async () => {
  const result = await window.sharedServices.supabaseAuthService.signIn(
    'user@example.com',
    'password123'
  );
  if (result.error) {
    window.sharedServices.captureError(result.error);
  } else {
    window.sharedServices.trackEvent('login_success');
  }
}}>
  Login
</button>
```

### Protected Component (React)
```typescript
const [user, setUser] = useState(null);

useEffect(() => {
  window.sharedServices.getCurrentUser().then(setUser);
}, []);

if (!user) return <div>Please log in</div>;
return <div>Welcome, {user.email}</div>;
```

### Track Button Click (Any MFE)
```typescript
<button onClick={() => {
  window.sharedServices.analytics.buttonClick('feature-x', {
    location: 'sidebar',
    user_plan: 'free'
  });
}}>
  Try Feature X
</button>
```

### Error Boundary (React)
```typescript
componentDidCatch(error, errorInfo) {
  window.sharedServices.captureError(error, {
    componentStack: errorInfo.componentStack
  });
}
```

---

## 📖 Documentation Links

- **Complete Guide**: [PREMIUM_SERVICES_INTEGRATION.md](./PREMIUM_SERVICES_INTEGRATION.md)
- **Today's Progress**: [PROGRESS_LOG.md](./PROGRESS_LOG.md)
- **Next Steps**: [NEXT_STEPS.md](./NEXT_STEPS.md)
- **Session Summary**: [SESSION_SUMMARY.md](./SESSION_SUMMARY.md)

---

## 🚨 Security Notes

### ⚠️ NEVER Commit to Git
```bash
.env.local           # Has API keys
.env                 # Backup env file
*.key                # Private keys
```

### ✅ Safe to Commit
```bash
.env.example         # Template with placeholder values
packages/**/src/**   # Your code
rollup.config.js     # Build config (no secrets)
```

### 🔐 Environment Variables
- **Frontend (NEXT_PUBLIC_*)**: Bundled into JavaScript (public)
- **Backend (no prefix)**: Server-only (private)
- **Supabase Anon Key**: Safe to expose (RLS protects data)

---

## 💡 Pro Tips

1. **Always identify users after login**:
```javascript
const user = await window.sharedServices.getCurrentUser();
if (user) {
  window.sharedServices.identifyUser(user.id, { email: user.email });
}
```

2. **Add breadcrumbs before potential errors**:
```javascript
window.sharedServices.addBreadcrumb({ message: 'Starting API call', category: 'api' });
// ... API call that might fail
```

3. **Track conversion funnel**:
```javascript
window.sharedServices.trackEvent('signup_started');
window.sharedServices.trackEvent('signup_email_entered');
window.sharedServices.trackEvent('signup_completed');
```

4. **Use feature flags for gradual rollouts**:
```javascript
const showNewUI = await window.sharedServices.isFeatureEnabled('new-ui');
// Roll out to 10% of users first, then 50%, then 100%
```

5. **Test in production dashboards early**:
- Deploy to Vercel
- Trigger test events
- Verify they appear in Sentry/PostHog
- Catches configuration issues early

---

**Last Updated**: October 16, 2025  
**Keep This Handy**: Bookmark for daily reference  
**Questions?**: Check full docs linked above
