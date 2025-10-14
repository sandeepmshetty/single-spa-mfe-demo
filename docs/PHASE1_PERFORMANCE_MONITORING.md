# Performance Monitoring Implementation

## Overview
Performance monitoring system tracking Core Web Vitals (LCP, FID, CLS, FCP) and custom metrics across all MFEs.

## Components

### Performance Monitor (Shared Library)
**Location**: `packages/shared-library/src/monitoring/PerformanceMonitor.ts`

**Features**:
- Core Web Vitals tracking (LCP, FID, CLS, FCP)
- Custom metric tracking
- Performance rating (good, needs-improvement, poor)
- Per-MFE metric collection
- Ready for monitoring service integration

## Core Web Vitals

### 1. Largest Contentful Paint (LCP)
Measures loading performance
- **Good**: ≤ 2.5s
- **Needs Improvement**: ≤ 4.0s
- **Poor**: > 4.0s

### 2. First Input Delay (FID)
Measures interactivity
- **Good**: ≤ 100ms
- **Needs Improvement**: ≤ 300ms
- **Poor**: > 300ms

### 3. Cumulative Layout Shift (CLS)
Measures visual stability
- **Good**: ≤ 0.1
- **Needs Improvement**: ≤ 0.25
- **Poor**: > 0.25

### 4. First Contentful Paint (FCP)
Measures perceived load speed
- **Good**: ≤ 1.8s
- **Needs Improvement**: ≤ 3.0s
- **Poor**: > 3.0s

## Usage

### Initialize in Each MFE

**React MFE**:
```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

// In bootstrap or mount
export const bootstrap = async () => {
  performanceMonitor.init('react-mfe');
};
```

**Vue MFE**:
```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

export const bootstrap = async () => {
  performanceMonitor.init('vue-mfe');
};
```

**Angular MFE**:
```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

export const bootstrap = async () => {
  performanceMonitor.init('angular-mfe');
};
```

### Track Custom Metrics

```typescript
import { performanceMonitor } from '@single-spa-demo/shared-library';

// Track custom metric
const startTime = performance.now();
// ... do something
const duration = performance.now() - startTime;

performanceMonitor.trackCustomMetric('api-call-duration', duration, 'react-mfe');
```

### Get Metrics

```typescript
const metrics = performanceMonitor.getMetrics();
console.log('All metrics:', metrics);
```

### Cleanup

```typescript
// In unmount
export const unmount = async () => {
  performanceMonitor.cleanup();
};
```

## Integration with Monitoring Services

### Sentry Integration (Example)
```typescript
// In PerformanceMonitor.ts recordMetric method
import * as Sentry from '@sentry/browser';

private recordMetric(metric: PerformanceMetric): void {
  this.metrics.push(metric);
  
  // Send to Sentry
  Sentry.captureMessage(`Performance: ${metric.name}`, {
    level: metric.rating === 'poor' ? 'warning' : 'info',
    extra: {
      value: metric.value,
      rating: metric.rating,
      mfeName: metric.mfeName
    }
  });
}
```

### DataDog Integration (Example)
```typescript
// In PerformanceMonitor.ts recordMetric method
import { datadogRum } from '@datadog/browser-rum';

private recordMetric(metric: PerformanceMetric): void {
  this.metrics.push(metric);
  
  // Send to DataDog
  datadogRum.addTiming(metric.name, metric.value);
  datadogRum.addAction(metric.name, {
    rating: metric.rating,
    mfeName: metric.mfeName
  });
}
```

## Performance Budgets

Set performance budgets in webpack config:
```javascript
module.exports = {
  performance: {
    maxAssetSize: 244000, // 244 KB
    maxEntrypointSize: 244000,
    hints: 'warning'
  }
};
```

## Monitoring Dashboard

Create a dashboard component to visualize metrics:
```tsx
import { performanceMonitor } from '@single-spa-demo/shared-library';

function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics());
  
  return (
    <div>
      {metrics.map(metric => (
        <div key={metric.timestamp}>
          <strong>{metric.name}</strong>: {metric.value.toFixed(2)}ms
          <span className={metric.rating}>{metric.rating}</span>
        </div>
      ))}
    </div>
  );
}
```

## Next Steps
- [ ] Integrate with Sentry or DataDog
- [ ] Create performance dashboard UI
- [ ] Set up performance alerts
- [ ] Add bundle size monitoring
- [ ] Implement performance budgets
- [ ] Add network performance tracking
- [ ] Create performance reports
- [ ] Set up automated performance testing
