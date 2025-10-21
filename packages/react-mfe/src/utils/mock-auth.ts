/**
 * Mock Authentication Service
 * Use this for testing when Supabase email auth is not configured
 */

interface MockUser {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    full_name?: string;
  };
}

class MockAuthService {
  private users: Map<string, { email: string; password: string; user: MockUser }> = new Map();
  private currentUser: MockUser | null = null;

  async signUp(email: string, password: string, options?: any) {
    console.log('🔨 Mock: Signing up user:', email);
    
    // Check if user already exists
    if (this.users.has(email)) {
      return {
        data: { user: null },
        error: { message: 'User already registered' }
      };
    }

    // Create mock user
    const user: MockUser = {
      id: `mock-${Date.now()}`,
      email,
      created_at: new Date().toISOString(),
      user_metadata: {
        full_name: options?.data?.full_name || ''
      }
    };

    // Store user
    this.users.set(email, { email, password, user });
    this.currentUser = user;
    localStorage.setItem('mock_auth_user', JSON.stringify(user));

    return {
      data: { user },
      error: null
    };
  }

  async signIn(email: string, password: string) {
    console.log('🔨 Mock: Signing in user:', email);
    
    const userData = this.users.get(email);
    
    if (!userData) {
      return {
        data: { user: null },
        error: { message: 'Invalid login credentials' }
      };
    }

    if (userData.password !== password) {
      return {
        data: { user: null },
        error: { message: 'Invalid login credentials' }
      };
    }

    this.currentUser = userData.user;
    localStorage.setItem('mock_auth_user', JSON.stringify(userData.user));

    return {
      data: { user: userData.user },
      error: null
    };
  }

  async signOut() {
    console.log('🔨 Mock: Signing out');
    this.currentUser = null;
    localStorage.removeItem('mock_auth_user');

    return {
      error: null
    };
  }

  async getCurrentUser() {
    const stored = localStorage.getItem('mock_auth_user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }

    return {
      data: { user: this.currentUser },
      error: null
    };
  }

  async signInWithProvider(provider: 'google' | 'github') {
    console.log('🔨 Mock: OAuth not implemented in mock mode');
    throw new Error('OAuth requires real Supabase configuration');
  }
}

export const mockAuthService = new MockAuthService();

// Export helper to enable mock mode
export const enableMockAuth = () => {
  console.warn('⚠️  MOCK AUTH MODE ENABLED - For testing only!');
  console.log('To use real Supabase, enable Email auth in your Supabase dashboard');
  
  const sharedServices = (globalThis as any).sharedServices;
  if (sharedServices) {
    // Replace real service with mock
    sharedServices.supabaseAuthService = mockAuthService;
    console.log('✅ Mock auth service activated');
  }
};

// Make it globally available
if (typeof globalThis !== 'undefined') {
  (globalThis as any).enableMockAuth = enableMockAuth;
  (globalThis as any).mockAuthService = mockAuthService;
}
