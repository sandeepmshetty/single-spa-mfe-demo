import { BehaviorSubject } from 'rxjs';
import { IAuthState, IUser } from './types';
import { STORAGE_KEYS, EVENT_TYPES, API_ENDPOINTS } from './constants';
import { eventBus } from './event-bus';
import { storageService } from './storage-service';
import { apiClient } from './api-client';

/**
 * Centralized authentication service for all micro-frontends
 */
export class AuthService {
  private authState$ = new BehaviorSubject<IAuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null
  });

  constructor() {
    this.initializeAuth();
    this.setupTokenRefresh();
  }

  /**
   * Get current authentication state
   */
  getAuthState(): IAuthState {
    return this.authState$.value;
  }

  /**
   * Subscribe to authentication state changes
   */
  onAuthChange(callback: (state: IAuthState) => void): () => void {
    const subscription = this.authState$.subscribe(callback);
    return () => subscription.unsubscribe();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const state = this.authState$.value;
    return state.isAuthenticated && !!state.token && !this.isTokenExpired();
  }

  /**
   * Get current user
   */
  getCurrentUser(): IUser | null {
    return this.authState$.value.user;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    return this.authState$.value.token;
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<boolean> {
    try {
      // Mock authentication - replace with real API call
      const response = await this.mockLogin(email, password);
      
      if (response.success) {
        const authState: IAuthState = {
          isAuthenticated: true,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };

        this.updateAuthState(authState);
        this.persistAuthState(authState);
        
        eventBus.emit(EVENT_TYPES.AUTH_LOGIN, { user: response.user });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      eventBus.emit(EVENT_TYPES.AUTH_ERROR, { error: 'Login failed' });
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Call logout API if needed
      // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
      
      const clearedState: IAuthState = {
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        expiresAt: null
      };

      this.updateAuthState(clearedState);
      this.clearPersistedAuth();
      
      eventBus.emit(EVENT_TYPES.AUTH_LOGOUT, {});
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const currentState = this.authState$.value;
      if (!currentState.refreshToken) {
        return false;
      }

      // Mock token refresh - replace with real API call
      const response = await this.mockTokenRefresh(currentState.refreshToken);
      
      if (response.success) {
        const updatedState: IAuthState = {
          ...currentState,
          token: response.token,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000)
        };

        this.updateAuthState(updatedState);
        this.persistAuthState(updatedState);
        
        eventBus.emit(EVENT_TYPES.AUTH_TOKEN_REFRESH, { token: response.token });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      eventBus.emit(EVENT_TYPES.AUTH_ERROR, { error: 'Token refresh failed' });
      return false;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<IUser>): Promise<boolean> {
    try {
      const currentState = this.authState$.value;
      if (!currentState.user) {
        return false;
      }

      // Mock profile update - replace with real API call
      const updatedUser = { ...currentState.user, ...userData };
      
      const updatedState: IAuthState = {
        ...currentState,
        user: updatedUser
      };

      this.updateAuthState(updatedState);
      this.persistAuthState(updatedState);
      
      eventBus.emit(EVENT_TYPES.USER_PROFILE_UPDATE, { user: updatedUser });
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    }
  }

  /**
   * Initialize authentication from stored data
   */
  private initializeAuth(): void {
    try {
      const token = storageService.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = storageService.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const userData = storageService.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData && !this.isTokenExpired(token)) {
        const authState: IAuthState = {
          isAuthenticated: true,
          user: JSON.parse(userData),
          token,
          refreshToken,
          expiresAt: this.getTokenExpiry(token)
        };

        this.updateAuthState(authState);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      this.clearPersistedAuth();
    }
  }

  /**
   * Set up automatic token refresh
   */
  private setupTokenRefresh(): void {
    setInterval(() => {
      const state = this.authState$.value;
      if (state.isAuthenticated && state.token && state.expiresAt) {
        const timeUntilExpiry = state.expiresAt - Date.now();
        // Refresh token when 5 minutes left
        if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
          this.refreshToken();
        }
      }
    }, 60 * 1000); // Check every minute
  }

  /**
   * Update authentication state and notify subscribers
   */
  private updateAuthState(state: IAuthState): void {
    this.authState$.next(state);
  }

  /**
   * Persist authentication state to storage
   */
  private persistAuthState(state: IAuthState): void {
    if (state.token) {
      storageService.setItem(STORAGE_KEYS.AUTH_TOKEN, state.token);
    }
    if (state.refreshToken) {
      storageService.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
    }
    if (state.user) {
      storageService.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(state.user));
    }
  }

  /**
   * Clear persisted authentication data
   */
  private clearPersistedAuth(): void {
    storageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storageService.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    storageService.removeItem(STORAGE_KEYS.USER_DATA);
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token?: string): boolean {
    const currentToken = token || this.authState$.value.token;
    if (!currentToken) {
      return true;
    }

    const expiry = this.getTokenExpiry(currentToken);
    return expiry ? Date.now() > expiry : false;
  }

  /**
   * Get token expiry time
   */
  private getTokenExpiry(token: string): number | null {
    try {
      // In a real app, decode JWT token to get expiry
      // For mock, return 24 hours from now
      return Date.now() + (24 * 60 * 60 * 1000);
    } catch {
      return null;
    }
  }

  /**
   * Mock login implementation - replace with real API call
   */
  private async mockLogin(email: string, password: string): Promise<any> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful login
    return {
      success: true,
      user: {
        id: '1',
        name: 'John Doe',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        roles: ['user'],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true,
          timezone: 'UTC'
        }
      },
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now()
    };
  }

  /**
   * Mock token refresh implementation
   */
  private async mockTokenRefresh(refreshToken: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      token: 'mock-refreshed-jwt-token-' + Date.now()
    };
  }
}

// Create and export singleton instance
export const authService = new AuthService();