/**
 * AuthService
 * Centralized authentication service layer
 * Handles all authentication-related business logic
 */
import type {
  LoginCredentials,
  RegisterData,
  AuthResult,
  SupabaseAuthService,
} from '../types';
import { getAuthService, getSharedServices } from '../types/global';

export class AuthService {
  private get supabaseAuth(): SupabaseAuthService | undefined {
    return getAuthService();
  }

  private get sharedServices() {
    return getSharedServices();
  }

  /**
   * Validate authentication service availability
   */
  private ensureServiceAvailable(): SupabaseAuthService {
    const service = this.supabaseAuth;
    if (!service) {
      throw new Error('Authentication service not available');
    }
    return service;
  }

  /**
   * Sign in with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const service = this.ensureServiceAvailable();
      const result = await service.signIn(credentials);

      if (result.error) {
        this.sharedServices?.captureError?.(new Error(result.error.message));
      } else {
        this.sharedServices?.trackEvent?.('login_success', { method: 'email' });
        (this.sharedServices?.eventBus as any)?.emit(
          'auth:login',
          { user: result.user },
          'react-mfe'
        );
      }

      return result;
    } catch (error: any) {
      this.sharedServices?.captureError?.(error);
      return {
        user: null,
        error: { message: error.message || 'Login failed' },
      };
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    try {
      const service = this.ensureServiceAvailable();

      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return {
          user: null,
          error: { message: 'Passwords do not match' },
        };
      }

      // Validate password strength
      if (data.password.length < 8) {
        return {
          user: null,
          error: { message: 'Password must be at least 8 characters long' },
        };
      }

      const result = await service.signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (result.error) {
        this.sharedServices?.captureError?.(new Error(result.error.message));
      } else {
        const needsEmailConfirmation = result.user && !result.session;

        this.sharedServices?.trackEvent?.('signup_success', {
          method: 'email',
          needsConfirmation: needsEmailConfirmation,
        });

        (this.sharedServices?.eventBus as any)?.emit(
          'auth:register',
          { user: result.user },
          'react-mfe'
        );

        // If auto-confirmed, sign out so user must manually log in
        if (!needsEmailConfirmation) {
          await service.signOut();
        }
      }

      return result;
    } catch (error: any) {
      this.sharedServices?.captureError?.(error);
      return {
        user: null,
        error: { message: error.message || 'Registration failed' },
      };
    }
  }

  /**
   * Sign in with OAuth provider
   */
  async loginWithOAuth(provider: 'google' | 'github'): Promise<void> {
    try {
      const service = this.ensureServiceAvailable();
      await service.signInWithProvider(provider);
      this.sharedServices?.trackEvent?.('oauth_initiated', { provider });
    } catch (error: any) {
      this.sharedServices?.captureError?.(error);
      throw error;
    }
  }

  /**
   * Sign out current user
   */
  async logout(): Promise<{ success: boolean; error?: any }> {
    try {
      const service = this.ensureServiceAvailable();
      const result = await service.signOut();

      if (!result.error) {
        this.sharedServices?.trackEvent?.('logout_success');
        (this.sharedServices?.eventBus as any)?.emit(
          'auth:logout',
          {},
          'react-mfe'
        );
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch (error: any) {
      this.sharedServices?.captureError?.(error);
      return { success: false, error };
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthResult> {
    try {
      const service = this.ensureServiceAvailable();
      return await service.getCurrentUser();
    } catch (error: any) {
      this.sharedServices?.captureError?.(error);
      return {
        user: null,
        error: { message: error.message || 'Failed to get current user' },
      };
    }
  }

  /**
   * Parse and format authentication errors
   */
  parseError(error: any): string {
    if (error.message.includes('anonymous') || error.code === 'anonymous_provider_disabled') {
      return '⚠️ Email authentication is not enabled in Supabase. Please enable it in your dashboard.';
    }

    if (error.message.includes('Invalid login credentials')) {
      return '❌ Invalid email or password. Please check your credentials.';
    }

    if (error.message.includes('Email not confirmed')) {
      return '📧 Please check your email and click the confirmation link before signing in.';
    }

    if (error.message.includes('User already registered')) {
      return '⚠️ An account with this email already exists. Please sign in instead.';
    }

    return error.message || 'An unexpected error occurred';
  }
}

// Export singleton instance
export const authService = new AuthService();
