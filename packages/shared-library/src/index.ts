// Main entry point for shared library
export { EventBus, eventBus } from './event-bus';
export { AuthService, authService } from './auth-service';
export { StorageService, storageService } from './storage-service';
export { ApiClient, apiClient } from './api-client';
export { Logger, logger } from './logger';
export { Utils } from './utils';
export { SharedState, counterState, counterActions, userState, userActions } from './shared-state';
export * from './types';
export * from './constants';

// Global initialization
import { logger } from './logger';
import { eventBus } from './event-bus';
import { authService } from './auth-service';
import { storageService } from './storage-service';
import { apiClient } from './api-client';
import { Utils } from './utils';
import { counterState, counterActions, userState, userActions } from './shared-state';

logger.info('🔗 Shared Library initialized');

// Make services globally available for Single-SPA
if (typeof window !== 'undefined') {
  (window as any).sharedServices = {
    eventBus,
    authService,
    storageService,
    apiClient,
    logger,
    utils: Utils,
    counterState,
    counterActions,
    userState,
    userActions
  };
}