import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { Button, Input, Alert, Card } from './common';
import { OAuthButtons } from './auth/OAuthButtons';
import { useAuthForm } from '../hooks/useAuthForm';
import { getAuthService, getSharedServices } from '../types/global';
import type { RegisterData } from '../types';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
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

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const { loading, error, success, setLoading, setError, setSuccess } = useAuthForm();

  const handleChange = (field: keyof RegisterData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const authService = getAuthService();
      const sharedServices = getSharedServices();

      if (!authService) {
        throw new Error('Authentication service not available');
      }

      const result = await authService.signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
      });

      if (result.error) {
        if (
          result.error.message.includes('anonymous') ||
          result.error.code === 'anonymous_provider_disabled'
        ) {
          setError(' Email authentication is not enabled in Supabase.');
        } else {
          setError(result.error.message);
        }
        sharedServices?.captureError?.(new Error(result.error.message));
      } else {
        const needsEmailConfirmation = result.user && !result.session;

        if (needsEmailConfirmation) {
          setSuccess(
            ' Registration successful! Please check your email and click the confirmation link.'
          );
        } else {
          await authService.signOut();
          setSuccess(' Registration successful! You can now sign in.');
        }

        sharedServices?.trackEvent?.('signup_success', {
          method: 'email',
          needsConfirmation: needsEmailConfirmation,
        });

        (sharedServices?.eventBus as any)?.emit(
          'auth:register',
          { user: result.user },
          'react-mfe'
        );

        setTimeout(() => {
          onSuccess?.();
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
      getSharedServices()?.captureError?.(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Card>
        <Title>Create Your Account</Title>

        {error && <Alert variant="error">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleRegister}>
          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange('fullName')}
            required
            disabled={loading}
            autoComplete="name"
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange('email')}
            required
            disabled={loading}
            autoComplete="email"
          />

          <Input
            type="password"
            label="Password"
            placeholder=""
            value={formData.password}
            onChange={handleChange('password')}
            required
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
            helperText="At least 8 characters"
          />

          <Input
            type="password"
            label="Confirm Password"
            placeholder=""
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            required
            minLength={8}
            disabled={loading}
            autoComplete="new-password"
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Create Account
          </Button>
        </Form>

        <OAuthButtons
          providers={['google', 'github']}
          onError={setError}
          onSuccess={setSuccess}
          disabled={loading}
        />

        <FooterText>
          Already have an account?{' '}
          <TextButton onClick={onSwitchToLogin} disabled={loading} type="button">
            Sign in
          </TextButton>
        </FooterText>
      </Card>
    </FormContainer>
  );
};
