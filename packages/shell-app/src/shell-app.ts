/* eslint-disable @typescript-eslint/no-floating-promises */
// Note: Top-level await is disabled due to webpack target environment limitations
import { navigateToUrl } from 'single-spa';
import type { ShellAppDebug } from '@/types';
import { lifecycleManager } from '@/core';
import { loadingStateManager } from '@/ui';
import { healthCheckService } from '@/services';

/**
 * Initialize when DOM is ready
 * Note: Using promise chain instead of top-level await due to webpack target limitations
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lifecycleManager.initialize().catch(error => {
      console.error('Failed to initialize application:', error);
      loadingStateManager.showError(
        'Failed to initialize the application. Please refresh the page.'
      );
    });
  });
} else {
  lifecycleManager.initialize().catch(error => {
    console.error('Failed to initialize application:', error);
    loadingStateManager.showError('Failed to initialize the application. Please refresh the page.');
  });
}

/**
 * Export debugging interface
 * Available via window.shellApp for runtime debugging
 */
const shellAppDebug: ShellAppDebug = {
  navigateToUrl,
  sharedServices: () => lifecycleManager.getSharedServices(),
  performHealthCheck: () =>
    healthCheckService.performHealthCheck(lifecycleManager.getSharedServices()),
  showLoadingState: (message?: string) => loadingStateManager.showLoading(message),
  hideLoadingState: () => loadingStateManager.hideLoading(),
  showErrorState: (message: string) => loadingStateManager.showError(message),
};

(globalThis as typeof globalThis & { shellApp: ShellAppDebug }).shellApp = shellAppDebug;

export default {};
