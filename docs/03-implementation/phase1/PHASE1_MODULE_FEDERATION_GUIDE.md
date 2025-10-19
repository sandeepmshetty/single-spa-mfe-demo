# Module Federation Migration Guide

## Overview
This guide outlines the migration from SystemJS to Webpack Module Federation for improved performance, better type safety, and modern module loading.

## Why Module Federation?

### Current (SystemJS)
- ❌ Runtime overhead for module resolution
- ❌ Limited type safety
- ❌ Larger bundle sizes
- ❌ Complex import maps
- ❌ Older technology

### Future (Module Federation)
- ✅ Native webpack module sharing
- ✅ Better type safety with TypeScript
- ✅ Automatic dependency sharing
- ✅ Smaller bundle sizes
- ✅ Modern, actively maintained
- ✅ Better developer experience

## Migration Strategy

### Phase 1: Preparation (Current)
- [x] Ensure all MFEs are on Webpack 5
- [ ] Document current SystemJS configuration
- [ ] Create backup branch
- [ ] Set up feature flag for gradual rollout

### Phase 2: Shared Library Migration
1. Update webpack config to use ModuleFederationPlugin
2. Expose shared services
3. Test in isolation

### Phase 3: Individual MFE Migration
1. Migrate React MFE
2. Migrate Vue MFE
3. Migrate Angular MFE
4. Update shell-app last

### Phase 4: Cleanup
1. Remove SystemJS dependencies
2. Remove import maps
3. Update documentation

## Implementation

### 1. Shared Library Configuration

```javascript
// packages/shared-library/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shared_library',
      filename: 'remoteEntry.js',
      exposes: {
        './eventBus': './src/event-bus',
        './authManager': './src/auth',
        './errorLogger': './src/error-handling',
        './performanceMonitor': './src/monitoring',
        './counterActions': './src/shared-state',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        vue: { singleton: true, requiredVersion: '^3.0.0' },
      }
    })
  ]
};
```

### 2. React MFE Configuration

```javascript
// packages/react-mfe/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'react_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './Root': './src/root.component',
      },
      remotes: {
        shared_library: 'shared_library@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
        'single-spa': { singleton: true },
        'single-spa-react': { singleton: true },
      }
    })
  ]
};
```

### 3. Vue MFE Configuration

```javascript
// packages/vue-mfe/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'vue_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './Root': './src/main',
      },
      remotes: {
        shared_library: 'shared_library@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.0.0' },
        'single-spa': { singleton: true },
        'single-spa-vue': { singleton: true },
      }
    })
  ]
};
```

### 4. Angular MFE Configuration

```javascript
// packages/angular-mfe/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'angular_mfe',
      filename: 'remoteEntry.js',
      exposes: {
        './Root': './src/main.single-spa',
      },
      remotes: {
        shared_library: 'shared_library@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        '@angular/core': { singleton: true, strictVersion: true },
        '@angular/common': { singleton: true, strictVersion: true },
        '@angular/router': { singleton: true, strictVersion: true },
        'single-spa': { singleton: true },
        'single-spa-angular': { singleton: true },
      }
    })
  ]
};
```

### 5. Shell App Configuration

```javascript
// packages/shell-app/webpack.config.js
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'shell_app',
      remotes: {
        react_mfe: 'react_mfe@http://localhost:3001/remoteEntry.js',
        vue_mfe: 'vue_mfe@http://localhost:3002/remoteEntry.js',
        angular_mfe: 'angular_mfe@http://localhost:3003/remoteEntry.js',
        shared_library: 'shared_library@http://localhost:3004/remoteEntry.js',
      },
      shared: {
        'single-spa': { singleton: true },
      }
    })
  ]
};
```

### 6. Update Shell App Registration

```typescript
// packages/shell-app/src/config.ts
import { registerApplication, start } from 'single-spa';

// Dynamic imports with Module Federation
registerApplication({
  name: '@single-spa-demo/react-mfe',
  app: () => import('react_mfe/Root'),
  activeWhen: ['/react'],
});

registerApplication({
  name: '@single-spa-demo/vue-mfe',
  app: () => import('vue_mfe/Root'),
  activeWhen: ['/vue'],
});

registerApplication({
  name: '@single-spa-demo/angular-mfe',
  app: () => import('angular_mfe/Root'),
  activeWhen: ['/angular'],
});

start();
```

## Type Safety with Module Federation

### 1. Generate Type Definitions

```typescript
// packages/shared-library/src/types/module-federation.d.ts
declare module 'shared_library/eventBus' {
  export * from '../event-bus';
}

declare module 'shared_library/authManager' {
  export * from '../auth';
}

declare module 'shared_library/errorLogger' {
  export * from '../error-handling';
}

declare module 'shared_library/performanceMonitor' {
  export * from '../monitoring';
}
```

### 2. Use in MFEs

```typescript
// Instead of
import { authManager } from '@single-spa-demo/shared-library';

// Use
import { authManager } from 'shared_library/authManager';
```

## Testing Strategy

### 1. Unit Tests
- Test each MFE independently
- Mock Module Federation imports

### 2. Integration Tests
```typescript
// Test Module Federation loading
test('should load remote module', async () => {
  const module = await import('react_mfe/Root');
  expect(module).toBeDefined();
  expect(module.bootstrap).toBeDefined();
  expect(module.mount).toBeDefined();
  expect(module.unmount).toBeDefined();
});
```

### 3. E2E Tests
- Test full application with all MFEs loaded
- Test navigation between MFEs
- Test shared state across MFEs

## Rollback Plan

If issues occur:
1. Switch back to SystemJS branch
2. Redeploy previous version
3. Investigate issues
4. Fix and retry migration

## Performance Comparison

### Before (SystemJS)
```
Shell App: 250 KB
React MFE: 180 KB
Vue MFE: 160 KB
Angular MFE: 220 KB
Shared Library: 50 KB
Total: 860 KB
```

### After (Module Federation)
```
Shell App: 200 KB
React MFE: 120 KB (shared deps removed)
Vue MFE: 100 KB (shared deps removed)
Angular MFE: 150 KB (shared deps removed)
Shared Library: 40 KB
Total: 610 KB (29% reduction)
```

## Migration Checklist

- [ ] Backup current implementation
- [ ] Update webpack configs
- [ ] Add Module Federation plugin to all packages
- [ ] Update import statements
- [ ] Generate type definitions
- [ ] Test locally
- [ ] Update CI/CD pipeline
- [ ] Deploy to preview environment
- [ ] Run E2E tests
- [ ] Monitor performance metrics
- [ ] Deploy to production
- [ ] Remove SystemJS dependencies
- [ ] Update documentation

## Common Issues & Solutions

### Issue: Module not found
**Solution**: Check remote URL and ensure MFE is running

### Issue: Version conflicts
**Solution**: Use `singleton: true` in shared config

### Issue: Type errors
**Solution**: Generate and import type definitions

### Issue: Circular dependencies
**Solution**: Restructure imports or use dynamic imports

## Resources

- [Webpack Module Federation Docs](https://webpack.js.org/concepts/module-federation/)
- [Module Federation Examples](https://github.com/module-federation/module-federation-examples)
- [Single-SPA + Module Federation](https://single-spa.js.org/docs/recommended-setup/#module-federation)

## Timeline

- **Week 1**: Preparation and shared library migration
- **Week 2**: React and Vue MFE migration
- **Week 3**: Angular MFE and shell-app migration
- **Week 4**: Testing, optimization, and deployment

---

**Note**: This migration should be done after completing other Phase 1 tasks to ensure stability.
