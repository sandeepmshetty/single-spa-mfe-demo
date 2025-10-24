import React, { useState } from 'react';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const sharedServices = (globalThis as any).sharedServices;

      if (!sharedServices?.supabaseAuthService) {
        throw new Error('Authentication service not available');
      }

      const result = await sharedServices.supabaseAuthService.signUp({
        email: email,
        password: password,
        fullName: fullName,
      });

      if (result.error) {
        // Check for specific Supabase errors
        if (
          result.error.message.includes('anonymous') ||
          result.error.code === 'anonymous_provider_disabled'
        ) {
          setError(
            '⚠️ Email authentication is not enabled in Supabase. Please enable it in your Supabase dashboard: Authentication > Providers > Email'
          );
          console.error('Supabase Configuration Error:', {
            message: 'Email provider is disabled',
            fix: 'Go to https://app.supabase.com/project/YOUR_PROJECT/auth/providers and enable Email authentication',
            quickFix: 'For testing, you can also run enableMockAuth() in the console',
          });
        } else {
          setError(result.error.message);
        }
        sharedServices.captureError?.(result.error);
      } else {
        // Check if email confirmation is required
        const needsEmailConfirmation = result.user && !result.session;

        if (needsEmailConfirmation) {
          setSuccess(
            '✅ Registration successful! Please check your email and click the confirmation link to activate your account. After confirming, you can sign in.'
          );
          console.log('📧 Email confirmation required for:', result.user?.email);
        } else {
          // Auto-confirmed (email confirmation disabled in Supabase)
          // Sign out the user so they must manually log in
          await sharedServices.supabaseAuthService.signOut();
          setSuccess('✅ Registration successful! You can now sign in with your credentials.');
          console.log(
            '✅ Registered (auto-confirmed):',
            result.user?.email,
            '- User signed out, please login manually'
          );
        }

        sharedServices.trackEvent?.('signup_success', {
          method: 'email',
          needsConfirmation: needsEmailConfirmation,
        });

        // Notify other MFEs about registration
        sharedServices.eventBus?.emit({
          type: 'auth:register',
          source: 'react-mfe',
          payload: { user: result.user },
        });

        // Switch to login tab after delay
        setTimeout(() => {
          onSuccess?.();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      (globalThis as any).sharedServices?.captureError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      const sharedServices = (globalThis as any).sharedServices;

      if (!sharedServices?.supabaseAuthService) {
        throw new Error('Authentication service not available');
      }

      await sharedServices.supabaseAuthService.signInWithProvider(provider);
      sharedServices.trackEvent?.('oauth_signup_initiated', { provider });

      // OAuth redirect will happen, so show loading message
      setSuccess(`Redirecting to ${provider}...`);
    } catch (err: any) {
      setError(err.message || `${provider} signup failed`);
      (globalThis as any).sharedServices?.captureError?.(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Create Your Account</h2>

      {error && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '4px',
            border: '1px solid #fcc',
          }}
        >
          {error}
        </div>
      )}

      {success && (
        <div
          style={{
            padding: '12px',
            marginBottom: '16px',
            backgroundColor: '#efe',
            color: '#363',
            borderRadius: '4px',
            border: '1px solid #cfc',
          }}
        >
          {success}
        </div>
      )}

      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="fullName"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="email"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="password"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          <small style={{ color: '#666', fontSize: '12px' }}>At least 8 characters</small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            htmlFor="confirmPassword"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 12px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '500',
            color: 'white',
            backgroundColor: loading ? '#ccc' : '#28a745',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div
        style={{
          textAlign: 'center',
          margin: '24px 0',
          color: '#666',
          fontSize: '14px',
        }}
      >
        or sign up with
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => handleOAuthRegister('google')}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
            />
            <path
              fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            />
            <path
              fill="#FBBC05"
              d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"
            />
            <path
              fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
            />
          </svg>
          Google
        </button>

        <button
          onClick={() => handleOAuthRegister('github')}
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
          GitHub
        </button>
      </div>

      <div style={{ textAlign: 'center', fontSize: '14px' }}>
        <span style={{ color: '#666' }}>Already have an account? </span>
        <button
          onClick={onSwitchToLogin}
          disabled={loading}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: loading ? 'not-allowed' : 'pointer',
            textDecoration: 'underline',
            fontSize: '14px',
            padding: 0,
          }}
        >
          Log in
        </button>
      </div>
    </div>
  );
};
