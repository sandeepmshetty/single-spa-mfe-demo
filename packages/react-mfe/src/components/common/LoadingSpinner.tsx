/**
 * LoadingSpinner Component
 * Animated loading indicator
 */
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

export type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  color?: string;
  fullScreen?: boolean;
  message?: string;
}

const sizeMap = {
  sm: '16px',
  md: '32px',
  lg: '48px',
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const FullScreenContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.md};
  min-height: 200px;
  width: 100%;
`;

const SpinnerWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div<{ $size: SpinnerSize; $color: string }>`
  width: ${props => sizeMap[props.$size]};
  height: ${props => sizeMap[props.$size]};
  border: 3px solid ${theme.colors.gray200};
  border-top-color: ${props => props.$color};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const Message = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: ${theme.fontSize.md};
  margin: 0;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = theme.colors.primary,
  fullScreen = false,
  message,
}) => {
  const spinner = (
    <SpinnerWrapper>
      <Spinner $size={size} $color={color} aria-hidden="true" />
      <VisuallyHidden>Loading...</VisuallyHidden>
    </SpinnerWrapper>
  );

  if (fullScreen) {
    return (
      <FullScreenContainer>
        {spinner}
        {message && <Message>{message}</Message>}
      </FullScreenContainer>
    );
  }

  return spinner;
};
