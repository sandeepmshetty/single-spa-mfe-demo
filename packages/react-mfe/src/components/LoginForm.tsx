import React, { useState } from 'react';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sharedServices = (window as any).sharedServices;

      if (!sharedServices?.supabaseAuthService) {
        throw new Error('Authentication service not available');
      }

      const result = await sharedServices.supabaseAuthService.signIn({
        email: email,
        password: password,
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
        } else if (result.error.message.includes('Invalid login credentials')) {
          setError(
            '❌ Invalid email or password. If you just signed up, please check your email and confirm your account first.'
          );
        } else if (result.error.message.includes('Email not confirmed')) {
          setError('📧 Please check your email and click the confirmation link before signing in.');
        } else {
          setError(result.error.message);
        }
        sharedServices.captureError?.(result.error);
      } else {
        setSuccess('✅ Login successful!');
        sharedServices.trackEvent?.('login_success', { method: 'email' });
        console.log('✅ Logged in:', result.user?.email);

        // Notify other MFEs about login
        sharedServices.eventBus?.emit({
          type: 'auth:login',
          source: 'react-mfe',
          payload: { user: result.user },
        });

        // Call success callback after a brief delay
        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      (window as any).sharedServices?.captureError?.(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      const sharedServices = (window as any).sharedServices;

      if (!sharedServices?.supabaseAuthService) {
        throw new Error('Authentication service not available');
      }

      await sharedServices.supabaseAuthService.signInWithProvider(provider);
      sharedServices.trackEvent?.('oauth_initiated', { provider });

      // OAuth redirect will happen, so show loading message
      setSuccess(`Redirecting to ${provider}...`);
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
      (window as any).sharedServices?.captureError?.(err);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Login to Your Account</h2>

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

      <form onSubmit={handleEmailLogin}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Email Address
          </label>
          <input
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

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
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
          <small style={{ color: '#666', fontSize: '12px' }}>At least 6 characters</small>
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
            backgroundColor: loading ? '#ccc' : '#007bff',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px',
          }}
        >
          {loading ? 'Logging in...' : 'Login with Email'}
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
        or continue with
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => handleOAuthLogin('google')}
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
          onClick={() => handleOAuthLogin('github')}
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
        <span style={{ color: '#666' }}>Don't have an account? </span>
        <button
          onClick={onSwitchToRegister}
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
          Sign up
        </button>
      </div>
    </div>
  );
};
