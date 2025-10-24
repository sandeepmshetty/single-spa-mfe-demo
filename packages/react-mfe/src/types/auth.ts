/**
 * Authentication Type Definitions
 * Types specific to authentication flows
 */
import type { User, Session } from '@supabase/supabase-js';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export type OAuthProvider = 'google' | 'github';

export interface AuthFormState {
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface UseAuthReturn {
  user: any;
  session: any;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  logout: () => Promise<{ success: boolean; error?: any }>;
  refresh: () => Promise<void>;
}

// Supabase Auth types
export interface AuthResult {
  user: User | null;
  session?: Session | null;
  error?: {
    message: string;
    code?: string;
  } | null;
}

export interface SupabaseAuthService {
  signUp: (data: {
    email: string;
    password: string;
    fullName?: string;
  }) => Promise<AuthResult>;
  signIn: (credentials: { email: string; password: string }) => Promise<AuthResult>;
  signInWithProvider: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<{ error: Error | null }>;
  getCurrentUser: () => Promise<AuthResult>;
  onAuthStateChange: (callback: (state: any) => void) => { unsubscribe: () => void };
}
