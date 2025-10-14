# Phase 1 Quick Start Guide

## Overview
This guide helps you integrate Phase 1 components (Error Boundaries, Authentication, Performance Monitoring) into your MFEs.

## Prerequisites
```bash
# Rebuild shared library with new features
cd packages/shared-library
npm run build

# Install dependencies in all packages
cd ../..
npm run install:all
```

## 1. Error Boundaries Integration

### React MFE
```tsx
// packages/react-mfe/src/root.component.tsx
import { ErrorBoundary } from './components/ErrorBoundary';

export default function Root() {
  return (
    <ErrorBoundary mfeName="react-mfe">
      <App />
    </ErrorBoundary>
  );
}
```

### Vue MFE
```vue
<!-- packages/vue-mfe/src/App.vue -->
<script setup lang="ts">
import { useErrorHandler } from './composables/useErrorHandler';
import ErrorFallback from './components/ErrorFallback.vue';

const { error, hasError } = useErrorHandler('vue-mfe');
</script>

<template>
  <ErrorFallback v-if="hasError" :error="error" />
  <router-view v-else />
</template>
```

### Angular MFE
```typescript
// packages/angular-mfe/src/app/app.config.ts
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ... other providers
  ]
};
```

## 2. Authentication Integration

### React MFE
```tsx
// packages/react-mfe/src/index.ts
import { AuthProvider } from './components/AuthProvider';

export const mount = (props: any) => {
  const root = ReactDOM.createRoot(container);
  root.render(
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
};

// In components
import { useAuth } from './components/AuthProvider';
import { authManager } from '@single-spa-demo/shared-library';

function LoginButton() {
  const { isAuthenticated, user } = useAuth();
  
  const handleLogin = async () => {
    await authManager.login('user@example.com', 'password');
  };
  
  const handleLogout = () => {
    authManager.logout();
  };
  
  return isAuthenticated ? (
    <button onClick={handleLogout}>Logout {user?.name}</button>
  ) : (
    <button onClick={handleLogin}>Login</button>
  );
}
```

### Vue MFE
```typescript
// packages/vue-mfe/src/composables/useAuth.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { authManager } from '@single-spa-demo/shared-library';

export function useAuth() {
  const authState = ref(authManager.getState());
  let unsubscribe: (() => void) | null = null;
  
  onMounted(() => {
    unsubscribe = authManager.subscribe((state) => {
      authState.value = state;
    });
  });
  
  onUnmounted(() => {
    unsubscribe?.();
  });
  
  return {
    ...authState.value,
    login: authManager.login.bind(authManager),
    logout: authManager.logout.bind(authManager)
  };
}
```

```vue
<!-- In components -->
<script setup>
import { useAuth } from '@/composables/useAuth';

const { isAuthenticated, user, login, logout } = useAuth();

const handleLogin = async () => {
  await login('user@example.com', 'password');
};
</script>

<template>
  <button v-if="isAuthenticated" @click="logout">
    Logout {{ user?.name }}
  </button>
  <button v-else @click="handleLogin">Login</button>
</template>
```

### Angular MFE
```typescript
// packages/angular-mfe/src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { authManager, type AuthState } from '@single-spa-demo/shared-library';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>(authManager.getState());
  
  constructor() {
    authManager.subscribe((state) => {
      this.authState$.next(state);
    });
  }
  
  getAuthState(): Observable<AuthState> {
    return this.authState$.asObservable();
  }
  
  async login(email: string, password: string): Promise<void> {
    await authManager.login(email, password);
  }
  
  logout(): void {
    authManager.logout();
  }
}
```

```typescript
// In components
import { AuthService } from './services/auth.service';

export class LoginComponent {
  authState$ = this.authService.getAuthState();
  
  constructor(private authService: AuthService) {}
  
  async login() {
    await this.authService.login('user@example.com', 'password');
  }
  
  logout() {
    this.authService.logout();
  }
}
```

## 3. Performance Monitoring Integration

### All MFEs
```typescript
// In bootstrap lifecycle method
import { performanceMonitor } from '@single-spa-demo/shared-library';

export const bootstrap = async () => {
  performanceMonitor.init('react-mfe'); // or 'vue-mfe', 'angular-mfe'
};

export const unmount = async () => {
  performanceMonitor.cleanup();
};
```

### Track Custom Metrics
```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

// Track API call duration
const startTime = performance.now();
await fetchData();
const duration = performance.now() - startTime;
performanceMonitor.trackCustomMetric('api-fetch-duration', duration, 'react-mfe');

// Track component render time
const renderStart = performance.now();
// ... render logic
const renderDuration = performance.now() - renderStart;
performanceMonitor.trackCustomMetric('component-render', renderDuration, 'react-mfe');
```

## 4. Testing

### Test Error Boundaries
```typescript
// Create a component that throws error
function BuggyComponent() {
  throw new Error('Test error boundary');
}

// Use it to test error boundary
<ErrorBoundary>
  <BuggyComponent />
</ErrorBoundary>
```

### Test Authentication
```typescript
import { authManager } from '@single-spa-demo/shared-library';

// Test login
await authManager.login('test@example.com', 'password');
console.log('Authenticated:', authManager.isAuthenticated());
console.log('User:', authManager.getUser());

// Test logout
authManager.logout();
console.log('Authenticated:', authManager.isAuthenticated());
```

### Test Performance Monitoring
```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

// Initialize
performanceMonitor.init('test-mfe');

// Track custom metric
performanceMonitor.trackCustomMetric('test-metric', 123.45, 'test-mfe');

// Get all metrics
const metrics = performanceMonitor.getMetrics();
console.log('Metrics:', metrics);
```

## 5. Build and Run

```bash
# Build shared library
cd packages/shared-library
npm run build

# Start all MFEs
cd ../..
npm run dev
```

## 6. Verify Integration

Open browser console and check:
1. **Error Logging**: Trigger an error and see it logged
2. **Authentication**: Login/logout and see state changes
3. **Performance**: See Core Web Vitals metrics logged

## Next Steps
- Integrate with real authentication API
- Connect to monitoring service (Sentry/DataDog)
- Add protected routes
- Create performance dashboard
- Add error notification UI

## Troubleshooting

### Shared library not found
```bash
cd packages/shared-library
npm run build
npm link
cd ../react-mfe
npm link @single-spa-demo/shared-library
```

### TypeScript errors
```bash
# Rebuild shared library
cd packages/shared-library
npm run build
```

### Performance metrics not showing
- Check browser console for errors
- Ensure browser supports Performance Observer API
- Verify performanceMonitor.init() is called in bootstrap
