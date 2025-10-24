/**
 * Performance monitoring for Core Web Vitals and custom metrics
 */

export type PerformanceRating = 'good' | 'needs-improvement' | 'poor';

export interface IPerformanceMetric {
  name: string;
  value: number;
  rating: PerformanceRating;
  mfeName: string;
  timestamp: number;
}

class PerformanceMonitorService {
  private readonly metrics: IPerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  init(mfeName: string): void {
    if (globalThis.window === undefined) {
      return;
    }

    this.observeLCP(mfeName);
    this.observeFID(mfeName);
    this.observeCLS(mfeName);
    this.observeFCP(mfeName);
  }

  private observeLCP(mfeName: string): void {
    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries.at(-1) as any;

        this.recordMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: this.rateLCP(lastEntry.renderTime || lastEntry.loadTime),
          mfeName,
          timestamp: Date.now(),
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      // LCP observation not supported in this browser
      console.debug('LCP observation not supported:', e);
    }
  }

  private observeFID(mfeName: string): void {
    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        for (const entry of entries) {
          this.recordMetric({
            name: 'FID',
            value: (entry as any).processingStart - entry.startTime,
            rating: this.rateFID((entry as any).processingStart - entry.startTime),
            mfeName,
            timestamp: Date.now(),
          });
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      // FID observation not supported in this browser
      console.debug('FID observation not supported:', e);
    }
  }

  private observeCLS(mfeName: string): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          rating: this.rateCLS(clsValue),
          mfeName,
          timestamp: Date.now(),
        });
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      // CLS observation not supported in this browser
      console.debug('CLS observation not supported:', e);
    }
  }

  private observeFCP(mfeName: string): void {
    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        for (const entry of entries) {
          this.recordMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: this.rateFCP(entry.startTime),
            mfeName,
            timestamp: Date.now(),
          });
        }
      });

      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      // FCP observation not supported in this browser
      console.debug('FCP observation not supported:', e);
    }
  }

  trackCustomMetric(name: string, value: number, mfeName: string): void {
    this.recordMetric({
      name,
      value,
      rating: 'good',
      mfeName,
      timestamp: Date.now(),
    });
  }

  private recordMetric(metric: IPerformanceMetric): void {
    this.metrics.push(metric);
    // Use console.log for performance metrics to avoid circular dependencies
    // eslint-disable-next-line no-console
    console.log(
      `📊 [${metric.mfeName}] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`
    );

    // Send to Sentry for performance monitoring if available
    if (typeof globalThis !== 'undefined' && (globalThis as any).sharedServices?.trackEvent) {
      (globalThis as any).sharedServices.trackEvent('performance_metric', {
        metric_name: metric.name,
        value: metric.value,
        rating: metric.rating,
        mfe: metric.mfeName,
      });
    }
  }

  private rateLCP(value: number): PerformanceRating {
    if (value <= 2500) {
      return 'good';
    }
    if (value <= 4000) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private rateFID(value: number): PerformanceRating {
    if (value <= 100) {
      return 'good';
    }
    if (value <= 300) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private rateCLS(value: number): PerformanceRating {
    if (value <= 0.1) {
      return 'good';
    }
    if (value <= 0.25) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  private rateFCP(value: number): PerformanceRating {
    if (value <= 1800) {
      return 'good';
    }
    if (value <= 3000) {
      return 'needs-improvement';
    }
    return 'poor';
  }

  getMetrics(): IPerformanceMetric[] {
    return [...this.metrics];
  }

  cleanup(): void {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitorService();
