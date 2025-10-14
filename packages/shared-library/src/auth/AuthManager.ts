/**
 * Centralized authentication manager for all MFEs
 */
import { IAuthState, IUser } from '../types';

type AuthListener = (state: IAuthState) => void;

class AuthManager {
  private state: IAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    expiresAt: null
  };
  private listeners: AuthListener[] = [];
  private readonly TOKEN_KEY = 'mfe_auth_token';
  private readonly USER_KEY = 'mfe_user';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    // Mock authentication - replace with real API call
    const mockUser: IUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      roles: ['user'],
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true,
        timezone: 'UTC'
      }
    };
    const mockToken = `mock_token_${Date.now()}`;
    const mockRefreshToken = `mock_refresh_${Date.now()}`;

    this.setState({
      isAuthenticated: true,
      user: mockUser,
      token: mockToken,
      refreshToken: mockRefreshToken,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000)
    });

    this.saveToStorage();
    return true;
  }

  async logout(): Promise<void> {
    this.setState({
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      expiresAt: null
    });
    this.clearStorage();
  }

  getState(): IAuthState {
    return { ...this.state };
  }

  getToken(): string | null {
    return this.state.token;
  }

  getUser(): IUser | null {
    return this.state.user;
  }

  isAuthenticated(): boolean {
    return this.state.isAuthenticated;
  }

  hasRole(role: string): boolean {
    return this.state.user?.roles.includes(role) ?? false;
  }

  hasAnyRole(roles: string[]): boolean {
    if (!this.state.user) {
      return false;
    }
    return roles.some(role => this.hasRole(role));
  }

  subscribe(listener: AuthListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private setState(newState: IAuthState): void {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.getState());
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      if (this.state.token) {
        localStorage.setItem(this.TOKEN_KEY, this.state.token);
      }
      if (this.state.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(this.state.user));
      }
    } catch (e) {
      console.error('Failed to save auth state:', e);
    }
  }

  private loadFromStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const userStr = localStorage.getItem(this.USER_KEY);
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        this.state = {
          isAuthenticated: true,
          user,
          token,
          refreshToken: null,
          expiresAt: null
        };
      }
    } catch (e) {
      console.error('Failed to load auth state:', e);
      this.clearStorage();
    }
  }

  private clearStorage(): void {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (e) {
      console.error('Failed to clear auth storage:', e);
    }
  }
}

export const authManager = new AuthManager();
