import { ILogEntry, ILogLevel } from './types';
import { LOG_LEVELS } from './constants';

/**
 * Centralized logging service for all micro-frontends
 */
export class Logger {
  private logLevel: keyof ILogLevel = 'INFO';
  private logs: ILogEntry[] = [];
  private maxLogs = 1000;
  private source: string;

  constructor(source = 'unknown', logLevel: keyof ILogLevel = 'INFO') {
    this.source = source;
    this.logLevel = logLevel;
  }

  /**
   * Debug level logging
   */
  debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  /**
   * Info level logging
   */
  info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  /**
   * Error level logging
   */
  error(message: string, data?: any): void {
    this.log('ERROR', message, data);
  }

  /**
   * Generic log method
   */
  private log(level: keyof ILogLevel, message: string, data?: any): void {
    const numericLevel = LOG_LEVELS[level];
    const currentLevel = LOG_LEVELS[this.logLevel];

    // Only log if level is high enough
    if (numericLevel < currentLevel) {
      return;
    }

    const logEntry: ILogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source: this.source
    };

    // Add to internal log store
    this.logs.push(logEntry);
    
    // Trim logs if over limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Output to console with appropriate method
    this.outputToConsole(logEntry);

    // Send to external logging service if configured
    this.sendToExternalLogger(logEntry);
  }

  /**
   * Output log entry to console
   */
  private outputToConsole(entry: ILogEntry): void {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}] [${entry.source}] [${entry.level}]`;
    
    switch (entry.level) {
      case 'DEBUG':
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case 'INFO':
        console.info(prefix, entry.message, entry.data || '');
        break;
      case 'WARN':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case 'ERROR':
        console.error(prefix, entry.message, entry.data || '');
        break;
    }
  }

  /**
   * Send log to external logging service
   */
  private sendToExternalLogger(entry: ILogEntry): void {
    // In a real implementation, this would send logs to a service like
    // Datadog, LogRocket, Sentry, etc.
    
    // For now, we'll just store in sessionStorage for debugging
    if (typeof window !== 'undefined' && entry.level === 'ERROR') {
      try {
        const errorLogs = sessionStorage.getItem('mfe-error-logs');
        const logs = errorLogs ? JSON.parse(errorLogs) : [];
        logs.push(entry);
        
        // Keep only last 50 error logs
        if (logs.length > 50) {
          logs.splice(0, logs.length - 50);
        }
        
        sessionStorage.setItem('mfe-error-logs', JSON.stringify(logs));
      } catch (error) {
        console.error('Failed to store error log:', error);
      }
    }
  }

  /**
   * Set log level
   */
  setLogLevel(level: keyof ILogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): keyof ILogLevel {
    return this.logLevel;
  }

  /**
   * Get all logs
   */
  getLogs(): ILogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: keyof ILogLevel): ILogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set maximum number of logs to keep
   */
  setMaxLogs(max: number): void {
    this.maxLogs = max;
    if (this.logs.length > max) {
      this.logs = this.logs.slice(-max);
    }
  }

  /**
   * Create a child logger with a specific source
   */
  createChild(source: string): Logger {
    return new Logger(`${this.source}:${source}`, this.logLevel);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Import logs from JSON
   */
  importLogs(jsonLogs: string): void {
    try {
      const logs = JSON.parse(jsonLogs);
      if (Array.isArray(logs)) {
        this.logs = logs;
      }
    } catch (error) {
      this.error('Failed to import logs', error);
    }
  }
}

// Create and export singleton instance
export const logger = new Logger('shared-library', 
  (typeof window !== 'undefined' && 
   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ? 'DEBUG' : 'INFO'
);