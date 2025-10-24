/**
 * Alert Component
 * Display messages with different severity levels
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const variantConfig = {
  success: {
    bg: theme.colors.successLight,
    border: theme.colors.successBorder,
    text: theme.colors.successText,
    icon: '✅',
  },
  error: {
    bg: theme.colors.errorLight,
    border: theme.colors.errorBorder,
    text: theme.colors.errorText,
    icon: '❌',
  },
  warning: {
    bg: theme.colors.warningLight,
    border: theme.colors.warningBorder,
    text: theme.colors.warningText,
    icon: '⚠️',
  },
  info: {
    bg: theme.colors.infoLight,
    border: theme.colors.infoBorder,
    text: theme.colors.infoText,
    icon: 'ℹ️',
  },
};

const AlertContainer = styled.div<{ $variant: AlertVariant }>`
  display: flex;
  align-items: flex-start;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${props => variantConfig[props.$variant].border};
  background-color: ${props => variantConfig[props.$variant].bg};
  color: ${props => variantConfig[props.$variant].text};
  font-size: ${theme.fontSize.md};
  line-height: ${theme.lineHeight.normal};
`;

const IconWrapper = styled.span`
  flex-shrink: 0;
  font-size: ${theme.fontSize.lg};
`;

const Content = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 0;
  margin-left: ${theme.spacing.sm};
  font-size: ${theme.fontSize.lg};
  line-height: 1;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity ${theme.transitions.fast};
  color: inherit;

  &:hover {
    opacity: 1;
  }
`;

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
  onClose,
  className,
  style,
}) => {
  const config = variantConfig[variant];

  return (
    <AlertContainer $variant={variant} role="alert" className={className} style={style}>
      <IconWrapper aria-hidden="true">{config.icon}</IconWrapper>
      <Content>{children}</Content>
      {onClose && (
        <CloseButton onClick={onClose} aria-label="Close alert" type="button">
          ×
        </CloseButton>
      )}
    </AlertContainer>
  );
};
