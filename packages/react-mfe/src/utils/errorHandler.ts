/**
 * Error Handler Utility
 * Centralized error handling and formatting
 */
import { getSharedServices } from '../types/global';

export interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
  timestamp: Date;
}

export class ErrorHandler {
  /**
   * Handle and format errors
   */
  static handle(error: any, context: string = 'Unknown'): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: this.formatErrorMessage(error),
      code: error.code || error.name,
      context,
      timestamp: new Date(),
    };

    // Log to monitoring service
    this.logError(errorInfo);

    return errorInfo;
  }

  /**
   * Format error message for user display
   */
  static formatErrorMessage(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (error.message) {
      return error.message;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return 'An unexpected error occurred';
  }

  /**
   * Log error to monitoring service
   */
  private static logError(errorInfo: ErrorInfo): void {
    const sharedServices = getSharedServices();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error:', errorInfo);
    }

    // Log to monitoring service (Sentry, etc.)
    sharedServices?.captureError?.(
      new Error(`[${errorInfo.context}] ${errorInfo.message}`)
    );
  }

  /**
   * Check if error is network-related
   */
  static isNetworkError(error: any): boolean {
    return (
      error.message?.includes('network') ||
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR' ||
      !navigator.onLine
    );
  }

  /**
   * Check if error is authentication-related
   */
  static isAuthError(error: any): boolean {
    return (
      error.code === '401' ||
      error.code === '403' ||
      error.message?.includes('unauthorized') ||
      error.message?.includes('authentication')
    );
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: any): string {
    if (this.isNetworkError(error)) {
      return 'Network connection error. Please check your internet connection and try again.';
    }

    if (this.isAuthError(error)) {
      return 'Authentication error. Please log in again.';
    }

    return this.formatErrorMessage(error);
  }
}

/**
 * Error messages constants
 */
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_NOT_CONFIRMED: 'Please verify your email address',
    SERVICE_UNAVAILABLE: 'Authentication service is unavailable',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    PROVIDER_DISABLED: 'This authentication method is not enabled',
  },
  NETWORK: {
    OFFLINE: 'You are offline. Please check your internet connection.',
    TIMEOUT: 'Request timed out. Please try again.',
    SERVER_ERROR: 'Server error. Please try again later.',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    PASSWORDS_MISMATCH: 'Passwords do not match',
  },
  GENERAL: {
    UNEXPECTED: 'An unexpected error occurred',
    TRY_AGAIN: 'Something went wrong. Please try again.',
    CONTACT_SUPPORT: 'If the problem persists, please contact support.',
  },
} as const;
