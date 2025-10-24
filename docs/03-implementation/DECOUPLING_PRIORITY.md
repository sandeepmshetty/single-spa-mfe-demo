# MFE Decoupling Priority Work

> **Current Coupling Score: 73/100** - Loosely Coupled (Above Average)  
> **Target Score: 90/100** - Production-Ready Enterprise MFE

## Executive Summary

This document outlines priority improvements to reduce coupling between micro-frontends (MFEs) and move toward enterprise-grade architecture. The repo currently demonstrates good decoupling practices but has opportunities for improvement in versioning, state management, and resilience.

### Current State
- ✅ Zero direct cross-MFE imports
- ✅ Independent deployment capabilities
- ✅ Event-driven communication
- ⚠️ No shared library versioning
- ⚠️ Implicit API contracts
- ⚠️ Shared mutable state
- ⚠️ No graceful degradation

---

## Priority 1: Quick Wins (1-2 Days) 🚀

### P1.1: Add Shared Library Versioning

**Problem:** MFEs have no way to verify compatibility with shared library version.

**Impact:** Breaking changes in shared library silently break all MFEs.

**Solution:**
```typescript
// packages/shared-library/src/version.ts
export const VERSION = '1.0.0';

export interface VersionInfo {
  version: string;
  major: number;
  minor: number;
  patch: number;
  compatible: (requiredVersion: string) => boolean;
}

export const versionInfo: VersionInfo = {
  version: VERSION,
  major: 1,
  minor: 0,
  patch: 0,
  compatible: (requiredVersion: string): boolean => {
    const [reqMajor] = requiredVersion.split('.').map(Number);
    const [currentMajor] = VERSION.split('.').map(Number);
    return currentMajor === reqMajor;
  }
};

// Add deprecation warnings
export const deprecationWarnings = {
  'authService': 'Deprecated in v1.0.0. Use supabaseAuthService instead.',
  // Add more as needed
};
```

**Changes Required:**
- [ ] Create `packages/shared-library/src/version.ts`
- [ ] Export from `packages/shared-library/src/index.ts`
- [ ] Add version check in shell-app initialization
- [ ] Add version display in MFE consoles
- [ ] Document versioning policy in README

**Acceptance Criteria:**
- Version logged on shell startup
- Each MFE logs shared library version
- Warning shown if incompatible version detected

**Estimated Effort:** 2-3 hours

---

### P1.2: Add Per-MFE Error Boundaries

**Problem:** If one MFE crashes, it can bring down the entire application.

**Impact:** Poor user experience, cascading failures.

**Solution:**
```typescript
// packages/shell-app/src/core/mfe-error-boundary.ts
export class MFEErrorBoundary {
  private readonly fallbackUI: string;
  private readonly mfeName: string;

  wrap(loadFn: () => Promise<any>) {
    return async () => {
      try {
        return await loadFn();
      } catch (error) {
        console.error(`MFE ${this.mfeName} failed to load:`, error);
        
        // Log to monitoring
        window.sharedServices?.captureError?.(error, {
          context: `mfe-load-failure-${this.mfeName}`
        });

        // Return minimal lifecycle
        return {
          bootstrap: async () => {},
          mount: async (props: any) => {
            props.domElement.innerHTML = this.fallbackUI;
          },
          unmount: async (props: any) => {
            props.domElement.innerHTML = '';
          }
        };
      }
    };
  }
}
```

**Changes Required:**
- [ ] Create `MFEErrorBoundary` class
- [ ] Wrap each MFE registration with error boundary
- [ ] Design fallback UI for each MFE
- [ ] Add retry mechanism (manual or automatic)
- [ ] Test failure scenarios

**Acceptance Criteria:**
- React MFE fails → Vue/Angular still work
- Fallback UI shown for failed MFE
- Error logged to monitoring service
- User can retry loading

**Estimated Effort:** 3-4 hours

---

### P1.3: Add API Contract Validation

**Problem:** No runtime validation that `window.sharedServices` matches expected interface.

**Impact:** Silent failures, undefined reference errors.

**Solution:**
```typescript
// packages/shared-library/src/contract-validator.ts
export interface ServiceContract {
  version: string;
  eventBus: {
    emit: Function;
    on: Function;
    off: Function;
  };
  counterActions: {
    increment: Function;
    decrement: Function;
    subscribe: Function;
    getValue: Function;
  };
  authStateManager?: object;
  // ... other services
}

export function validateContract(services: any): boolean {
  const errors: string[] = [];

  if (!services.version) {
    errors.push('Missing: version');
  }

  if (!services.eventBus?.emit) {
    errors.push('Missing: eventBus.emit');
  }

  if (!services.counterActions?.subscribe) {
    errors.push('Missing: counterActions.subscribe');
  }

  if (errors.length > 0) {
    console.error('❌ Shared services contract validation failed:', errors);
    return false;
  }

  console.log('✅ Shared services contract validated');
  return true;
}
```

**Changes Required:**
- [ ] Create `contract-validator.ts`
- [ ] Add validation in shell-app after service init
- [ ] Add validation in each MFE before use
- [ ] Document required contract in TypeScript interfaces
- [ ] Add contract tests

**Acceptance Criteria:**
- Contract validation runs on startup
- Errors logged if contract violated
- TypeScript types match runtime validation
- Unit tests for validator

**Estimated Effort:** 2-3 hours

---

## Priority 2: Medium Effort (1 Week) 🔧

### P2.1: Migrate to Webpack Module Federation

**Problem:** SystemJS is outdated, `window.sharedServices` creates coupling.

**Impact:** Poor developer experience, larger bundles, version conflicts.

**Solution:** Follow existing `docs/PHASE1_MODULE_FEDERATION_GUIDE.md`

**Key Steps:**
1. Update shared-library webpack config
2. Add ModuleFederationPlugin to each MFE
3. Update shell-app to load remotes
4. Remove SystemJS dependencies
5. Remove `window.sharedServices` (use imports instead)

**Changes Required:**
- [ ] Configure Module Federation in shared-library
- [ ] Configure Module Federation in react-mfe
- [ ] Configure Module Federation in vue-mfe
- [ ] Configure Module Federation in angular-mfe
- [ ] Update shell-app to load remotes
- [ ] Update imports in all MFEs
- [ ] Test cross-MFE communication
- [ ] Update deployment configs

**Acceptance Criteria:**
- All MFEs load via Module Federation
- Shared dependencies singleton
- No SystemJS in production bundle
- All features work as before
- Bundle size reduced by ~30%

**Estimated Effort:** 3-5 days

**Blocker:** Requires testing to ensure Single-SPA + Module Federation compatibility

---

### P2.2: Implement Versioned Service APIs

**Problem:** Single global `window.sharedServices` - no backward compatibility.

**Impact:** Can't deploy MFEs independently with different API expectations.

**Solution:**
```typescript
// packages/shared-library/src/api-versions.ts
export const sharedServicesV1 = {
  version: '1.0.0',
  eventBus: eventBus,
  counterActions: counterActions,
  // v1 API
};

export const sharedServicesV2 = {
  version: '2.0.0',
  eventBus: eventBus,
  counterActions: {
    ...counterActions,
    incrementBy: (amount: number, source?: string) => { /* new */ }
  },
  stateManager: {
    subscribe: (key: string, callback: Function) => { /* new */ }
  }
};

// packages/shell-app/src/core/service-initializer.ts
window.mfeServices = {
  current: sharedServicesV2,
  v1: sharedServicesV1,
  v2: sharedServicesV2,
  version: '2.0.0'
};
```

**Changes Required:**
- [ ] Create versioned API structure
- [ ] Implement adapter for v1 → v2 compatibility
- [ ] Update shell to provide both versions
- [ ] Update MFEs to request specific version
- [ ] Add deprecation warnings for v1
- [ ] Document migration guide

**Acceptance Criteria:**
- Old MFEs can use v1 API
- New MFEs can use v2 API
- Both work simultaneously
- Deprecation warnings logged
- Migration guide available

**Estimated Effort:** 2-3 days

---

### P2.3: Add Health Check & Circuit Breaker

**Problem:** No mechanism to detect/handle service failures gracefully.

**Impact:** Entire app can freeze or crash if one service fails.

**Solution:**
```typescript
// packages/shared-library/src/circuit-breaker.ts
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount = 0;
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
    if (this.state === 'open') {
      console.warn('Circuit breaker open, using fallback');
      return fallback();
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      return fallback();
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'open';
      setTimeout(() => {
        this.state = 'half-open';
      }, this.timeout);
    }
  }
}
```

**Changes Required:**
- [ ] Create `CircuitBreaker` class
- [ ] Wrap critical service calls
- [ ] Implement fallback strategies
- [ ] Add health check endpoint
- [ ] Display health status in UI
- [ ] Add alerting for circuit open

**Acceptance Criteria:**
- Service failures trigger circuit breaker
- Fallback UI shown during outage
- Circuit recovers automatically
- Health metrics logged
- Monitoring dashboard shows status

**Estimated Effort:** 2-3 days

---

## Priority 3: Long Term (2-3 Weeks) 🎯

### P3.1: Move Shared State to Backend

**Problem:** Shared mutable state (`counterState`) creates tight coupling.

**Impact:** Can't deploy MFEs with different state schemas, scaling issues.

**Solution:**
```typescript
// Backend API
GET  /api/state/counter
POST /api/state/counter/increment
POST /api/state/counter/decrement

// WebSocket for real-time updates
ws://api.example.com/state/counter/subscribe

// Frontend (each MFE independently)
const { data, mutate } = useSWR('/api/state/counter');

// Update counter
await fetch('/api/state/counter/increment', { method: 'POST' });
mutate(); // Revalidate
```

**Changes Required:**
- [ ] Create backend API for shared state
- [ ] Implement WebSocket for real-time updates
- [ ] Update React MFE to use API
- [ ] Update Vue MFE to use API
- [ ] Update Angular MFE to use API
- [ ] Remove `counterState` from shared-library
- [ ] Add optimistic updates
- [ ] Handle offline scenarios

**Acceptance Criteria:**
- Counter state persisted in backend
- Real-time updates across MFEs
- Works with page refresh
- Handles offline mode
- Performance < 100ms latency

**Estimated Effort:** 5-7 days

---

### P3.2: Implement Micro-Frontend Registry

**Problem:** Shell has hardcoded MFE configurations, manual URL management.

**Impact:** Can't dynamically add/remove MFEs, manual coordination needed.

**Solution:**
```typescript
// Backend registry
GET /api/mfe-registry
{
  "mfes": [
    {
      "name": "react-mfe",
      "version": "1.2.3",
      "url": "https://react-mfe.vercel.app/react-mfe.js",
      "routes": ["/users", "/profile"],
      "status": "active",
      "requiredSharedLib": "^1.0.0"
    },
    {
      "name": "vue-mfe",
      "version": "2.0.1",
      "url": "https://vue-mfe.vercel.app/vue-mfe.js",
      "routes": ["/products", "/cart"],
      "status": "active",
      "requiredSharedLib": "^1.0.0"
    }
  ]
}

// Shell dynamically loads MFEs
const registry = await fetch('/api/mfe-registry').then(r => r.json());

registry.mfes
  .filter(mfe => mfe.status === 'active')
  .forEach(mfe => registerApplication({
    name: mfe.name,
    app: () => System.import(mfe.url),
    activeWhen: mfe.routes
  }));
```

**Changes Required:**
- [ ] Create MFE registry backend API
- [ ] Add registry admin UI
- [ ] Update shell to load from registry
- [ ] Add version compatibility checking
- [ ] Implement canary deployments
- [ ] Add rollback mechanism
- [ ] Document registry API

**Acceptance Criteria:**
- MFEs registered in database
- Shell loads MFEs dynamically
- Can enable/disable MFEs without deploy
- Version conflicts detected
- Canary releases supported

**Estimated Effort:** 7-10 days

---

### P3.3: Implement Backend-for-Frontend (BFF) Pattern

**Problem:** Each MFE makes independent API calls, no coordination.

**Impact:** Over-fetching, inconsistent data, poor performance.

**Solution:**
```typescript
// BFF for React MFE
GET /bff/react-mfe/dashboard
{
  "user": { /* user data */ },
  "counter": 42,
  "notifications": [ /* notifications */ ],
  "permissions": [ /* permissions */ ]
}

// GraphQL Federation (advanced)
query ReactMFEDashboard {
  user { id, email }
  counter { value, lastUpdated }
  notifications { unreadCount }
}
```

**Changes Required:**
- [ ] Design BFF architecture
- [ ] Create BFF services per MFE
- [ ] Implement GraphQL gateway (optional)
- [ ] Update MFEs to use BFF
- [ ] Add caching strategy
- [ ] Implement rate limiting
- [ ] Add monitoring

**Acceptance Criteria:**
- Each MFE has dedicated BFF
- Single API call per page load
- Response times < 200ms
- Caching implemented
- Error handling robust

**Estimated Effort:** 10-14 days

---

## Priority 4: Infrastructure (Ongoing) ⚙️

### P4.1: Add Monitoring & Observability

**Tools:**
- ✅ Sentry (already integrated)
- ✅ PostHog (already integrated)
- ⏳ Datadog RUM
- ⏳ OpenTelemetry

**Metrics to Track:**
- MFE load times
- Service availability
- Error rates per MFE
- User journey completion
- API latency

**Estimated Effort:** 3-5 days

---

### P4.2: Add E2E Contract Testing

**Solution:**
```typescript
// tests/contracts/shared-services.contract.ts
describe('Shared Services Contract', () => {
  it('should maintain backward compatibility', async () => {
    const v1Contract = require('./contracts/v1.json');
    const currentServices = window.sharedServices;
    
    expect(currentServices).toMatchContract(v1Contract);
  });
});
```

**Estimated Effort:** 2-3 days

---

### P4.3: Implement Feature Flags

**Solution:**
```typescript
// Use PostHog feature flags (already integrated)
const featureFlags = {
  useNewCounter: isFeatureEnabled('new-counter-api'),
  enableBFFPattern: isFeatureEnabled('bff-pattern'),
  moduleFederation: isFeatureEnabled('module-federation')
};
```

**Estimated Effort:** 1-2 days

---

## Implementation Roadmap

### Week 1: Quick Wins
- [ ] P1.1: Shared library versioning
- [ ] P1.2: Per-MFE error boundaries
- [ ] P1.3: API contract validation

### Week 2-3: Medium Improvements
- [ ] P2.1: Module Federation migration
- [ ] P2.2: Versioned APIs
- [ ] P2.3: Circuit breakers

### Week 4-6: Long Term
- [ ] P3.1: Backend state management
- [ ] P3.2: MFE registry
- [ ] P3.3: BFF pattern

### Ongoing
- [ ] P4.1: Monitoring
- [ ] P4.2: Contract testing
- [ ] P4.3: Feature flags

---

## Success Metrics

### Before (Current)
- Coupling Score: 73/100
- Deployment Independence: 7/10
- Error Resilience: 4/10
- API Versioning: 0/10
- State Isolation: 5/10

### After (Target)
- Coupling Score: 90/100
- Deployment Independence: 10/10
- Error Resilience: 9/10
- API Versioning: 10/10
- State Isolation: 9/10

---

## Risk Assessment

### Low Risk
- P1.1, P1.2, P1.3: Additive changes, no breaking changes

### Medium Risk
- P2.1: Module Federation requires thorough testing
- P2.2: Need to maintain v1 compatibility

### High Risk
- P3.1: Backend changes affect all MFEs
- P3.2: Requires coordination with infrastructure team
- P3.3: Architectural shift, significant refactor

---

## Resources Required

### Development
- 1 Senior Frontend Developer (full-time)
- 1 Backend Developer (part-time for P3.x)
- 1 DevOps Engineer (part-time for registry/monitoring)

### Tools/Services
- Backend API server (Node.js/Express)
- Database for registry (PostgreSQL)
- Monitoring tools (Datadog/OpenTelemetry)
- CI/CD pipeline updates

### Estimated Total Cost
- Developer time: ~6 weeks
- Infrastructure: ~$200/month additional

---

## Next Steps

1. **Review this document** with team
2. **Prioritize** based on business needs
3. **Create Jira tickets** for each priority item
4. **Start with P1.1** (Quick Win, high impact)
5. **Weekly reviews** to track progress

---

## References

- [Current Architecture Docs](./02-architecture/README.md)
- [Module Federation Guide](./PHASE1_MODULE_FEDERATION_GUIDE.md)
- [Coupling Analysis](./DECOUPLING_ANALYSIS.md) (to be created)
- [Industry Best Practices](https://martinfowler.com/articles/micro-frontends.html)

---

**Last Updated:** October 24, 2025  
**Document Owner:** Architecture Team  
**Review Cadence:** Bi-weekly
