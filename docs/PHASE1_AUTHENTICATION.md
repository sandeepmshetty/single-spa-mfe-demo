# Authentication & Authorization Implementation

## Overview
Centralized authentication system with JWT token management, role-based access control, and state synchronization across all MFEs.

## Components

### 1. Auth Manager (Shared Library)
**Location**: `packages/shared-library/src/auth/AuthManager.ts`

**Features**:
- JWT token management
- User state management
- Role-based access control (RBAC)
- Persistent storage (localStorage)
- Subscriber pattern for auth state changes
- Cross-MFE state synchronization

**API**:
```typescript
import { authManager } from '@single-spa-demo/shared-library';

// Login
await authManager.login(email, password);

// Logout
authManager.logout();

// Get state
const state = authManager.getState();
const isAuth = authManager.isAuthenticated();
const user = authManager.getUser();
const token = authManager.getToken();

// Check roles
const hasAdminRole = authManager.hasRole('admin');

// Subscribe to changes
const unsubscribe = authManager.subscribe((state) => {
  console.log('Auth state changed:', state);
});
```

### 2. React Auth Provider
**Location**: `packages/react-mfe/src/components/AuthProvider.tsx`

**Features**:
- React Context for auth state
- Automatic state synchronization
- useAuth hook for components

**Usage**:
```tsx
import { AuthProvider, useAuth } from './components/AuthProvider';

// Wrap app
<AuthProvider>
  <App />
</AuthProvider>

// Use in components
function MyComponent() {
  const { isAuthenticated, user } = useAuth();
  
  return isAuthenticated ? (
    <div>Welcome {user?.name}</div>
  ) : (
    <div>Please login</div>
  );
}
```

## Integration Steps

### 1. Shared Library
Already integrated - authManager is globally available via `window.sharedServices.authManager`

### 2. React MFE
```tsx
// In root component
import { AuthProvider } from './components/AuthProvider';

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

### 3. Vue MFE
```typescript
// Create composable
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
  
  return authState;
}
```

### 4. Angular MFE
```typescript
// Create auth service
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { authManager, type AuthState } from '@single-spa-demo/shared-library';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState$ = new BehaviorSubject<AuthState>(authManager.getState());
  
  constructor() {
    authManager.subscribe((state) => {
      this.authState$.next(state);
    });
  }
  
  getAuthState() {
    return this.authState$.asObservable();
  }
}
```

## Protected Routes

### React
```tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}
```

### Vue
```typescript
// Router guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authManager.isAuthenticated()) {
    next('/login');
  } else {
    next();
  }
});
```

### Angular
```typescript
// Auth guard
export const authGuard: CanActivateFn = () => {
  return authManager.isAuthenticated() || inject(Router).createUrlTree(['/login']);
};
```

## Role-Based Access Control

```typescript
// Check roles
if (authManager.hasRole('admin')) {
  // Show admin features
}

// In components
const { user } = useAuth();
const isAdmin = user?.roles.includes('admin');
```

## Next Steps
- [ ] Replace mock authentication with real API
- [ ] Add OAuth2/OIDC integration
- [ ] Implement token refresh mechanism
- [ ] Add auth interceptors for API calls
- [ ] Create login/logout UI components
- [ ] Add session timeout handling
- [ ] Implement remember me functionality
