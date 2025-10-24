/**
 * Centralized error logging service for all MFEs
 */

export interface IErrorLog {
  message: string;
  stack?: string;
  componentStack?: string;
  mfeName: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

class ErrorLoggerService {
  private logs: IErrorLog[] = [];
  private readonly maxLogs = 100;
  private listeners: Array<(log: IErrorLog) => void> = [];

  logError(
    error: Error,
    mfeName: string,
    severity: IErrorLog['severity'] = 'high',
    metadata?: Record<string, any>
  ) {
    const errorLog: IErrorLog = {
      message: error.message,
      stack: error.stack,
      mfeName,
      timestamp: Date.now(),
      severity,
      metadata,
    };

    this.logs.push(errorLog);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.notifyListeners(errorLog);
    this.sendToMonitoring(errorLog);
  }

  subscribe(listener: (log: IErrorLog) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(log: IErrorLog) {
    for (const listener of this.listeners) {
      try {
        listener(log);
      } catch (e) {
        console.error('Error in error logger listener:', e);
      }
    }
  }

  private sendToMonitoring(log: IErrorLog) {
    // Log to console for development
    console.error(`[${log.mfeName}] ${log.severity.toUpperCase()}:`, log.message);
    if (log.stack) {
      console.error(log.stack);
    }

    // Send to Sentry if available (integrated via sharedServices)
    if (typeof globalThis !== 'undefined' && (globalThis as any).sharedServices?.captureError) {
      const error = new Error(log.message);
      error.stack = log.stack;
      (globalThis as any).sharedServices.captureError(error, {
        level: log.severity,
        tags: {
          mfe: log.mfeName,
        },
        extra: log.metadata,
      });
    }
  }

  getLogs(): IErrorLog[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLoggerService();
