# Quick Deploy to Vercel

## One-Command Deployment

```bash
# Deploy all MFEs to production
npm run deploy:all

# Deploy preview (staging)
npm run deploy:preview
```

## Manual Step-by-Step

### 1. Install Vercel CLI
```bash
npm install -g vercel
vercel login
```

### 2. Deploy Each MFE

```bash
# Shared Library
cd packages/shared-library
npm run build
vercel --prod

# React MFE
cd ../react-mfe
npm run build
vercel --prod

# Vue MFE
cd ../vue-mfe
npm run build
vercel --prod

# Angular MFE
cd ../angular-mfe
npm run build
vercel --prod

# Shell App (last)
cd ../shell-app
npm run build
vercel --prod
```

### 3. Update Configuration

After deployment, update `packages/shell-app/src/config.ts` with actual Vercel URLs:

```typescript
production: {
  'react-mfe': 'https://your-react-mfe.vercel.app/react-mfe.js',
  'vue-mfe': 'https://your-vue-mfe.vercel.app/vue-mfe.js',
  'angular-mfe': 'https://your-angular-mfe.vercel.app/main.js',
  'shared-library': 'https://your-shared-lib.vercel.app/shared-library.js'
}
```

### 4. Redeploy Shell App

```bash
cd packages/shell-app
npm run build
vercel --prod
```

## Verify Deployment

1. Open shell app URL in browser
2. Navigate to each route:
   - `/` - Home
   - `/users` - React MFE
   - `/products` - Vue MFE
   - `/dashboard` - Angular MFE
3. Check browser console for errors
4. Verify CORS headers in Network tab

## Independent Updates

Update single MFE without affecting others:

```bash
# Update only React MFE
cd packages/react-mfe
# Make your changes
npm run build
vercel --prod
```

Shell app will load the new version automatically.

## Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

## Environment Variables

Set in Vercel dashboard for shell-app project:
- `REACT_MFE_URL`
- `VUE_MFE_URL`
- `ANGULAR_MFE_URL`
- `SHARED_LIB_URL`

## Troubleshooting

**CORS Error:**
- Check `vercel.json` has CORS headers
- Verify `Access-Control-Allow-Origin: *`

**404 on MFE files:**
- Check `outputDirectory: "dist"` in `vercel.json`
- Verify build output location

**MFE not loading:**
- Test MFE URL directly: `https://your-mfe.vercel.app/react-mfe.js`
- Check browser console for errors
- Verify URLs in `config.ts`

## CI/CD

Push to `main` branch triggers automatic deployment via GitHub Actions.

See `.github/workflows/deploy.yml` for configuration.
