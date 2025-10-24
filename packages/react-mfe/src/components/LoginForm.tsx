import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Input, Alert, Card } from './common';
import { OAuthButtons } from './auth/OAuthButtons';
import { useAuthForm } from '../hooks/useAuthForm';
import { getAuthService, getSharedServices } from '../types/global';
import type { LoginCredentials } from '../types';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: ${theme.spacing.lg};
`;

const Title = styled.h2`
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.textPrimary};
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FooterText = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.lg};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

const TextButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  font-size: ${theme.fontSize.sm};
  padding: 0;
  transition: color ${theme.transitions.fast};

  &:hover:not(:disabled) {
    color: ${theme.colors.primaryHover};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const { loading, error, success, setLoading, setError, setSuccess } = useAuthForm();

  const handleChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const authService = getAuthService();
      const sharedServices = getSharedServices();

      if (!authService) {
        throw new Error('Authentication service not available');
      }

      const result = await authService.signIn(credentials);

      if (result.error) {
        if (
          result.error.message.includes('anonymous') ||
          result.error.code === 'anonymous_provider_disabled'
        ) {
          setError(' Email authentication is not enabled in Supabase.');
        } else if (result.error.message.includes('Invalid login credentials')) {
          setError(' Invalid email or password.');
        } else if (result.error.message.includes('Email not confirmed')) {
          setError(' Please check your email.');
        } else {
          setError(result.error.message);
        }
        sharedServices?.captureError?.(new Error(result.error.message));
      } else {
        setSuccess(' Login successful!');
        sharedServices?.trackEvent?.('login_success', { method: 'email' });

        (sharedServices?.eventBus as any)?.emit(
          'auth:login',
          { user: result.user },
          'react-mfe'
        );

        setTimeout(() => {
          onSuccess?.();
        }, 1000);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed.');
      getSharedServices()?.captureError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Card>
        <Title>Login to Your Account</Title>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleEmailLogin}>
          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={credentials.email}
            onChange={handleChange('email')}
            required
            disabled={loading}
            autoComplete="email"
          />

          <Input
            type="password"
            label="Password"
            placeholder=""
            value={credentials.password}
            onChange={handleChange('password')}
            required
            minLength={6}
            disabled={loading}
            autoComplete="current-password"
            helperText="At least 6 characters"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Login with Email
          </Button>
        </Form>

        <OAuthButtons
          providers={['google', 'github']}
          onError={setError}
          onSuccess={setSuccess}
          disabled={loading}
        />

        <FooterText>
          Don't have an account?{' '}
          <TextButton onClick={onSwitchToRegister} disabled={loading} type="button">
            Sign up
          </TextButton>
        </FooterText>
      </Card>
    </FormContainer>
  );
};
