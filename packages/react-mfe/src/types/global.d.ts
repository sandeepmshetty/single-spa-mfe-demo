/**
 * Global Type Definitions
 * Type definitions for window.sharedServices and global objects
 */
import type { User, Session } from '@supabase/supabase-js';

// Auth types
export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export interface AuthResult {
  user: User | null;
  session?: Session | null;
  error?: {
    message: string;
    code?: string;
  } | null;
}

// Service interfaces
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
  onAuthStateChange: (callback: (state: AuthState) => void) => { unsubscribe: () => void };
}

export interface AuthStateManager {
  subscribe: (callback: (state: AuthState) => void) => () => void;
  getState: () => AuthState;
  setState: (state: Partial<AuthState>) => void;
}

export interface CounterActions {
  getValue: () => number;
  increment: (source: string) => void;
  decrement: (source: string) => void;
  reset: (source: string) => void;
  subscribe: (callback: (value: number) => void) => () => void;
}

export interface EventBusPayload {
  type: string;
  source: string;
  payload?: any;
}

export interface EventBus {
  emit: (payload: EventBusPayload) => void;
  on: (eventType: string, handler: (payload: EventBusPayload) => void) => () => void;
  onAll: (handler: (payload: EventBusPayload) => void) => () => void;
  off: (eventType: string, handler: (payload: EventBusPayload) => void) => void;
}

export interface SharedServices {
  supabaseAuthService?: SupabaseAuthService;
  authStateManager?: AuthStateManager;
  counterActions?: CounterActions;
  eventBus?: EventBus;
  captureError?: (error: Error, context?: any) => void;
  trackEvent?: (event: string, data?: any) => void;
}

// Extend global Window interface
declare global {
  interface Window {
    sharedServices?: SharedServices;
  }
}

// Helper to access shared services with type safety
export const getSharedServices = (): SharedServices => {
  return window.sharedServices || {};
};

export const getAuthService = (): SupabaseAuthService | undefined => {
  return window.sharedServices?.supabaseAuthService;
};

export const getAuthStateManager = (): AuthStateManager | undefined => {
  return window.sharedServices?.authStateManager;
};

export const getEventBus = (): EventBus | undefined => {
  return window.sharedServices?.eventBus;
};

export const getCounterActions = (): CounterActions | undefined => {
  return window.sharedServices?.counterActions;
};
