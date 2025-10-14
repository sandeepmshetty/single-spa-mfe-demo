declare module '@single-spa-demo/shared-library' {
  export interface IUser {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    roles: string[];
    preferences: any;
  }

  export interface IAuthState {
    isAuthenticated: boolean;
    user: IUser | null;
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
  }

  export interface IErrorLog {
    id: string;
    message: string;
    stack?: string;
    level: 'error' | 'warn' | 'info';
    timestamp: string;
    source: string;
    metadata?: any;
  }

  export const authManager: {
    getState(): IAuthState;
    subscribe(callback: (state: IAuthState) => void): () => void;
    hasRole(role: string): boolean;
    hasAnyRole(roles: string[]): boolean;
    login(email: string, password: string): Promise<boolean>;
    logout(): Promise<void>;
  };

  export const errorLogger: {
    logError(error: Error, source?: string, level?: string, metadata?: any): Promise<void>;
  };

  export const performanceMonitor: {
    init(mfeName: string): void;
    cleanup(): void;
  };
}
