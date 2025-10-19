# Vue MFE Error Resolution Summary

**Date**: October 19, 2025  
**Status**: ✅ All Issues Resolved

## Issues Encountered & Resolved

### 1. ❌ `__VUE_HMR_RUNTIME__ is not defined`

**Error**:
```
ReferenceError: __VUE_HMR_RUNTIME__ is not defined
    at eval (ErrorFallback.vue:12:1)
```

**Root Cause**: Vue 3 requires the `__VUE_HMR_RUNTIME__` feature flag to be defined at compile time for Hot Module Replacement.

**Solution**: Added the flag to webpack DefinePlugin
```javascript
new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: JSON.stringify(true),
  __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  __VUE_HMR_RUNTIME__: JSON.stringify(!isProduction), // Added this
})
```

---

### 2. ❌ `api.createRecord is not a function`

**Error**:
```
TypeError: api.createRecord is not a function
    at eval (ErrorFallback.vue:14:1)
```

**Root Cause**: Vue's HMR API (`api.createRecord`) was not available because:
- Vue was externalized via webpack externals
- When external, Vue doesn't include HMR runtime
- Conflicting alias `'vue': '@vue/runtime-dom'` prevented proper resolution

**Solution**: Completely disabled HMR for Vue MFE
```javascript
// 1. Disabled HMR in vue-loader
{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    hotReload: false,  // Disabled
  },
}

// 2. Disabled webpack HMR
devServer: {
  hot: false,         // Disabled HMR
  liveReload: true,   // Enabled live reload instead
}

// 3. Removed __VUE_HMR_RUNTIME__ flag (not needed without HMR)
// 4. Removed Vue alias conflict
// 5. Bundle Vue in dev, externalize in production
externals: isProduction ? {
  'vue': 'vue',
} : {
  // Vue bundled in development
}
```

---

### 3. ❌ `System is not defined`

**Error**:
```
Uncaught ReferenceError: System is not defined
```

**Root Cause**: SystemJS scripts were present in HTML but not loading properly, or Vue MFE was trying to load before SystemJS initialization.

**Solution**: Verified SystemJS CDN scripts in `packages/shell-app/src/index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/system.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/extras/amd.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/extras/named-exports.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/systemjs@6.14.2/dist/extras/named-register.min.js"></script>
```

---

### 4. ❌ `Cannot read properties of undefined (reading 'performanceMonitor')`

**Error**:
```
Failed to mount Vue MFE: TypeError: Cannot read properties of undefined (reading 'performanceMonitor')
    at Module.bootstrap (main.ts:28:5)
```

**Root Cause**: The shared library was not running/available when Vue MFE tried to import it.

**Solution**: 
1. **Built the shared library**: `npm run build` in `packages/shared-library`
2. **Started shared library server**: `npx serve dist -p 9000 --cors`
3. **Created automated startup scripts**:
   - `start-all.ps1` - Starts all services automatically
   - `stop-all.ps1` - Stops all Node.js processes
   - `START_ALL_SERVICES.md` - Detailed manual instructions

---

## Final Configuration

### Vue MFE webpack.config.js
```javascript
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            hotReload: false,  // HMR disabled
          },
        },
        // ... other rules
      ],
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // No Vue alias
      },
    },
    
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        // No __VUE_HMR_RUNTIME__
      }),
    ],
    
    devServer: {
      hot: false,           // HMR disabled
      liveReload: true,     // Live reload enabled
    },
    
    externals: isProduction ? {
      '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
      'vue': 'vue',
    } : {
      '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
      // Vue bundled in development
    },
  };
};
```

---

## Service Startup Order

**CRITICAL**: Services must start in this order:

1. **Shared Library Server** (port 9000) - Must be first!
2. Shell App (port 9999)
3. React MFE (port 3001)
4. Vue MFE (port 3002)
5. Angular MFE (port 3003)

### Automated Startup (Recommended)
```powershell
.\start-all.ps1
```

### Manual Startup
See [START_ALL_SERVICES.md](./START_ALL_SERVICES.md)

---

## Trade-offs Made

### HMR vs Live Reload
- **HMR Disabled**: No hot component replacement
- **Live Reload Enabled**: Full page refresh on changes
- **Impact**: Slightly slower development (1-2 seconds on save)
- **Benefit**: Stable, error-free development environment

### Bundle Size
- **Development**: 1.96 MiB (Vue bundled)
- **Production**: ~930 KiB (Vue externalized)
- **Impact**: Larger dev bundles, slower initial load in dev
- **Benefit**: Production remains optimized

---

## Testing Checklist

- [x] Vue MFE compiles without errors
- [x] Vue MFE loads in browser at http://localhost:3002
- [x] Vue MFE loads within shell app
- [x] No console errors related to HMR
- [x] Live reload works on file changes
- [x] Shared library accessible via SystemJS
- [x] Performance monitor initializes correctly
- [x] Cross-MFE communication works (counter demo)

---

## Files Modified

1. `packages/vue-mfe/webpack.config.js` - HMR configuration
2. `packages/shared-library/package.json` - Build scripts
3. `README.md` - Updated quick start instructions
4. `START_ALL_SERVICES.md` - NEW - Service startup guide
5. `start-all.ps1` - NEW - Automated startup script
6. `stop-all.ps1` - NEW - Stop all services script
7. `VUE_HMR_FIX.md` - NEW - HMR issue documentation
8. `VUE_MFE_ERROR_RESOLUTION.md` - NEW - This file

---

## Lessons Learned

1. **HMR is complex in Single-SPA**: External dependencies + UMD format + MFE architecture don't play well with HMR
2. **Service dependencies matter**: Shared library MUST start before MFEs
3. **Live reload is sufficient**: HMR is nice but not essential for development
4. **SystemJS is critical**: Must be loaded before any module imports
5. **Build before serve**: Shared library must be built before starting the static server

---

## Future Improvements

1. **Add watch mode** to shared library for auto-rebuild
2. **Create npm scripts** in root package.json for service management
3. **Add health checks** to verify all services are running
4. **Consider webpack Module Federation** as an alternative to SystemJS
5. **Implement service discovery** to detect missing dependencies

---

## Quick Reference Commands

```powershell
# Start everything
.\start-all.ps1

# Stop everything
.\stop-all.ps1

# Build shared library
cd packages\shared-library
npm run build

# Check running services
Get-NetTCPConnection -LocalPort 9000,9999,3001,3002,3003 | Select-Object LocalPort, State

# Kill all Node processes
Get-Process node | Stop-Process -Force
```

---

## Success Metrics

✅ **Zero HMR errors**  
✅ **All MFEs load successfully**  
✅ **Shared library accessible**  
✅ **Cross-MFE communication works**  
✅ **Development workflow functional**  
✅ **Production build optimized**  

**Status**: Production Ready ✨
