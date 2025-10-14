/**
 * Sentry monitoring integration
 * Install: npm install @sentry/browser @sentry/tracing
 */

export interface ISentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate?: number;
  beforeSend?: (event: any) => any;
}

export class SentryIntegration {
  private initialized = false;
  private sentry: any;

  async init(config: ISentryConfig): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Dynamic import to avoid bundling if not used
      const Sentry: any = await import('@sentry/browser' as any).catch(() => null);
      const tracingModule: any = await import('@sentry/tracing' as any).catch(() => null);
      
      if (!Sentry || !tracingModule) {
        console.warn('⚠️ Sentry packages not installed. Run: npm install @sentry/browser @sentry/tracing');
        return;
      }
      
      const { BrowserTracing } = tracingModule;

      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        release: config.release,
        integrations: [new BrowserTracing()],
        tracesSampleRate: config.tracesSampleRate || 0.1,
        beforeSend: config.beforeSend
      });

      this.sentry = Sentry;
      this.initialized = true;
      console.log('✅ Sentry monitoring initialized');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Sentry:', error);
    }
  }

  captureError(error: Error, context?: Record<string, any>): void {
    if (!this.initialized || !this.sentry) {
      return;
    }

    this.sentry.captureException(error, {
      extra: context
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
    if (!this.initialized || !this.sentry) {
      return;
    }

    this.sentry.captureMessage(message, level);
  }

  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.initialized || !this.sentry) {
      return;
    }

    this.sentry.setUser(user);
  }

  addBreadcrumb(breadcrumb: { message: string; category?: string; level?: string; data?: any }): void {
    if (!this.initialized || !this.sentry) {
      return;
    }

    this.sentry.addBreadcrumb(breadcrumb);
  }
}

export const sentryIntegration = new SentryIntegration();
