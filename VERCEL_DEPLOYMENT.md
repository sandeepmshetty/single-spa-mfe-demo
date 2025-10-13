# Independent Vercel Deployment Guide

## Overview

Each MFE can be deployed independently to Vercel. The shell app will load MFEs from their respective Vercel URLs.

## Prerequisites

```bash
npm install -g vercel
vercel login
```

## Deployment Steps

### 1. Deploy Shared Library First

```bash
cd packages/shared-library
npm run build
vercel --prod
# Note the URL: https://shared-library-xxx.vercel.app
```

### 2. Deploy React MFE

```bash
cd packages/react-mfe
npm run build
vercel --prod
# Note the URL: https://react-mfe-xxx.vercel.app
```

### 3. Deploy Vue MFE

```bash
cd packages/vue-mfe
npm run build
vercel --prod
# Note the URL: https://vue-mfe-xxx.vercel.app
```

### 4. Deploy Angular MFE

```bash
cd packages/angular-mfe
npm run build
vercel --prod
# Note the URL: https://angular-mfe-xxx.vercel.app
```

### 5. Update Shell App Configuration

Edit `packages/shell-app/src/shell-app.ts`:

```typescript
const appConfig = {
  production: {
    'react-mfe': 'https://react-mfe-xxx.vercel.app/react-mfe.js',
    'vue-mfe': 'https://vue-mfe-xxx.vercel.app/vue-mfe.js',
    'angular-mfe': 'https://angular-mfe-xxx.vercel.app/main.js',
    'shared-library': 'https://shared-library-xxx.vercel.app/shared-library.js'
  }
};
```

### 6. Deploy Shell App

```bash
cd packages/shell-app
npm run build
vercel --prod
# Access at: https://shell-app-xxx.vercel.app
```

## Environment Variables

Set these in Vercel dashboard for each project:

### Shell App
```
NODE_ENV=production
REACT_MFE_URL=https://react-mfe-xxx.vercel.app
VUE_MFE_URL=https://vue-mfe-xxx.vercel.app
ANGULAR_MFE_URL=https://angular-mfe-xxx.vercel.app
SHARED_LIB_URL=https://shared-library-xxx.vercel.app
```

### React MFE
```
NODE_ENV=production
PUBLIC_URL=https://react-mfe-xxx.vercel.app
```

### Vue MFE
```
NODE_ENV=production
PUBLIC_URL=https://vue-mfe-xxx.vercel.app
```

### Angular MFE
```
NODE_ENV=production
PUBLIC_URL=https://angular-mfe-xxx.vercel.app
```

## Automated Deployment Script

Create `.env.production` in root:

```bash
SHELL_URL=https://shell-app-xxx.vercel.app
REACT_MFE_URL=https://react-mfe-xxx.vercel.app
VUE_MFE_URL=https://vue-mfe-xxx.vercel.app
ANGULAR_MFE_URL=https://angular-mfe-xxx.vercel.app
SHARED_LIB_URL=https://shared-library-xxx.vercel.app
```

Run deployment:

```bash
npm run deploy:all
```

## Verifying Deployment

1. **Check CORS headers:**
```bash
curl -I https://react-mfe-xxx.vercel.app/react-mfe.js
# Should see: Access-Control-Allow-Origin: *
```

2. **Test MFE loading:**
```bash
curl https://react-mfe-xxx.vercel.app/react-mfe.js
# Should return JavaScript bundle
```

3. **Open shell app:**
```
https://shell-app-xxx.vercel.app
```

Navigate to each route and verify MFEs load correctly.

## Troubleshooting

### CORS Issues
Ensure `vercel.json` has CORS headers:
```json
{
  "headers": [{
    "source": "/(.*)",
    "headers": [{
      "key": "Access-Control-Allow-Origin",
      "value": "*"
    }]
  }]
}
```

### 404 on MFE Files
Check `outputDirectory` in `vercel.json`:
```json
{
  "outputDirectory": "dist"
}
```

### MFE Not Loading
1. Check browser console for errors
2. Verify URLs in shell app configuration
3. Test MFE URL directly in browser
4. Check Vercel deployment logs

## CI/CD with GitHub Actions

Already configured in `.github/workflows/deploy.yml`. Push to main branch triggers automatic deployment.

## Independent Updates

Each MFE can be updated independently:

```bash
# Update only React MFE
cd packages/react-mfe
# Make changes
npm run build
vercel --prod
```

Shell app will automatically load the new version on next page load.

## Rollback Strategy

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

## Cost Optimization

- Use Vercel's free tier (100GB bandwidth/month)
- Enable caching for static assets
- Use CDN for shared libraries (React, Vue from CDN)
- Monitor bandwidth usage in Vercel dashboard
