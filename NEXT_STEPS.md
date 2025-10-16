# Next Steps - Premium Services Integration

> **Current Status**: ✅ Supabase, Sentry, PostHog fully integrated and tested  
> **Ready For**: UI implementation and production deployment

---

## 🚀 Immediate Actions (Start Now)

### 1. Build Authentication UI (2-4 hours)

#### Task 1.1: Create Login Form in React MFE
**Priority**: 🔴 HIGH  
**Estimated Time**: 1 hour

```bash
# Create the component
cd packages/react-mfe
```

**File to Create**: `packages/react-mfe/src/components/LoginForm.tsx`

```typescript
import React, { useState } from 'react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await window.sharedServices.supabaseAuthService.signIn(email, password);
      
      if (result.error) {
        setError(result.error.message);
        window.sharedServices.captureError(result.error);
      } else {
        window.sharedServices.trackEvent('login_success', { method: 'email' });
        console.log('✅ Logged in:', result.data.user?.email);
      }
    } catch (err: any) {
      setError(err.message);
      window.sharedServices.captureError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    try {
      await window.sharedServices.supabaseAuthService.signInWithProvider(provider);
      window.sharedServices.trackEvent('oauth_initiated', { provider });
    } catch (err: any) {
      setError(err.message);
      window.sharedServices.captureError(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h2>Login</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      <form onSubmit={handleEmailLogin}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        >
          {loading ? 'Loading...' : 'Login with Email'}
        </button>
      </form>

      <hr style={{ margin: '20px 0' }} />

      <button 
        onClick={() => handleOAuthLogin('google')}
        disabled={loading}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#4285F4', color: 'white', border: 'none' }}
      >
        Continue with Google
      </button>

      <button 
        onClick={() => handleOAuthLogin('github')}
        disabled={loading}
        style={{ width: '100%', padding: '10px', backgroundColor: '#333', color: 'white', border: 'none' }}
      >
        Continue with GitHub
      </button>
    </div>
  );
};
```

**Test Plan**:
1. Add `<LoginForm />` to React root component
2. Test email/password login
3. Test Google OAuth flow
4. Test GitHub OAuth flow
5. Verify events in PostHog dashboard
6. Verify errors captured in Sentry

---

#### Task 1.2: Create User Profile Display
**Priority**: 🔴 HIGH  
**Estimated Time**: 30 minutes

**File to Create**: `packages/react-mfe/src/components/UserProfile.tsx`

```typescript
import React, { useEffect, useState } from 'react';

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await window.sharedServices.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        window.sharedServices.identifyUser(currentUser.id, {
          email: currentUser.email,
          created_at: currentUser.created_at
        });
      }
    } catch (error) {
      window.sharedServices.captureError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await window.sharedServices.signOut();
      window.sharedServices.trackEvent('logout');
      window.sharedServices.resetUser();
      setUser(null);
    } catch (error) {
      window.sharedServices.captureError(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Not logged in</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Profile</h2>
      <div style={{ marginBottom: '20px' }}>
        <strong>Email:</strong> {user.email}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>User ID:</strong> {user.id}
      </div>
      <div style={{ marginBottom: '20px' }}>
        <strong>Created:</strong> {new Date(user.created_at).toLocaleDateString()}
      </div>
      <button 
        onClick={handleLogout}
        style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
      >
        Logout
      </button>
    </div>
  );
};
```

---

#### Task 1.3: Add Protected Route Guard
**Priority**: 🟡 MEDIUM  
**Estimated Time**: 30 minutes

**File to Create**: `packages/react-mfe/src/components/ProtectedRoute.tsx`

```typescript
import React, { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const canActivate = await window.sharedServices.authGuard.canActivate();
      setIsAuthenticated(canActivate);

      if (!canActivate) {
        window.sharedServices.trackEvent('auth_required', { route: window.location.pathname });
      }
    } catch (error) {
      window.sharedServices.captureError(error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return <div>Checking authentication...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};
```

**Usage Example**:
```typescript
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserProfile } from './components/UserProfile';

<ProtectedRoute>
  <UserProfile />
</ProtectedRoute>
```

---

### 2. Test in Production Dashboards (1 hour)

#### Task 2.1: Verify Sentry Integration
**Priority**: 🔴 HIGH

1. **Trigger Test Error**:
```javascript
// In browser console
window.sharedServices.initSentry({ mfe: 'react' });
window.sharedServices.captureError(new Error('🧪 Test error from React MFE'));
window.sharedServices.captureMessage('Test message from browser', 'info');
```

2. **Check Sentry Dashboard**:
   - Go to: https://sentry.io
   - Navigate to your project
   - Check Issues tab for test error
   - Verify breadcrumbs are captured
   - Check if user context is attached

3. **Expected Output**:
   - Error appears in Sentry within 30 seconds
   - Stack trace shows correct file/line numbers
   - Breadcrumbs show user actions before error

---

#### Task 2.2: Verify PostHog Integration
**Priority**: 🔴 HIGH

1. **Trigger Test Events**:
```javascript
// In browser console
window.sharedServices.initPostHog();
window.sharedServices.trackEvent('test_button_click', { button_name: 'login', page: 'home' });
window.sharedServices.identifyUser('test-user-123', { email: 'test@example.com', plan: 'free' });
window.sharedServices.analytics.navigate('home', 'profile');
```

2. **Check PostHog Dashboard**:
   - Go to: https://us.i.posthog.com
   - Navigate to Activity → Live events
   - Verify events appear in real-time
   - Check user properties are set correctly

3. **Test Feature Flags**:
```javascript
const isEnabled = await window.sharedServices.isFeatureEnabled('new-login-ui');
console.log('Feature flag status:', isEnabled);
```

---

#### Task 2.3: Test Supabase Data Persistence
**Priority**: 🔴 HIGH

1. **Create Test User**:
```javascript
const result = await window.sharedServices.supabaseAuthService.signUp(
  'testuser@example.com',
  'SecurePass123!'
);
console.log('Signup result:', result);
```

2. **Check Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard
   - Navigate to Authentication → Users
   - Verify test user appears
   - Check last sign-in timestamp
   - Review auth logs

3. **Test Session Persistence**:
```javascript
// Refresh page, then:
const user = await window.sharedServices.getCurrentUser();
console.log('User still logged in:', user?.email);
```

---

## 🔧 Short-term Goals (This Week)

### 3. Implement Error Boundaries (2 hours)

#### Task 3.1: React Error Boundary
**File**: `packages/react-mfe/src/components/ErrorBoundary.tsx`

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Send to Sentry
    window.sharedServices.captureError(error, {
      componentStack: errorInfo.componentStack
    });

    // Track in PostHog
    window.sharedServices.trackEvent('error_boundary_triggered', {
      error_message: error.message,
      component_stack: errorInfo.componentStack
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>⚠️ Something went wrong</h2>
          <p>We've been notified and are looking into it.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '10px 20px', marginTop: '20px' }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

**Usage**:
```typescript
// Wrap your app root
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

#### Task 3.2: Vue Error Handler
**File**: `packages/vue-mfe/src/main.ts`

```typescript
// Add global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', err);
  
  window.sharedServices.captureError(err as Error, {
    vue_component: instance?.$options.name,
    error_info: info
  });
  
  window.sharedServices.trackEvent('vue_error', {
    message: (err as Error).message,
    info
  });
};
```

---

### 4. Implement Key Analytics (2 hours)

#### Task 4.1: Navigation Tracking
**File**: `packages/shell-app/src/shell-app.ts`

Add to Single-SPA lifecycle events:

```typescript
window.addEventListener('single-spa:before-routing-event', (evt) => {
  const detail = (evt as CustomEvent).detail;
  
  window.sharedServices.analytics.navigate(
    detail.oldUrl || 'unknown',
    detail.newUrl
  );
});
```

---

#### Task 4.2: User Journey Tracking
Create event tracking for key actions:

```typescript
// When user completes signup
window.sharedServices.trackEvent('signup_complete', {
  method: 'email', // or 'google', 'github'
  timestamp: new Date().toISOString()
});

// When user accesses premium feature
window.sharedServices.trackEvent('feature_accessed', {
  feature_name: 'dashboard',
  user_plan: 'free'
});

// When user completes onboarding
window.sharedServices.trackEvent('onboarding_complete', {
  steps_completed: 5,
  time_taken_seconds: 120
});
```

---

#### Task 4.3: Feature Flag Setup
**In PostHog Dashboard**:

1. Create flags:
   - `new-login-ui` (boolean)
   - `enable-oauth` (boolean)
   - `max-upload-size` (number)

2. **Test in Code**:
```typescript
const showNewUI = await window.sharedServices.isFeatureEnabled('new-login-ui');

if (showNewUI) {
  // Render new UI
} else {
  // Render old UI
}
```

---

## 🎯 Medium-term Goals (Next Sprint)

### 5. Integrate Remaining Services

#### Task 5.1: Grafana Cloud Integration (3 hours)
**Priority**: 🟡 MEDIUM

**Steps**:
1. Create metrics collection utility
2. Send custom metrics to Grafana
3. Create dashboard for:
   - MFE load times
   - Bundle sizes
   - API response times
   - Error rates

**File to Create**: `packages/shared-library/src/monitoring/grafana.ts`

---

#### Task 5.2: Resend Email Integration (2 hours)
**Priority**: 🟡 MEDIUM

**Steps**:
1. Create email service wrapper
2. Implement welcome email on signup
3. Implement password reset emails
4. Add email verification flow

**File to Create**: `packages/shared-library/src/email/resend.ts`

**Example**:
```typescript
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'onboarding@yourdomain.com',
      to: userEmail,
      subject: 'Welcome!',
      html: `<h1>Welcome ${userName}!</h1>`
    })
  });
  
  return response.json();
}
```

---

#### Task 5.3: Cloudflare CDN Setup (1 hour)
**Priority**: 🟢 LOW

**Steps**:
1. Configure Cloudflare for domain
2. Set up page rules for caching
3. Enable automatic HTTPS
4. Configure firewall rules

---

### 6. Production Deployment

#### Task 6.1: Deploy to Vercel (2 hours)
**Priority**: 🔴 HIGH (Before launch)

**Steps**:
1. Deploy shared-library:
```bash
cd packages/shared-library
vercel --prod
```

2. Update production URLs in shell app
3. Deploy each MFE individually
4. Test production import map

---

#### Task 6.2: Configure Production Environment (1 hour)

In Vercel dashboard, add environment variables for each project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `RESEND_API_KEY` (only for server functions)

---

#### Task 6.3: Production Testing Checklist
**Priority**: 🔴 CRITICAL

- [ ] Sentry receives errors from production
- [ ] PostHog tracks events from production domain
- [ ] Supabase auth works in production
- [ ] OAuth redirects work correctly
- [ ] All MFEs load without CORS issues
- [ ] Performance metrics acceptable (<3s load)
- [ ] Error rate <1%

---

## 📋 Acceptance Criteria

### For Authentication UI
- ✅ User can sign up with email/password
- ✅ User can log in with email/password
- ✅ User can log in with Google OAuth
- ✅ User can log in with GitHub OAuth
- ✅ Protected routes redirect to login
- ✅ User stays logged in after refresh
- ✅ User can log out successfully

### For Error Tracking
- ✅ Errors caught in error boundaries
- ✅ Errors appear in Sentry dashboard
- ✅ Stack traces are accurate
- ✅ User context attached to errors
- ✅ Development errors logged to console only

### For Analytics
- ✅ Events tracked in PostHog
- ✅ User identified after login
- ✅ Navigation tracked automatically
- ✅ Feature flags work correctly
- ✅ Session recording respects privacy

---

## 🚫 Known Issues & Workarounds

### Issue 1: Angular MFE Build Errors
**Status**: ⏸️ DEFERRED  
**Workaround**: Focus on React + Vue MFEs for now

### Issue 2: Large Bundle Size (2.2MB)
**Status**: ⚠️ ACCEPTABLE FOR NOW  
**Future Optimization**: Consider code splitting premium services

### Issue 3: Supabase Session Not Persisting
**If Encountered**:
```typescript
// In supabase.ts, ensure autoRefreshToken is true
storage: {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
  removeItem: (key) => localStorage.removeItem(key)
}
```

---

## 🎓 Learning Resources

### Documentation
- Supabase: https://supabase.com/docs
- Sentry: https://docs.sentry.io/platforms/javascript/
- PostHog: https://posthog.com/docs
- Single-SPA: https://single-spa.js.org/docs/getting-started-overview

### Tutorials
- Supabase Auth: https://supabase.com/docs/guides/auth
- Sentry Error Monitoring: https://docs.sentry.io/product/issues/
- PostHog Feature Flags: https://posthog.com/docs/feature-flags

---

## 📞 Support & Help

### If You Get Stuck
1. Check browser console for errors
2. Review `PREMIUM_SERVICES_INTEGRATION.md`
3. Test services individually in console
4. Check service dashboards for errors
5. Review this file's troubleshooting section

### Common Commands
```bash
# Rebuild shared library
npm run build --workspace=@single-spa-demo/shared-library

# Start all MFEs
npm run dev

# Clear cache and restart
npm run clean
npm install
npm run dev
```

---

**Last Updated**: October 16, 2025  
**Next Review**: After completing authentication UI  
**Questions?** Check PREMIUM_SERVICES_INTEGRATION.md for detailed implementation
