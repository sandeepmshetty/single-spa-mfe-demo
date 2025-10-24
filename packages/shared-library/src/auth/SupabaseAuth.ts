/**
 * Authentication Service using Supabase
 *
 * Provides authentication methods for all micro-frontends
 */

import { supabase } from '../config/supabase';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface IAuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | Error | null;
}

export interface ISignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface ISignInData {
  email: string;
  password: string;
}

/**
 * Authentication Service Class
 */
class SupabaseAuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(data: ISignUpData): Promise<IAuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      // Create user profile in profiles table
      // Commented out for now - profiles table needs to be created in Supabase
      // if (authData.user) {
      //   await this.createUserProfile(authData.user.id, data.email, data.fullName);
      // }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: ISignInData): Promise<IAuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      return {
        user: authData.user,
        session: authData.session,
        error: null,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign in with OAuth provider (Google, GitHub, etc.)
   */
  async signInWithProvider(provider: 'google' | 'github' | 'gitlab' | 'azure') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: globalThis.window?.location.origin,
        },
      });

      if (error) {
        throw error;
      }

      return {
        data,
        error: null,
      };
    } catch (error) {
      console.error('OAuth sign in error:', error);
      return {
        data: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw error;
      }
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        throw error;
      }
      return data.user;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Get current user with session (for AuthStateManager)
   */
  async getCurrentUser(): Promise<IAuthResponse> {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!session) {
        return {
          user: null,
          session: null,
          error: null,
        };
      }

      return {
        user: session.user,
        session,
        error: null,
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Refresh session
   */
  async refreshSession(): Promise<IAuthResponse> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) {
        throw error;
      }

      return {
        user: data.user,
        session: data.session,
        error: null,
      };
    } catch (error) {
      console.error('Refresh session error:', error);
      return {
        user: null,
        session: null,
        error: error as AuthError,
      };
    }
  }

  /**
   * Send password reset email
   */
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: globalThis.window?.location.origin
          ? `${globalThis.window.location.origin}/reset-password`
          : undefined,
      });

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user password
   */
  async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: { fullName?: string; avatarUrl?: string }) {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error('No user logged in');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: updates.fullName,
          avatar_url: updates.avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }

  /**
   * Create user profile in database
   * (Called automatically after sign up)
   */
  private async createUserProfile(userId: string, email: string, fullName?: string) {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        email,
        full_name: fullName || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Create profile error:', error);
      // Don't throw - profile creation failure shouldn't break sign up
    }
  }
}

// Export singleton instance
export const authService = new SupabaseAuthService();

export default authService;
