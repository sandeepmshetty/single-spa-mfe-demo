declare module '@single-spa-demo/shared-library' {
  export const performanceMonitor: {
    init(mfeName: string): void;
    cleanup(): void;
  };

  export const errorLogger: {
    logError(error: Error, source?: string, level?: string, metadata?: any): Promise<void>;
  };
}
