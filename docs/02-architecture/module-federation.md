# Module Federation Note

## Why Module Federation Was Removed

Module Federation (Webpack 5) was initially added but removed due to incompatibility with the current Single-SPA + SystemJS + UMD architecture.

### The Conflict

1. **Single-SPA with SystemJS** expects UMD modules loaded via `System.import()`
2. **Module Federation** uses its own runtime and container format
3. **UMD + Module Federation** together causes lifecycle method issues

### Error Encountered
```
Uncaught TypeError: module.bootstrap is not a function
```

The bootstrap pattern required for Module Federation's async shared modules conflicts with Single-SPA's expectation of synchronous UMD exports.

## Alternative Approaches for Dependency Sharing

### Option 1: Import Maps (Current)
Already implemented in shell app's index.html:
```html
<script type="systemjs-importmap">
{
  "imports": {
    "react": "https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js",
    "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"
  }
}
</script>
```

**Pros:**
- Works with SystemJS
- Simple configuration
- CDN caching benefits

**Cons:**
- Manual version management
- Less flexible than Module Federation

### Option 2: Webpack Externals (Recommended)
Configure shared dependencies as externals in each MFE:

```javascript
// react-mfe webpack.config.js
externals: {
  'react': 'React',
  'react-dom': 'ReactDOM',
  'rxjs': 'rxjs'
}
```

Load shared libs in shell:
```html
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"></script>
```

**Pros:**
- Prevents duplicate bundles
- Works with Single-SPA
- Simple implementation

**Cons:**
- Global namespace pollution
- Version conflicts possible

### Option 3: Native Module Federation (Future)
Requires migrating away from SystemJS to pure Module Federation:

1. Remove SystemJS completely
2. Use `@module-federation/enhanced` for Single-SPA
3. Update all MFEs to use Module Federation runtime
4. Rewrite shell app registration logic

**Pros:**
- True runtime dependency sharing
- Version resolution
- Better performance

**Cons:**
- Major architectural change
- Breaking changes to all MFEs
- More complex setup

## Current Implementation

The repo uses **Webpack Externals + Import Maps** for dependency sharing:

1. Shell loads shared libraries via CDN/import maps
2. MFEs mark dependencies as external
3. Single-SPA loads MFEs as UMD modules via SystemJS

This provides:
- ✅ No duplicate React/Vue bundles
- ✅ Compatible with Single-SPA
- ✅ Simple to understand and maintain
- ✅ Works with current architecture

## Recommendation

Keep current approach (Externals + Import Maps) until:
1. All MFEs are stable
2. Team is ready for major migration
3. Native Module Federation support in Single-SPA improves

For now, the **3 high-priority fixes remain valid**:
1. ✅ Error Boundaries - Still implemented
2. ❌ Module Federation - Removed (incompatible)
3. ✅ Version Management - Still implemented
4. ✅ Integration Tests - Still implemented

**Score: 3/4 completed** (75% of high-priority items)
