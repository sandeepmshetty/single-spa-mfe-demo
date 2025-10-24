/**
 * Loading State Manager
 * Manages loading, error, and UI state transitions
 */

export class LoadingStateManager {
  showLoading(message = 'Loading...'): void {
    const loadingContainer = document.getElementById('loading-container');
    const loadingText = loadingContainer?.querySelector('.loading-text');

    if (loadingContainer && loadingText) {
      loadingText.textContent = message;
      loadingContainer.style.display = 'flex';
    }

    const mfeContainer = document.getElementById('mfe-container');
    if (mfeContainer) {
      mfeContainer.dataset.loading = 'true';
    }
  }

  hideLoading(): void {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
      loadingContainer.style.display = 'none';
    }

    const mfeContainer = document.getElementById('mfe-container');
    if (mfeContainer) {
      delete mfeContainer.dataset.loading;
    }
  }

  showError(message: string): void {
    this.hideLoading();

    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-container">
          <span class="error-icon">⚠️</span>
          <span class="error-message">${message}</span>
          <button class="error-close" onclick="this.parentElement.remove()">✕</button>
        </div>
      `;
      errorContainer.style.display = 'block';

      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (errorContainer.style.display !== 'none') {
          errorContainer.style.display = 'none';
        }
      }, 10000);
    }
  }

  clearError(): void {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }
  }
}

export const loadingStateManager = new LoadingStateManager();
