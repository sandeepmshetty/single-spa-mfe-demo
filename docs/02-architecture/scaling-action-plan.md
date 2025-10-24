# MFE Scaling Action Plan

## Quick Reference

**Current State:** 4 MFEs (React, Vue, Angular, Shared)  
**Target:** Production-ready for 10+ MFEs  
**Timeline:** 8 weeks  
**Priority:** P0 items first (critical for scaling)

---

## Week 1-2: Critical Fixes (P0)

### 1. Version Management

**Task:** Add version checking to prevent incompatible deployments

```typescript
// packages/shared-library/src/version.ts
export const VERSION = '1.0.0';
export const MIN_COMPATIBLE_VERSION = '1.0.0';

export function checkCompatibility(mfeVersion: string): boolean {
  const semver = require('semver');
  return semver.gte(mfeVersion, MIN_COMPATIBLE_VERSION);
}

export function assertCompatibility(mfeName: string, mfeVersion: string): void {
  if (!checkCompatibility(mfeVersion)) {
    throw new Error(
      `${mfeName} version ${mfeVersion} is incompatible with shared-library ${VERSION}`
    );
  }
}
```

**Usage in each MFE:**
```typescript
// packages/react-mfe/src/index.tsx
import { assertCompatibility, VERSION } from '@single-spa-demo/shared-library';

export async function bootstrap() {
  assertCompatibility('react-mfe', '1.0.0');
  // ... rest of bootstrap
}
```

**Files to modify:**
- `packages/shared-library/src/version.ts` (create)
- `packages/react-mfe/src/index.tsx`
- `packages/vue-mfe/src/main.ts`
- `packages/angular-mfe/src/main.ts`

**Estimated time:** 4 hours

---

### 2. Bundle Size Budgets

**Task:** Prevent bundle size explosion

```javascript
// packages/react-mfe/webpack.config.js
module.exports = {
  // ... existing config
  performance: {
    maxEntrypointSize: 250000, // 250KB
    maxAssetSize: 250000,
    hints: 'error' // Fail build if exceeded
  }
};
```

**Apply to all MFEs:**
- `packages/shell-app/webpack.config.js`
- `packages/react-mfe/webpack.config.js`
- `packages/vue-mfe/webpack.config.js`
- `packages/angular-mfe/angular.json` (different syntax)

**Estimated time:** 2 hours

---

### 3. Feature Flags Setup

**Task:** Enable safe deployments with feature flags

```typescript
// packages/shared-library/src/feature-flags.ts
import { isFeatureEnabled } from './analytics/posthog';

export const features = {
  newAuthUI: () => isFeatureEnabled('new-auth-ui'),
  v2Dashboard: () => isFeatureEnabled('v2-dashboard'),
  experimentalFeature: () => isFeatureEnabled('experimental-feature')
};

// Usage in MFEs
import { features } from '@single-spa-demo/shared-library';

if (features.newAuthUI()) {
  return <NewAuthUI />;
} else {
  return <OldAuthUI />;
}
```

**Files to create:**
- `packages/shared-library/src/feature-flags.ts`

**Estimated time:** 3 hours

---

### 4. CSP Headers

**Task:** Add Content Security Policy for security

```json
// packages/shell-app/vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://react-mfe-tau.vercel.app https://vue-mfe.vercel.app https://angular-mfe-indol.vercel.app https://shared-library.vercel.app; connect-src 'self' https://*.supabase.co https://*.sentry.io https://*.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Files to modify:**
- `packages/shell-app/vercel.json`

**Estimated time:** 2 hours

---

### 5. MFE-Specific Error Tracking

**Task:** Tag errors by MFE for better debugging

```typescript
// packages/react-mfe/src/index.tsx
import { initSentry } from '@single-spa-demo/shared-library';

export async function bootstrap() {
  initSentry({
    tags: { 
      mfe: 'react-mfe',
      version: '1.0.0'
    }
  });
  // ... rest
}
```

**Files to modify:**
- `packages/react-mfe/src/index.tsx`
- `packages/vue-mfe/src/main.ts`
- `packages/angular-mfe/src/main.ts`

**Estimated time:** 2 hours

---

**Week 1-2 Total:** 13 hours

---

## Week 3-4: Performance & Monitoring (P1)

### 6. Lazy Loading Implementation

**Task:** Load MFEs only when needed

```typescript
// packages/shell-app/src/core/application-registry.ts
import { registerApplication } from 'single-spa';

export class ApplicationRegistry {
  registerAllMFEs() {
    // Lazy load - only download when route is active
    registerApplication({
      name: 'react-mfe',
      app: () => System.import('@single-spa-demo/react-mfe'), // Lazy
      activeWhen: '/users'
    });
    
    registerApplication({
      name: 'vue-mfe',
      app: () => System.import('@single-spa-demo/vue-mfe'), // Lazy
      activeWhen: '/products'
    });
  }
}
```

**Files to modify:**
- `packages/shell-app/src/core/application-registry.ts`

**Estimated time:** 2 hours

---

### 7. Performance Tracking per MFE

**Task:** Monitor load times for each MFE

```typescript
// packages/shared-library/src/monitoring/mfe-performance.ts
export function trackMFELoad(mfeName: string) {
  const startMark = `${mfeName}-start`;
  const endMark = `${mfeName}-end`;
  const measureName = `${mfeName}-load`;
  
  performance.mark(startMark);
  
  return () => {
    performance.mark(endMark);
    performance.measure(measureName, startMark, endMark);
    
    const measure = performance.getEntriesByName(measureName)[0];
    
    // Send to PostHog
    trackEvent('mfe_load_time', {
      mfe: mfeName,
      duration: measure.duration,
      timestamp: Date.now()
    });
    
    // Warn if slow
    if (measure.duration > 3000) {
      console.warn(`⚠️ ${mfeName} took ${measure.duration}ms to load`);
    }
  };
}

// Usage in each MFE
export async function mount(props) {
  const endTracking = trackMFELoad('react-mfe');
  
  // ... mount logic
  
  endTracking();
}
```

**Files to create:**
- `packages/shared-library/src/monitoring/mfe-performance.ts`

**Files to modify:**
- `packages/react-mfe/src/index.tsx`
- `packages/vue-mfe/src/main.ts`
- `packages/angular-mfe/src/main.ts`

**Estimated time:** 4 hours

---

### 8. Health Check Endpoints

**Task:** Monitor MFE availability

```typescript
// packages/shell-app/src/services/health-check.ts
interface MFEHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  loadTime: number;
  lastCheck: string;
}

export async function checkMFEHealth(mfeName: string): Promise<MFEHealth> {
  const start = performance.now();
  
  try {
    await System.import(mfeName);
    const loadTime = performance.now() - start;
    
    return {
      name: mfeName,
      status: loadTime < 3000 ? 'healthy' : 'degraded',
      loadTime,
      lastCheck: new Date().toISOString()
    };
  } catch (error) {
    return {
      name: mfeName,
      status: 'down',
      loadTime: -1,
      lastCheck: new Date().toISOString()
    };
  }
}

export async function checkAllMFEs(): Promise<MFEHealth[]> {
  const mfes = [
    '@single-spa-demo/react-mfe',
    '@single-spa-demo/vue-mfe',
    '@single-spa-demo/angular-mfe'
  ];
  
  return Promise.all(mfes.map(checkMFEHealth));
}

// Run periodically
setInterval(async () => {
  const health = await checkAllMFEs();
  console.log('MFE Health:', health);
  
  // Send to monitoring
  trackEvent('mfe_health_check', { health });
}, 60000); // Every minute
```

**Files to modify:**
- `packages/shell-app/src/services/health-check.ts` (enhance existing)

**Estimated time:** 3 hours

---

### 9. Minimize Shared State

**Task:** Audit and reduce shared state

**Current shared state:**
```typescript
// Too much shared state
window.sharedServices = {
  counterState,      // ❌ Remove (demo only)
  counterActions,    // ❌ Remove (demo only)
  userState,         // ✅ Keep (auth)
  userActions,       // ✅ Keep (auth)
  eventBus,          // ✅ Keep (communication)
  authManager,       // ✅ Keep (auth)
  authStateManager,  // ✅ Keep (auth)
  // ... many more
};
```

**Refactored:**
```typescript
// Minimal shared state
window.sharedServices = {
  // Auth only
  auth: {
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    subscribe: () => {}
  },
  
  // Communication only
  eventBus: {
    emit: () => {},
    on: () => {},
    off: () => {}
  },
  
  // Monitoring
  monitoring: {
    captureError: () => {},
    trackEvent: () => {}
  }
};
```

**Files to modify:**
- `packages/shared-library/src/index.ts`
- `packages/shared-library/src/init.ts`
- Remove `packages/shared-library/src/shared-state.ts` (counter demo)

**Estimated time:** 4 hours

---

**Week 3-4 Total:** 13 hours

---

## Week 5-6: Advanced Features (P1)

### 10. Contract Testing

**Task:** Ensure MFE compatibility

```typescript
// tests/contracts/shared-library.test.ts
import { authManager, eventBus } from '@single-spa-demo/shared-library';

describe('Shared Library Contracts', () => {
  describe('Auth Manager', () => {
    test('login method signature', () => {
      expect(authManager.login).toBeDefined();
      expect(authManager.login.length).toBe(1); // Takes 1 argument
    });
    
    test('login returns promise with user', async () => {
      const result = await authManager.login({ 
        email: 'test@test.com', 
        password: 'test123' 
      });
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
    });
  });
  
  describe('Event Bus', () => {
    test('emit method signature', () => {
      expect(eventBus.emit).toBeDefined();
      expect(eventBus.emit.length).toBe(3); // type, data, source
    });
    
    test('on method returns unsubscribe function', () => {
      const unsubscribe = eventBus.on('test', () => {});
      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
    });
  });
});
```

**Files to create:**
- `tests/contracts/shared-library.test.ts`
- `tests/contracts/mfe-lifecycle.test.ts`

**Estimated time:** 6 hours

---

### 11. Canary Deployment Workflow

**Task:** Safe production deployments

```yaml
# .github/workflows/canary-deploy.yml
name: Canary Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-canary:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Preview
        run: |
          cd packages/react-mfe
          vercel deploy --token=${{ secrets.VERCEL_TOKEN }} > preview-url.txt
          
      - name: Run Smoke Tests
        run: |
          PREVIEW_URL=$(cat preview-url.txt)
          npm run test:smoke -- --url=$PREVIEW_URL
          
      - name: Deploy to Production (10% traffic)
        if: success()
        run: |
          cd packages/react-mfe
          vercel deploy --prod --token=${{ secrets.VERCEL_TOKEN }}
          # Configure 10% traffic split in Vercel dashboard
          
      - name: Monitor for 30 minutes
        run: |
          sleep 1800
          # Check error rates in Sentry
          
      - name: Full Rollout
        if: success()
        run: |
          # Increase to 100% traffic
          echo "Canary successful, full rollout"
```

**Files to create:**
- `.github/workflows/canary-deploy.yml`

**Estimated time:** 4 hours

---

### 12. Circuit Breaker Pattern

**Task:** Prevent cascading failures

```typescript
// packages/shared-library/src/resilience/circuit-breaker.ts
export class CircuitBreaker {
  private failures = new Map<string, number>();
  private lastFailure = new Map<string, number>();
  private readonly threshold = 3;
  private readonly timeout = 60000; // 1 minute
  
  async execute<T>(
    name: string, 
    fn: () => Promise<T>,
    fallback?: () => T
  ): Promise<T> {
    // Check if circuit is open
    if (this.isOpen(name)) {
      console.warn(`Circuit breaker open for ${name}`);
      if (fallback) return fallback();
      throw new Error(`Circuit open for ${name}`);
    }
    
    try {
      const result = await fn();
      this.onSuccess(name);
      return result;
    } catch (error) {
      this.onFailure(name);
      throw error;
    }
  }
  
  private isOpen(name: string): boolean {
    const failures = this.failures.get(name) || 0;
    const lastFailure = this.lastFailure.get(name) || 0;
    
    if (failures >= this.threshold) {
      // Check if timeout has passed
      if (Date.now() - lastFailure < this.timeout) {
        return true; // Circuit still open
      } else {
        this.reset(name); // Try again
      }
    }
    
    return false;
  }
  
  private onSuccess(name: string): void {
    this.reset(name);
  }
  
  private onFailure(name: string): void {
    const failures = (this.failures.get(name) || 0) + 1;
    this.failures.set(name, failures);
    this.lastFailure.set(name, Date.now());
    
    if (failures >= this.threshold) {
      console.error(`Circuit breaker opened for ${name}`);
      // Alert ops team
      trackEvent('circuit_breaker_opened', { service: name });
    }
  }
  
  private reset(name: string): void {
    this.failures.delete(name);
    this.lastFailure.delete(name);
  }
}

export const circuitBreaker = new CircuitBreaker();

// Usage
await circuitBreaker.execute(
  'load-products-mfe',
  () => System.import('products-mfe'),
  () => ({ mount: () => showFallbackUI() })
);
```

**Files to create:**
- `packages/shared-library/src/resilience/circuit-breaker.ts`

**Files to modify:**
- `packages/shell-app/src/core/application-registry.ts` (use circuit breaker)

**Estimated time:** 5 hours

---

**Week 5-6 Total:** 15 hours

---

## Week 7-8: Optimization (P2)

### 13. Dependency Sharing (Module Federation)

**Task:** Eliminate duplicate React/Vue bundles

This is a major refactor. See `docs/02-architecture/module-federation-migration.md` for full guide.

**Estimated time:** 16 hours

---

### 14. Parallel CI/CD Builds

**Task:** Speed up build times

```yaml
# .github/workflows/build.yml
name: Build All MFEs

on: [push]

jobs:
  build-shell:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build --workspace=shell-app
      
  build-react:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build --workspace=react-mfe
      
  build-vue:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build --workspace=vue-mfe
      
  build-angular:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build --workspace=angular-mfe
```

**Files to create:**
- `.github/workflows/build.yml`

**Estimated time:** 3 hours

---

## Summary

### Total Estimated Time: 60 hours (8 weeks @ 7.5 hours/week)

### Priority Breakdown
- **P0 (Critical):** 13 hours - Must complete before scaling
- **P1 (High):** 28 hours - Should complete for 10+ MFEs
- **P2 (Medium):** 19 hours - Nice to have for optimization

### Quick Wins (Do First)
1. Bundle size budgets (2 hours) - Immediate feedback
2. Feature flags (3 hours) - Enable safe deployments
3. MFE error tags (2 hours) - Better debugging
4. Version checks (4 hours) - Prevent incompatibilities

### Deliverables
- [ ] Version management system
- [ ] Performance budgets enforced
- [ ] Feature flag infrastructure
- [ ] Security headers (CSP)
- [ ] MFE-specific monitoring
- [ ] Health check system
- [ ] Contract tests
- [ ] Canary deployment workflow
- [ ] Circuit breaker pattern
- [ ] Parallel CI/CD builds

---

*Last Updated: January 2025*  
*Next Review: After Week 2 completion*
