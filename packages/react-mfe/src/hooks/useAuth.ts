import { useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';

// Import types from global sharedServices
type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
};

// Get services from global sharedServices
const getAuthStateManager = () => (globalThis as any).sharedServices?.authStateManager;
const getAuthService = () => (globalThis as any).sharedServices?.supabaseAuthService;

/**
 * React hook for authentication state management
 * 
 * Subscribes to centralized AuthStateManager and provides:
 * - Current user and session
 * - Loading state
 * - Authentication status
 * - Login/logout/refresh methods
 * 
 * Usage:
 * ```tsx
 * const { user, isAuthenticated, loading, login, logout } = useAuth();
 * 
 * if (loading) return <div>Loading...</div>;
 * if (!isAuthenticated) return <LoginForm />;
 * return <Dashboard user={user} />;
 * ```
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  // Subscribe to auth state changes with retry mechanism
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let retryCount = 0;
    const maxRetries = 20; // 20 retries = 2 seconds max wait
    
    const trySubscribe = () => {
      const authStateManager = getAuthStateManager();
      
      if (!authStateManager) {
        retryCount++;
        
        if (retryCount >= maxRetries) {
          console.error('⚠️ AuthStateManager not available after retries');
          console.log('Available sharedServices:', Object.keys((globalThis as any).sharedServices || {}));
          setAuthState(prev => ({ ...prev, loading: false }));
          return;
        }
        
        // Retry after 100ms
        console.log(`⏳ Waiting for AuthStateManager... (attempt ${retryCount}/${maxRetries})`);
        setTimeout(trySubscribe, 100);
        return;
      }

      console.log('✅ useAuth: AuthStateManager found, subscribing...');

      // Subscribe to state changes
      unsubscribe = authStateManager.subscribe((newState: AuthState) => {
        console.log('🔄 useAuth: Auth state updated:', { isAuthenticated: newState.isAuthenticated, user: newState.user?.email });
        setAuthState(newState);
      });
    };

    // Start subscription attempt
    trySubscribe();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Login method
  const login = useCallback(async (email: string, password: string) => {
    try {
      const authService = getAuthService();
      if (!authService) {
        throw new Error('Auth service not available');
      }

      const result = await authService.signIn({ email, password });
      
      if (result?.error) {
        throw result.error;
      }

      return { success: true, user: result?.user };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error };
    }
  }, []);

  // Logout method
  const logout = useCallback(async () => {
    try {
      const authService = getAuthService();
      if (!authService) {
        throw new Error('Auth service not available');
      }

      await authService.signOut();
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, error };
    }
  }, []);

  // Refresh session method
  const refresh = useCallback(async () => {
    try {
      const authStateManager = getAuthStateManager();
      if (!authStateManager) {
        throw new Error('AuthStateManager not available');
      }

      await authStateManager.refresh();
      return { success: true };
    } catch (error) {
      console.error('Refresh failed:', error);
      return { success: false, error };
    }
  }, []);

  // Get user (async)
  const getUser = useCallback(async (): Promise<User | null> => {
    const authStateManager = getAuthStateManager();
    if (!authStateManager) return null;
    return authStateManager.getUser();
  }, []);

  // Get session (async)
  const getSession = useCallback(async (): Promise<Session | null> => {
    const authStateManager = getAuthStateManager();
    if (!authStateManager) return null;
    return authStateManager.getSession();
  }, []);

  return {
    // State
    user: authState.user,
    session: authState.session,
    loading: authState.loading,
    isAuthenticated: authState.isAuthenticated,
    
    // Methods
    login,
    logout,
    refresh,
    getUser,
    getSession,
  };
}

export default useAuth;
