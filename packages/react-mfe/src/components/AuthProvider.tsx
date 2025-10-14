import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authManager, type IAuthState } from '@single-spa-demo/shared-library';

interface IAuthContext {
  isAuthenticated: boolean;
  user: IAuthState['user'];
  token: IAuthState['token'];
  refreshToken: IAuthState['refreshToken'];
  expiresAt: IAuthState['expiresAt'];
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<IAuthState>(() => authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe((state: IAuthState) => setAuthState(state));
    return unsubscribe;
  }, []);

  const contextValue: IAuthContext = {
    ...authState,
    hasRole: (role: string) => authManager.hasRole(role),
    hasAnyRole: (roles: string[]) => authManager.hasAnyRole(roles),
    login: (email: string, password: string) => authManager.login(email, password),
    logout: () => authManager.logout()
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
