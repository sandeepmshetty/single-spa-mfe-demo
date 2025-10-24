/**
 * Auth guard for protecting routes across MFEs
 */
import { authManager } from './AuthManager';

export interface IAuthGuardConfig {
  requiredRoles?: string[];
  redirectTo?: string;
  onUnauthorized?: () => void;
}

export class AuthGuard {
  /**
   * Check if user can access route
   */
  canActivate(config: IAuthGuardConfig = {}): boolean {
    const authState = authManager.getState();

    if (!authState.isAuthenticated) {
      this.handleUnauthorized(config);
      return false;
    }

    if (config.requiredRoles && config.requiredRoles.length > 0) {
      const hasRole = authManager.hasAnyRole(config.requiredRoles);
      if (!hasRole) {
        this.handleUnauthorized(config);
        return false;
      }
    }

    return true;
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(config: IAuthGuardConfig): void {
    if (config.onUnauthorized) {
      config.onUnauthorized();
    } else if (config.redirectTo) {
      if (globalThis.window !== undefined) {
        globalThis.window.location.href = config.redirectTo;
      }
    }
  }
}

export const authGuard = new AuthGuard();
