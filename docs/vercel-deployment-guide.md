# Vercel Deployment Configuration Guide

## Overview
This document provides the complete deployment setup for our Single-SPA micro-frontend architecture on Vercel, similar to the [page-rendering-demo.vercel.app](https://page-rendering-demo.vercel.app/) approach.

## Project Setup on Vercel

### 1. Create Vercel Projects

You'll need to create **5 separate Vercel projects**:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Create projects for each micro-frontend
cd packages/shell-app && vercel --name=mfe-shell-demo
cd packages/react-mfe && vercel --name=react-mfe-demo  
cd packages/vue-mfe && vercel --name=vue-mfe-demo
cd packages/angular-mfe && vercel --name=angular-mfe-demo
cd packages/shared-library && vercel --name=shared-mfe-demo
```

### 2. Set Environment Variables

#### For Shell App:
```bash
vercel env add REACT_MFE_URL production
# Value: https://react-mfe-demo.vercel.app

vercel env add VUE_MFE_URL production  
# Value: https://vue-mfe-demo.vercel.app

vercel env add ANGULAR_MFE_URL production
# Value: https://angular-mfe-demo.vercel.app

vercel env add SHARED_LIB_URL production
# Value: https://shared-mfe-demo.vercel.app
```

#### For Each MFE:
```bash
# React MFE
vercel env add REACT_APP_SHELL_URL production
# Value: https://mfe-shell-demo.vercel.app

# Vue MFE  
vercel env add VITE_SHELL_URL production
# Value: https://mfe-shell-demo.vercel.app

# Angular MFE
vercel env add NG_SHELL_URL production  
# Value: https://mfe-shell-demo.vercel.app
```

### 3. GitHub Repository Secrets

Add these secrets to your GitHub repository for CI/CD:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_SHELL_PROJECT_ID=shell_project_id
VERCEL_REACT_PROJECT_ID=react_project_id
VERCEL_VUE_PROJECT_ID=vue_project_id
VERCEL_ANGULAR_PROJECT_ID=angular_project_id
VERCEL_SHARED_PROJECT_ID=shared_project_id
```

## Expected Deployment URLs

### Production URLs:
```
Main Shell:     https://mfe-shell-demo.vercel.app
React MFE:      https://react-mfe-demo.vercel.app
Vue MFE:        https://vue-mfe-demo.vercel.app  
Angular MFE:    https://angular-mfe-demo.vercel.app
Shared Library: https://shared-mfe-demo.vercel.app
```

### Preview URLs (for PRs):
```
Shell:          https://mfe-shell-demo-git-feature-branch.vercel.app
React MFE:      https://react-mfe-demo-git-feature-branch.vercel.app
Vue MFE:        https://vue-mfe-demo-git-feature-branch.vercel.app
Angular MFE:    https://angular-mfe-demo-git-feature-branch.vercel.app
Shared Library: https://shared-mfe-demo-git-feature-branch.vercel.app
```

## Deployment Commands

### Manual Deployment:
```powershell
# Deploy all micro-frontends
npm run deploy:all

# Deploy individual apps
npm run deploy:shell
npm run deploy:react
npm run deploy:vue
npm run deploy:angular
npm run deploy:shared
```

### Preview Deployment:
```powershell
# Create preview deployments (for testing)
npm run preview:all
```

## Deployment Process Flow

```
1. Developer pushes code to feature branch
   ↓
2. GitHub Actions triggers workflow
   ↓
3. Deploy Shared Library first (dependencies)
   ↓
4. Deploy React, Vue, Angular MFEs in parallel
   ↓
5. Deploy Shell App with updated MFE URLs
   ↓
6. Run integration tests across all deployments
   ↓
7. Notify deployment status
```

## Monitoring & Health Checks

Each micro-frontend includes a health check endpoint:

```javascript
// /api/health.js
export default function handler(req, res) {
  res.status(200).json({
    status: 'healthy',
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
    mfe: process.env.REACT_APP_MFE_NAME || process.env.VITE_MFE_NAME
  });
}
```

### Health Check URLs:
- Shell: `https://mfe-shell-demo.vercel.app/api/health`
- React: `https://react-mfe-demo.vercel.app/health`
- Vue: `https://vue-mfe-demo.vercel.app/health`
- Angular: `https://angular-mfe-demo.vercel.app/health`

## Custom Domain Setup (Optional)

For production with custom domains:

```bash
# Add custom domains to each project
vercel domains add app.yourdomain.com --project=mfe-shell-demo
vercel domains add users.yourdomain.com --project=react-mfe-demo
vercel domains add products.yourdomain.com --project=vue-mfe-demo
vercel domains add dashboard.yourdomain.com --project=angular-mfe-demo
vercel domains add cdn.yourdomain.com --project=shared-mfe-demo
```

## Performance Optimization

### 1. Caching Strategy:
- **Static Assets**: 1 year cache with immutable headers
- **HTML Files**: No cache for dynamic loading
- **MFE Bundles**: 1 year cache with content hashing

### 2. CDN Benefits:
- Global edge distribution
- Automatic image optimization
- Brotli compression
- HTTP/2 support

### 3. Bundle Analysis:
```bash
# Analyze bundle sizes
npm run analyze --workspace=packages/shell-app
npm run analyze --workspace=packages/react-mfe
npm run analyze --workspace=packages/vue-mfe
npm run analyze --workspace=packages/angular-mfe
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure all `vercel.json` files include proper CORS headers
2. **Import Map Conflicts**: Verify environment-specific import maps
3. **Build Failures**: Check Node.js version compatibility (>=18)
4. **URL Mismatches**: Ensure environment variables are properly set

### Debug Commands:
```bash
# Check deployment logs
vercel logs

# Inspect build output
vercel inspect

# Test locally with production URLs
npm run dev:production
```

## Security Considerations

1. **Content Security Policy**: Configured in shell app
2. **CORS Headers**: Properly configured for cross-origin requests  
3. **Environment Variables**: Sensitive data stored in Vercel secrets
4. **HTTPS**: Enforced across all deployments
5. **Frame Protection**: Prevents clickjacking attacks

This deployment strategy provides:
- ✅ **Independent Deployments**: Each MFE deploys separately
- ✅ **Preview Environments**: Test changes before production
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Automatic HTTPS**: SSL certificates managed by Vercel
- ✅ **Environment Management**: Different configs per stage
- ✅ **Health Monitoring**: Built-in status checks
- ✅ **CI/CD Integration**: Automated deployment pipeline