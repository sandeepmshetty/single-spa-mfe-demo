# Error Boundaries & Fallbacks Implementation

## Overview
Centralized error handling system across all MFEs with error boundaries, fallback UIs, and error logging.

## Components

### 1. Error Logger (Shared Library)
**Location**: `packages/shared-library/src/error-handling/ErrorLogger.ts`

**Features**:
- Centralized error logging across all MFEs
- Error severity levels (low, medium, high, critical)
- Subscriber pattern for error notifications
- Automatic error storage with max limit
- Ready for monitoring service integration

**Usage**:
```typescript
import { errorLogger } from '@single-spa-demo/shared-library';

errorLogger.logError(error, 'react-mfe', 'critical', { customData: 'value' });
```

### 2. React Error Boundary
**Location**: `packages/react-mfe/src/components/ErrorBoundary.tsx`

**Features**:
- Class-based error boundary component
- Custom fallback UI support
- Automatic error logging
- Reload functionality

**Usage**:
```tsx
import { ErrorBoundary } from './components/ErrorBoundary';

<ErrorBoundary mfeName="react-mfe">
  <YourComponent />
</ErrorBoundary>
```

### 3. Vue Error Handler
**Location**: `packages/vue-mfe/src/composables/useErrorHandler.ts`

**Features**:
- Composition API error handler
- Error state management
- Error reset functionality
- Automatic error logging

**Usage**:
```vue
<script setup>
import { useErrorHandler } from './composables/useErrorHandler';
import ErrorFallback from './components/ErrorFallback.vue';

const { error, hasError, resetError } = useErrorHandler('vue-mfe');
</script>

<template>
  <ErrorFallback v-if="hasError" :error="error" />
  <YourComponent v-else />
</template>
```

### 4. Angular Error Handler
**Location**: `packages/angular-mfe/src/app/services/error-handler.service.ts`

**Features**:
- Global error handler service
- Automatic error logging
- Angular ErrorHandler implementation

**Usage**:
```typescript
// In app.config.ts or module providers
import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './services/error-handler.service';

providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
]
```

## Integration Steps

### React MFE
1. Wrap root component with ErrorBoundary
2. Import and use in main entry point

### Vue MFE
1. Use useErrorHandler composable in App.vue
2. Add ErrorFallback component conditionally

### Angular MFE
1. Register GlobalErrorHandler in providers
2. Use ErrorFallbackComponent for error states

## Testing

Test error scenarios:
```typescript
// Trigger error for testing
throw new Error('Test error');
```

## Next Steps
- [ ] Integrate with Sentry/DataDog
- [ ] Add error recovery strategies
- [ ] Implement error notification system
- [ ] Add error analytics dashboard
