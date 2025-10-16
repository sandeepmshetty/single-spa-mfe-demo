/**
 * Supabase Client Configuration
 * 
 * Provides a configured Supabase client for database operations and authentication.
 * This client is shared across all micro-frontends.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/**
 * Supabase client instance
 * Use this for all database and auth operations
 */
let _supabase: SupabaseClient | null = null;

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(target, prop) {
    if (!_supabase) {
      // Lazy initialization
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Supabase configuration missing!');
        console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
        throw new Error('Supabase not configured');
      }
      
      _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'X-Client-Info': 'mfe-shared-library',
          },
        },
      });
    }
    return _supabase[prop as keyof SupabaseClient];
  }
});

/**
 * Database Tables Interface
 * Add your table types here for type-safe queries
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      error_logs: {
        Row: {
          id: string;
          user_id: string | null;
          error_message: string;
          stack_trace: string | null;
          component: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          error_message: string;
          stack_trace?: string | null;
          component?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

/**
 * Supabase Helper Functions
 */

/**
 * Check if Supabase is properly configured
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
};

/**
 * Get current user session
 */
export const getCurrentSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Sign out current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, error };
  }
};

// Log configuration status
if (typeof window !== 'undefined') {
  console.log('✅ Supabase client initialized:', {
    url: SUPABASE_URL,
    configured: isSupabaseConfigured(),
  });
}

export default supabase;
