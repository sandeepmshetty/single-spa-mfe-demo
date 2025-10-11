# Single-SPA Micro-Frontend Deployment Strategy on Vercel

## Deployment Architecture Overview

Similar to the [page-rendering-demo.vercel.app](https://page-rendering-demo.vercel.app/), we'll deploy each micro-frontend as a separate Vercel project with custom domains/subdomains.

## Proposed Deployment Structure

```
Production Deployment:
┌─────────────────────────────────────────────────────────────────────────────┐
│                              VERCEL CLOUD                                  │
│                                                                             │
│  ┌──────────────────────┐    ┌──────────────────────┐                      │
│  │   PRIMARY DOMAIN     │    │   SUBDOMAIN 1        │                      │
│  │                      │    │                      │                      │
│  │ mfe-demo.vercel.app  │    │ react.mfe-demo.      │                      │
│  │                      │    │ vercel.app           │                      │
│  │ ┌──────────────────┐ │    │ ┌──────────────────┐ │                      │
│  │ │ Shell App        │ │    │ │ React MFE        │ │                      │
│  │ │ - Root Config    │ │    │ │ - User Mgmt      │ │                      │
│  │ │ - Navigation     │ │    │ │ - Authentication │ │                      │
│  │ │ - Orchestration  │ │    │ │ - React 18       │ │                      │
│  │ └──────────────────┘ │    │ └──────────────────┘ │                      │
│  └──────────────────────┘    └──────────────────────┘                      │
│                                                                             │
│  ┌──────────────────────┐    ┌──────────────────────┐                      │
│  │   SUBDOMAIN 2        │    │   SUBDOMAIN 3        │                      │
│  │                      │    │                      │                      │
│  │ vue.mfe-demo.        │    │ angular.mfe-demo.    │                      │
│  │ vercel.app           │    │ vercel.app           │                      │
│  │ ┌──────────────────┐ │    │ ┌──────────────────┐ │                      │
│  │ │ Vue MFE          │ │    │ │ Angular MFE      │ │                      │
│  │ │ - Products       │ │    │ │ - Dashboard      │ │                      │
│  │ │ - Shopping Cart  │ │    │ │ - Analytics      │ │                      │
│  │ │ - Vue 3 + Vite   │ │    │ │ - Angular 17     │ │                      │
│  │ └──────────────────┘ │    │ └──────────────────┘ │                      │
│  └──────────────────────┘    └──────────────────────┘                      │
│                                                                             │
│  ┌──────────────────────┐                                                  │
│  │   SUBDOMAIN 4        │                                                  │
│  │                      │                                                  │
│  │ shared.mfe-demo.     │                                                  │
│  │ vercel.app           │                                                  │
│  │ ┌──────────────────┐ │                                                  │
│  │ │ Shared Library   │ │                                                  │
│  │ │ - Common Utils   │ │                                                  │
│  │ │ - UI Components  │ │                                                  │
│  │ │ - Event Bus      │ │                                                  │
│  │ │ - Types/Interfaces│ │                                                  │
│  │ └──────────────────┘ │                                                  │
│  └──────────────────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Domain Strategy

### Option 1: Vercel Subdomains (Recommended for Demo)
```
Main Shell:     mfe-demo.vercel.app
React MFE:      react-mfe-demo.vercel.app  
Vue MFE:        vue-mfe-demo.vercel.app
Angular MFE:    angular-mfe-demo.vercel.app
Shared Lib:     shared-mfe-demo.vercel.app
```

### Option 2: Custom Domain with Subdomains (Production Ready)
```
Main Shell:     app.yourdomain.com
React MFE:      users.yourdomain.com
Vue MFE:        products.yourdomain.com  
Angular MFE:    dashboard.yourdomain.com
Shared Lib:     cdn.yourdomain.com
```

### Option 3: Path-based with Edge Functions (Advanced)
```
Main Shell:     yourdomain.com
React MFE:      yourdomain.com/api/mfe/react/*
Vue MFE:        yourdomain.com/api/mfe/vue/*
Angular MFE:    yourdomain.com/api/mfe/angular/*
```

## Deployment Configuration Files

I'll create Vercel deployment configurations for each micro-frontend:

### 1. Shell Application (`vercel.json`)
```json
{
  "name": "mfe-shell",
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods", 
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "REACT_MFE_URL": "https://react-mfe-demo.vercel.app",
    "VUE_MFE_URL": "https://vue-mfe-demo.vercel.app",
    "ANGULAR_MFE_URL": "https://angular-mfe-demo.vercel.app",
    "SHARED_LIB_URL": "https://shared-mfe-demo.vercel.app"
  }
}
```

### 2. React MFE (`vercel.json`)
```json
{
  "name": "react-mfe",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": { "zeroConfig": true }
    }
  ],
  "routes": [
    {
      "src": "/react-mfe.js",
      "dest": "/dist/react-mfe.js",
      "headers": {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ],
  "outputDirectory": "dist"
}
```

## CI/CD Pipeline Strategy

### GitHub Actions Workflow
```yaml
name: Deploy Micro-Frontends
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy-shared:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd packages/shared-library && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.SHARED_PROJECT_ID }}
          working-directory: ./packages/shared-library

  deploy-react:
    needs: deploy-shared
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd packages/react-mfe && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.REACT_PROJECT_ID }}
          working-directory: ./packages/react-mfe

  deploy-vue:
    needs: deploy-shared
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd packages/vue-mfe && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.VUE_PROJECT_ID }}
          working-directory: ./packages/vue-mfe

  deploy-angular:
    needs: deploy-shared
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd packages/angular-mfe && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.ANGULAR_PROJECT_ID }}
          working-directory: ./packages/angular-mfe

  deploy-shell:
    needs: [deploy-react, deploy-vue, deploy-angular]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd packages/shell-app && npm ci && npm run build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.SHELL_PROJECT_ID }}
          working-directory: ./packages/shell-app
```

## Environment Configuration Strategy

### Development Import Map (shell-app/src/index.html)
```javascript
{
  "imports": {
    "@single-spa-demo/react-mfe": "http://localhost:3001/react-mfe.js",
    "@single-spa-demo/vue-mfe": "http://localhost:3002/vue-mfe.js", 
    "@single-spa-demo/angular-mfe": "http://localhost:3003/angular-mfe.js",
    "@single-spa-demo/shared-library": "http://localhost:3004/shared.js"
  }
}
```

### Production Import Map (auto-generated)
```javascript
{
  "imports": {
    "@single-spa-demo/react-mfe": "https://react-mfe-demo.vercel.app/react-mfe.js",
    "@single-spa-demo/vue-mfe": "https://vue-mfe-demo.vercel.app/vue-mfe.js",
    "@single-spa-demo/angular-mfe": "https://angular-mfe-demo.vercel.app/angular-mfe.js", 
    "@single-spa-demo/shared-library": "https://shared-mfe-demo.vercel.app/shared.js"
  }
}
```

## Advanced Deployment Features

### 1. Preview Deployments
- Each PR gets preview URLs for all micro-frontends
- Integration testing across preview environments
- Visual regression testing

### 2. Edge Functions for Routing
```javascript
// vercel/functions/route-handler.js
export default function handler(request) {
  const url = new URL(request.url);
  
  // Route to appropriate MFE based on path
  if (url.pathname.startsWith('/users')) {
    return Response.redirect('https://react-mfe-demo.vercel.app');
  }
  if (url.pathname.startsWith('/products')) {
    return Response.redirect('https://vue-mfe-demo.vercel.app');
  }
  if (url.pathname.startsWith('/dashboard')) {
    return Response.redirect('https://angular-mfe-demo.vercel.app');
  }
  
  return new Response('Not Found', { status: 404 });
}
```

### 3. Shared CDN Strategy
- Shared library deployed to CDN subdomain
- Versioned releases with semantic versioning
- Backward compatibility support

### 4. Monitoring & Analytics
```javascript
// Built-in Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

// Custom micro-frontend tracking
window.mfeAnalytics = {
  trackNavigation: (from, to) => {
    // Track navigation between MFEs
  },
  trackError: (error, mfe) => {
    // Track errors per micro-frontend
  }
};
```

## Benefits of This Strategy

1. **Independent Deployments**: Each MFE deploys separately
2. **Zero-Config Deployment**: Vercel handles build optimization
3. **Global CDN**: Fast loading worldwide
4. **Preview Deployments**: Test changes before production
5. **Automatic HTTPS**: SSL certificates handled by Vercel
6. **Environment Variables**: Different configs per environment
7. **Edge Functions**: Advanced routing and middleware
8. **Analytics**: Built-in performance monitoring

## Alternative: Module Federation on Vercel

For a more advanced approach, we could also implement **Webpack Module Federation** alongside Single-SPA:

```javascript
// webpack.config.js for each MFE
const ModuleFederationPlugin = require('@module-federation/webpack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'reactMfe',
      filename: 'remoteEntry.js',
      exposes: {
        './UserComponent': './src/components/UserComponent'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

This approach would provide:
- **Runtime sharing** of dependencies
- **Type safety** across micro-frontends  
- **Better performance** with shared chunks
- **Advanced caching** strategies

Would you like me to implement this deployment strategy by creating the Vercel configuration files and deployment scripts for each micro-frontend?