/**
 * Global error handler for shell app
 */

export class GlobalErrorHandler {
  private initialized = false;

  init(): void {
    if (this.initialized || globalThis === undefined) {
      return;
    }

    // Handle uncaught errors
    globalThis.addEventListener('error', (event) => {
      console.error('🚨 [Shell] Uncaught error:', event.error);
      // Log to API
      fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.message,
          stack: event.error?.stack,
          source: 'shell-app',
          severity: 'high'
        })
      }).catch(console.error);
    });

    // Handle unhandled promise rejections
    globalThis.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 [Shell] Unhandled rejection:', event.reason);
      fetch('/api/errors/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.reason?.message || 'Unhandled promise rejection',
          stack: event.reason?.stack,
          source: 'shell-app',
          severity: 'high'
        })
      }).catch(console.error);
    });

    // Handle Single-SPA errors
    globalThis.addEventListener('single-spa:routing-event', (event: any) => {
      if (event.detail?.error) {
        console.error('🚨 [Shell] Routing error:', event.detail.error);
        fetch('/api/errors/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: 'Single-SPA routing error',
            stack: event.detail.error.stack,
            source: 'shell-app',
            severity: 'critical'
          })
        }).catch(console.error);
      }
    });

    this.initialized = true;
    console.log('✅ [Shell] Global error handler initialized');
  }

  destroy(): void {
    this.initialized = false;
  }
}

export const globalErrorHandler = new GlobalErrorHandler();
