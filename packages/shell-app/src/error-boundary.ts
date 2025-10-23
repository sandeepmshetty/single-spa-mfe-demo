// Error Boundary for MFE Loading Failures
export interface IErrorBoundaryConfig {
  name: string;
  onError?: (error: Error) => void;
  fallbackUI?: string;
}

export class MFEErrorBoundary {
  private readonly config: IErrorBoundaryConfig;
  private container: HTMLElement | null = null;

  constructor(config: IErrorBoundaryConfig) {
    this.config = config;
  }

  wrap(app: () => Promise<any>): () => Promise<any> {
    return async () => {
      try {
        return await app();
      } catch (error) {
        this.handleError(error as Error);
        return this.createFallbackLifecycles();
      }
    };
  }

  private handleError(error: Error): void {
    console.error(`[${this.config.name}] Failed to load:`, error);
    
    if (this.config.onError) {
      this.config.onError(error);
    }

    if (globalThis.sharedServices?.logger) {
      globalThis.sharedServices.logger.error(`MFE Load Error: ${this.config.name}`, {
        error: error.message,
        stack: error.stack
      });
    }
  }

  private createFallbackLifecycles() {
    return {
      bootstrap: () => Promise.resolve(),
      mount: (props: any) => {
        this.container = props.domElement?.() || document.getElementById(`single-spa-application:${this.config.name}`);
        
        if (this.container) {
          this.container.innerHTML = this.config.fallbackUI || this.getDefaultFallbackUI();
        }
        
        return Promise.resolve();
      },
      unmount: () => {
        if (this.container) {
          this.container.innerHTML = '';
        }
        return Promise.resolve();
      }
    };
  }

  private getDefaultFallbackUI(): string {
    return `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; padding: 2rem; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
        <h2 style="color: #ef4444; margin-bottom: 0.5rem;">Failed to Load ${this.config.name}</h2>
        <p style="color: #6b7280; margin-bottom: 1.5rem;">This application is temporarily unavailable.</p>
        <button 
          onclick="window.location.reload()" 
          style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem;">
          Reload Page
        </button>
      </div>
    `;
  }
}
