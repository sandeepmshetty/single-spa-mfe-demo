/**
 * OAuthButtons Component
 * Reusable OAuth provider buttons for Google and GitHub authentication
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { Button } from '../common';
import type { OAuthProvider } from '../../types';
import { getAuthService, getSharedServices } from '../../types/global';

interface OAuthButtonsProps {
  providers?: OAuthProvider[];
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
  disabled?: boolean;
}

const OAuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.lg};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  margin: ${theme.spacing.lg} 0;
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.sm};

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${theme.colors.border};
  }
`;

const ProviderButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
`;

const ProviderIcon = styled.span`
  font-size: ${theme.fontSize.lg};
`;

const providerConfig = {
  google: {
    label: 'Continue with Google',
    icon: '🔍',
    color: theme.colors.white,
    bgColor: '#4285f4',
  },
  github: {
    label: 'Continue with GitHub',
    icon: '🐙',
    color: theme.colors.white,
    bgColor: '#24292e',
  },
};

export const OAuthButtons: React.FC<OAuthButtonsProps> = ({
  providers = ['google', 'github'],
  onError,
  onSuccess,
  disabled = false,
}) => {
  const [loadingProvider, setLoadingProvider] = React.useState<OAuthProvider | null>(null);

  const handleOAuthLogin = async (provider: OAuthProvider) => {
    setLoadingProvider(provider);

    try {
      const authService = getAuthService();
      const sharedServices = getSharedServices();

      if (!authService) {
        throw new Error('Authentication service not available');
      }

      await authService.signInWithProvider(provider);
      sharedServices?.trackEvent?.('oauth_initiated', { provider });

      // OAuth redirect will happen, so show success message
      onSuccess?.(`Redirecting to ${provider}...`);
    } catch (err: any) {
      const errorMessage = err.message || `${provider} login failed`;
      onError?.(errorMessage);
      getSharedServices()?.captureError?.(err);
      setLoadingProvider(null);
    }
  };

  if (providers.length === 0) {
    return null;
  }

  return (
    <>
      <Divider>or</Divider>
      <OAuthContainer>
        {providers.map((provider) => {
          const config = providerConfig[provider];
          return (
            <ProviderButton
              key={provider}
              variant="outline"
              fullWidth
              loading={loadingProvider === provider}
              disabled={disabled || !!loadingProvider}
              onClick={() => handleOAuthLogin(provider)}
              style={{
                color: config.color,
                backgroundColor: config.bgColor,
                borderColor: config.bgColor,
              }}
            >
              <ProviderIcon aria-hidden="true">{config.icon}</ProviderIcon>
              {config.label}
            </ProviderButton>
          );
        })}
      </OAuthContainer>
    </>
  );
};
