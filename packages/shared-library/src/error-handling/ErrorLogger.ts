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

  logError(error: Error, mfeName: string, severity: IErrorLog['severity'] = 'high', metadata?: Record<string, any>) {
    const errorLog: IErrorLog = {
      message: error.message,
      stack: error.stack,
      mfeName,
      timestamp: Date.now(),
      severity,
      metadata
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
    this.listeners.forEach(listener => {
      try {
        listener(log);
      } catch (e) {
        console.error('Error in error logger listener:', e);
      }
    });
  }

  private sendToMonitoring(log: IErrorLog) {
    // TODO: Integrate with monitoring service (Sentry, DataDog, etc.)
    console.error(`[${log.mfeName}] ${log.severity.toUpperCase()}:`, log.message);
    if (log.stack) {
      console.error(log.stack);
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
