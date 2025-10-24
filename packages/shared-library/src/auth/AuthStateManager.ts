import type { User, Session } from '@supabase/supabase-js';
import type { EventBus } from '../event-bus';

export interface IAuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export type AuthStateChangeCallback = (state: IAuthState) => void;

/**
 * Centralized authentication state manager for cross-MFE session management.
 *
 * Features:
 * - Single source of truth for auth state across all MFEs
 * - Session persistence via Supabase localStorage
 * - Automatic token refresh
 * - Cross-MFE state synchronization via EventBus
 * - Typed callbacks for auth state changes
 *
 * Usage:
 * ```typescript
 * const authManager = new AuthStateManager(supabaseAuth, eventBus);
 *
 * // Subscribe to auth changes
 * const unsubscribe = authManager.subscribe((state) => {
 *   console.log('Auth state:', state);
 * });
 *
 * // Get current state
 * const currentState = authManager.getState();
 * ```
 */
export class AuthStateManager {
  private state: IAuthState = {
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  };

  private readonly subscribers = new Set<AuthStateChangeCallback>();
  private readonly supabaseAuthService: any; // Will be properly typed
  private readonly eventBus?: EventBus;
  private refreshTimer?: NodeJS.Timeout;
  private isInitialized = false;

  constructor(supabaseAuthService: any, eventBus?: EventBus) {
    this.supabaseAuthService = supabaseAuthService;
    this.eventBus = eventBus;
  }

  /**
   * Initialize auth state manager - restore session and setup listeners
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.warn('AuthStateManager already initialized');
      return;
    }

    // eslint-disable-next-line no-console
    console.log('🔐 Initializing AuthStateManager...');

    try {
      // Restore session from localStorage
      await this.restoreSession();

      // Setup Supabase auth state listener
      this.setupAuthStateListener();

      // Setup cross-MFE event listeners
      this.setupEventBusListeners();

      // Setup automatic token refresh
      this.setupTokenRefresh();

      this.isInitialized = true;
      // eslint-disable-next-line no-console
      console.log('✅ AuthStateManager initialized');
    } catch (error) {
      console.error('❌ Failed to initialize AuthStateManager:', error);
      this.updateState({ loading: false });
    }
  }

  /**
   * Restore session from localStorage/cookies
   */
  private async restoreSession(): Promise<void> {
    try {
      const result = await this.supabaseAuthService.getCurrentUser();

      if (result.user && result.session) {
        this.updateState({
          user: result.user,
          session: result.session,
          loading: false,
          isAuthenticated: true,
        });

        console.log('✅ Session restored:', result.user.email);

        // Notify other MFEs
        this.emitAuthEvent('auth:session_restored', { user: result.user });
      } else {
        this.updateState({ loading: false });
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.updateState({ loading: false });
    }
  }

  /**
   * Setup listener for Supabase auth state changes
   */
  private setupAuthStateListener(): void {
    if (!this.supabaseAuthService.onAuthStateChange) {
      console.warn('SupabaseAuth does not support onAuthStateChange');
      return;
    }

    this.supabaseAuthService.onAuthStateChange((event: string, session: Session | null) => {
      console.log('🔐 Auth state changed:', event, session?.user?.email);

      switch (event) {
        case 'INITIAL_SESSION':
          // Session restored on page load
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            isAuthenticated: !!session,
          });
          break;

        case 'SIGNED_IN':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            isAuthenticated: !!session,
          });
          this.emitAuthEvent('auth:login', { user: session?.user });
          break;

        case 'SIGNED_OUT':
          this.updateState({
            user: null,
            session: null,
            loading: false,
            isAuthenticated: false,
          });
          this.emitAuthEvent('auth:logout', {});
          this.clearRefreshTimer();
          break;

        case 'TOKEN_REFRESHED':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            isAuthenticated: !!session,
          });
          console.log('✅ Token refreshed successfully');
          break;

        case 'USER_UPDATED':
          this.updateState({
            user: session?.user || null,
            session,
            loading: false,
            isAuthenticated: !!session,
          });
          this.emitAuthEvent('auth:user_updated', { user: session?.user });
          break;

        default:
          console.log('Unhandled auth event:', event);
      }
    });
  }

  /**
   * Setup cross-MFE event listeners
   */
  private setupEventBusListeners(): void {
    if (!this.eventBus) {
      console.warn('EventBus not provided, cross-MFE sync disabled');
      return;
    }

    // Listen for login events from other MFEs
    this.eventBus.on('auth:login', (payload: any) => {
      if (payload.source !== 'auth-state-manager') {
        console.log('🔄 Login event from', payload.source);
        // State will be updated by Supabase listener
      }
    });

    // Listen for logout events from other MFEs
    this.eventBus.on('auth:logout', (payload: any) => {
      if (payload.source !== 'auth-state-manager') {
        console.log('🔄 Logout event from', payload.source);
        this.handleLogout();
      }
    });
  }

  /**
   * Setup automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (!this.state.session) {
      return;
    }

    const expiresAt = this.state.session.expires_at;
    if (!expiresAt) {
      return;
    }

    // Refresh 5 minutes before expiry
    const refreshTime = expiresAt * 1000 - Date.now() - 5 * 60 * 1000;

    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        console.log('🔄 Auto-refreshing token...');
        try {
          await this.supabaseAuthService.refreshSession();
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          // Session will be cleared by auth state listener
        }
      }, refreshTime);
    }
  }

  /**
   * Clear token refresh timer
   */
  private clearRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  /**
   * Handle logout (called from event bus)
   */
  private async handleLogout(): Promise<void> {
    try {
      await this.supabaseAuthService.signOut();
      // State will be updated by auth state listener
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  /**
   * Update internal state and notify subscribers
   */
  private updateState(updates: Partial<IAuthState>): void {
    const prevState = this.state;
    this.state = { ...this.state, ...updates };

    // Notify all subscribers
    for (const callback of this.subscribers) {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Subscriber callback error:', error);
      }
    }

    // Setup refresh timer if session changed
    if (updates.session && updates.session !== prevState.session) {
      this.clearRefreshTimer();
      this.setupTokenRefresh();
    }
  }

  /**
   * Emit auth event via EventBus
   */
  private emitAuthEvent(type: string, payload: any): void {
    if (!this.eventBus) {
      return;
    }

    this.eventBus.emit(type as any, payload, 'auth-state-manager');
  }

  /**
   * Get current auth state (synchronous)
   */
  getState(): IAuthState {
    return { ...this.state };
  }

  /**
   * Subscribe to auth state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: AuthStateChangeCallback): () => void {
    this.subscribers.add(callback);

    // Immediately call with current state
    callback(this.state);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get user (async, ensures session is valid)
   */
  async getUser(): Promise<User | null> {
    if (this.state.loading) {
      await this.waitForInitialization();
    }
    return this.state.user;
  }

  /**
   * Get session (async, ensures session is valid)
   */
  async getSession(): Promise<Session | null> {
    if (this.state.loading) {
      await this.waitForInitialization();
    }
    return this.state.session;
  }

  /**
   * Wait for initialization to complete
   */
  private async waitForInitialization(): Promise<void> {
    return new Promise(resolve => {
      if (!this.state.loading) {
        resolve();
        return;
      }

      const unsubscribe = this.subscribe(state => {
        if (!state.loading) {
          unsubscribe();
          resolve();
        }
      });

      // Timeout after 10 seconds
      setTimeout(() => {
        unsubscribe();
        resolve();
      }, 10000);
    });
  }

  /**
   * Manually refresh session
   */
  async refresh(): Promise<void> {
    try {
      await this.supabaseAuthService.refreshSession();
    } catch (error) {
      console.error('Manual refresh failed:', error);
      throw error;
    }
  }

  /**
   * Cleanup - call when app unmounts
   */
  destroy(): void {
    this.clearRefreshTimer();
    this.subscribers.clear();
    this.isInitialized = false;
    console.log('🔐 AuthStateManager destroyed');
  }
}
