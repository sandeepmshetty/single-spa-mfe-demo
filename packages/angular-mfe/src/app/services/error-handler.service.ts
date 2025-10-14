import { ErrorHandler, Injectable } from '@angular/core';
import { errorLogger } from '@single-spa-demo/shared-library';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    errorLogger.logError(error, 'angular-mfe', 'critical', {
      timestamp: new Date().toISOString()
    });
    console.error('Angular Error:', error);
  }
}
