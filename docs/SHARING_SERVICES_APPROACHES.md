# 🏗️ Better Approaches for Sharing Services in Single-SPA

## Current Implementation (✅ Now Improved)

### What We Fixed
```typescript
// Before: Type-unsafe
(window as any).sharedServices = sharedServices;

// After: Type-safe with global interface
window.sharedServices = sharedServices as SharedServices;
```

### Added Type Safety
```typescript
// packages/shell-app/types/globals.d.ts
interface SharedServices {
  eventBus: { /* typed methods */ };
  counterActions: { /* typed methods */ };
  // ... all services with proper types
}

declare global {
  interface Window {
    sharedServices: SharedServices;  // ✅ TypeScript knows this now!
  }
}
```

### Benefits Gained
- ✅ **IntelliSense**: Auto-complete in React/Vue/Angular
- ✅ **Type Safety**: Compiler catches errors
- ✅ **Documentation**: Hover shows method signatures
- ✅ **Refactoring**: Rename works across all MFEs

---

## Alternative Approaches (For Different Scenarios)

### **Option 1: CustomProps via Single-SPA (Best for isolated testing)**

```typescript
// Shell registers with customProps
registerApplication({
  name: 'react-mfe',
  customProps: (name, location) => ({
    sharedServices: sharedServices,  // Passed directly to mount()
    domElement: document.getElementById('react-mfe-root')
  })
});

// React MFE receives via mount props
export const mount = (props: SingleSpaProps) => {
  const { sharedServices } = props;
  
  // Use services
  sharedServices.counterActions.increment('react-mfe');
  
  // Render with services
  return ReactDOM.render(
    <App services={sharedServices} />,
    props.domElement
  );
};
```

**Pros:**
- ✅ No global pollution
- ✅ Easy to mock for testing
- ✅ Explicit dependencies
- ✅ Works in any environment

**Cons:**
- ❌ Every component needs to pass services down (prop drilling)
- ❌ More boilerplate
- ❌ Harder to access in deeply nested components

---

### **Option 2: Context/Provider Pattern (Best for React)**

```typescript
// Shell: Still use window for initial load
window.sharedServices = sharedServices;

// React MFE: Create context
import React, { createContext, useContext } from 'react';

const SharedServicesContext = createContext<SharedServices>(null!);

export const SharedServicesProvider: React.FC = ({ children }) => {
  const services = window.sharedServices;
  
  return (
    <SharedServicesContext.Provider value={services}>
      {children}
    </SharedServicesContext.Provider>
  );
};

// Custom hook for easy access
export const useSharedServices = () => {
  const context = useContext(SharedServicesContext);
  if (!context) {
    throw new Error('useSharedServices must be used within SharedServicesProvider');
  }
  return context;
};

// Usage in components
const MyComponent = () => {
  const { counterActions } = useSharedServices();
  
  const handleClick = () => {
    counterActions.increment('react-mfe');
  };
  
  return <button onClick={handleClick}>+</button>;
};
```

**Pros:**
- ✅ Clean React patterns
- ✅ No prop drilling
- ✅ Easy testing with custom providers
- ✅ Type-safe hooks

---

### **Option 3: Dependency Injection (Best for Angular)**

```typescript
// Angular MFE: Create injectable service
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedServicesAdapter {
  private services = (window as Window).sharedServices;
  
  get eventBus() {
    return this.services.eventBus;
  }
  
  get counterActions() {
    return this.services.counterActions;
  }
  
  // ... other services
}

// Usage in components
@Component({ /* ... */ })
export class MyComponent {
  constructor(private sharedServices: SharedServicesAdapter) {}
  
  increment() {
    this.sharedServices.counterActions.increment('angular-mfe');
  }
}
```

**Pros:**
- ✅ Idiomatic Angular
- ✅ Easy to mock in tests
- ✅ Encapsulates window access
- ✅ Can add Angular-specific logic

---

### **Option 4: Module Federation Shared Modules (Future-proof)**

```javascript
// webpack.config.js (Shell & MFEs)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      shared: {
        '@single-spa-demo/shared-library': {
          singleton: true,  // ✅ Only one instance across all MFEs
          strictVersion: false,
          eager: true  // Load immediately
        }
      }
    })
  ]
};

// All MFEs import directly
import { counterActions } from '@single-spa-demo/shared-library';

counterActions.increment('react-mfe');
```

**Pros:**
- ✅ True module sharing (not just globals)
- ✅ Version management
- ✅ Tree-shaking
- ✅ No window pollution

**Cons:**
- ❌ Webpack 5+ required
- ❌ More complex setup
- ❌ Framework-specific loaders needed

---

### **Option 5: Import Map + ES Modules (Modern alternative)**

```html
<!-- Shell index.html -->
<script type="importmap">
{
  "imports": {
    "@single-spa-demo/shared-library": "/shared-library.js"
  }
}
</script>

<!-- All MFEs can import -->
<script type="module">
  import { counterActions } from '@single-spa-demo/shared-library';
  counterActions.increment('shell');
</script>
```

**Pros:**
- ✅ Native browser support
- ✅ No bundler needed
- ✅ Standards-based
- ✅ Works with any framework

**Cons:**
- ❌ Older browser support limited
- ❌ No version negotiation
- ❌ Build complexity for MFEs

---

## Comparison Table

| Approach | Type Safety | Testing | Complexity | Best For |
|----------|-------------|---------|------------|----------|
| **Window (Current)** | ✅ With types | ⚠️ Need mocks | 🟢 Low | Quick start, demos |
| **CustomProps** | ✅ Via props | ✅ Easy | 🟡 Medium | Isolated apps |
| **Context/Provider** | ✅ Full | ✅ Easy | 🟡 Medium | React apps |
| **DI Service** | ✅ Full | ✅ Easy | 🟡 Medium | Angular apps |
| **Module Federation** | ✅ Full | ✅ Easy | 🔴 High | Production |
| **Import Maps** | ✅ Full | ⚠️ Complex | 🔴 High | Future-proof |

---

## Recommended Hybrid Approach (Production)

### 1. **Shell: Initialize on Window (For Runtime Flexibility)**
```typescript
// Type-safe window initialization
window.sharedServices = await initializeSharedServices();
```

### 2. **React MFE: Context Provider**
```typescript
<SharedServicesProvider>
  <App />
</SharedServicesProvider>
```

### 3. **Vue MFE: Composition API Composable**
```typescript
// composables/useSharedServices.ts
import { inject, InjectionKey } from 'vue';

const key: InjectionKey<SharedServices> = Symbol('sharedServices');

export const useSharedServices = () => {
  const services = inject(key);
  if (!services) return window.sharedServices;
  return services;
};
```

### 4. **Angular MFE: Injectable Service Adapter**
```typescript
@Injectable({ providedIn: 'root' })
export class SharedServicesAdapter {
  private get services() {
    return window.sharedServices;
  }
  // ... getters for each service
}
```

---

## Key Takeaways

### ✅ **What We Have Now (Good for your use case):**
- Type-safe window global
- Easy access from all MFEs
- No framework lock-in
- Simple mental model

### 🚀 **Next Steps for Production:**
1. Add framework-specific adapters (Context/DI/Provide-Inject)
2. Implement service versioning
3. Add health checks for service availability
4. Consider Module Federation for build-time optimization

### 📝 **Interview Talking Points:**
- "We use typed window globals for runtime flexibility"
- "Each framework can wrap services idiomatically"
- "Type safety via TypeScript declaration merging"
- "Plan to migrate to Module Federation for prod"

---

## Testing Strategy

```typescript
// Mock sharedServices for tests
beforeEach(() => {
  window.sharedServices = {
    counterActions: {
      increment: jest.fn(),
      decrement: jest.fn(),
      getValue: () => 0,
      // ... mock all methods
    },
    // ... other services
  };
});
```

Your current approach is **good for a demo/MVP**. The type safety we just added makes it **production-ready** for small-to-medium scale. For enterprise scale, consider Module Federation + framework adapters.
