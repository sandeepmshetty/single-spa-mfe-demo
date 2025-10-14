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
  private metrics: IPerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];

  init(mfeName: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.observeLCP(mfeName);
    this.observeFID(mfeName);
    this.observeCLS(mfeName);
    this.observeFCP(mfeName);
  }

  private observeLCP(mfeName: string): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.renderTime || lastEntry.loadTime,
          rating: this.rateLCP(lastEntry.renderTime || lastEntry.loadTime),
          mfeName,
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('LCP observation not supported');
    }
  }

  private observeFID(mfeName: string): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: this.rateFID(entry.processingStart - entry.startTime),
            mfeName,
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FID observation not supported');
    }
  }

  private observeCLS(mfeName: string): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        
        this.recordMetric({
          name: 'CLS',
          value: clsValue,
          rating: this.rateCLS(clsValue),
          mfeName,
          timestamp: Date.now()
        });
      });
      
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('CLS observation not supported');
    }
  }

  private observeFCP(mfeName: string): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FCP',
            value: entry.startTime,
            rating: this.rateFCP(entry.startTime),
            mfeName,
            timestamp: Date.now()
          });
        });
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (e) {
      console.warn('FCP observation not supported');
    }
  }

  trackCustomMetric(name: string, value: number, mfeName: string): void {
    this.recordMetric({
      name,
      value,
      rating: 'good',
      mfeName,
      timestamp: Date.now()
    });
  }

  private recordMetric(metric: IPerformanceMetric): void {
    this.metrics.push(metric);
    console.log(`📊 [${metric.mfeName}] ${metric.name}: ${metric.value.toFixed(2)}ms (${metric.rating})`);
    
    // TODO: Send to monitoring service (Sentry, DataDog, etc.)
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
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

export const performanceMonitor = new PerformanceMonitorService();
