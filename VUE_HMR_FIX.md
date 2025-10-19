# Vue MFE HMR Error Fix

## Problem
The Vue micro-frontend was failing to load with the following errors:
```
TypeError: api.createRecord is not a function
ReferenceError: __VUE_HMR_RUNTIME__ is not defined
```

## Root Cause
Vue's Hot Module Replacement (HMR) API requires proper initialization that conflicts with:
1. Vue being externalized in development mode
2. Single-SPA's module loading mechanism
3. Webpack's HMR runtime not being compatible with UMD library target

## Solution
Disabled HMR entirely for the Vue MFE and bundled Vue in development mode.

## Changes Made

### 1. Disabled Vue HMR in vue-loader
```javascript
{
  test: /\.vue$/,
  loader: 'vue-loader',
  options: {
    hotReload: false,  // Disabled HMR
  },
}
```

### 2. Disabled Webpack Dev Server HMR
```javascript
devServer: {
  port: 3002,
  historyApiFallback: true,
  hot: false,           // Disabled HMR
  liveReload: true,     // Enabled live reload instead
  // ... other config
}
```

### 3. Removed __VUE_HMR_RUNTIME__ Flag
```javascript
new webpack.DefinePlugin({
  __VUE_OPTIONS_API__: JSON.stringify(true),
  __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
  __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
  // Removed: __VUE_HMR_RUNTIME__
})
```

### 4. Bundled Vue in Development Mode
```javascript
externals: isProduction ? {
  '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
  'vue': 'vue',
} : {
  '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
  // Vue is NOT externalized in development
}
```

### 5. Removed Vue Alias Conflict
```javascript
resolve: {
  extensions: ['.tsx', '.ts', '.js', '.vue'],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    // Removed: 'vue': '@vue/runtime-dom'
  },
}
```

## Results

### Before
- ❌ Failed to load with HMR errors
- Bundle size: N/A (failed to build)

### After
- ✅ Successfully compiles and loads
- **Development bundle**: 1.96 MiB (Vue bundled)
- **Production bundle**: ~930 KiB (Vue externalized)
- Live reload works for development
- No HMR errors

## Trade-offs

### Pros
- ✅ Vue MFE loads successfully
- ✅ No runtime errors
- ✅ Live reload still available
- ✅ Production bundle remains small

### Cons
- ⚠️ Full page reload on changes (instead of hot reload)
- ⚠️ Larger development bundle size
- ⚠️ Slightly slower development experience

## Alternative Approaches Considered

1. **Fix HMR with externalized Vue**: Not possible due to Single-SPA architecture
2. **Use Module Federation**: Would require major refactoring
3. **Disable externals completely**: Would increase production bundle size significantly

## Recommendation

This solution is the best compromise for Single-SPA architecture:
- Maintains small production bundles
- Provides working development environment
- Avoids complex architectural changes
- Live reload is sufficient for development workflow

## Testing

To verify the fix:
```bash
cd packages/vue-mfe
npm start
```

Then open the shell app and navigate to the Vue MFE section. The Vue MFE should load without errors.
