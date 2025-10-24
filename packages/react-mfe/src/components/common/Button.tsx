/**
 * Button Component
 * Reusable button with multiple variants and sizes
 */
import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles = {
  primary: css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryHover};
      border-color: ${theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background-color: ${theme.colors.secondary};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.secondary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.secondaryHover};
      border-color: ${theme.colors.secondaryHover};
    }
  `,
  success: css`
    background-color: ${theme.colors.success};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.success};

    &:hover:not(:disabled) {
      background-color: #218838;
      border-color: #1e7e34;
    }
  `,
  error: css`
    background-color: ${theme.colors.error};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.error};

    &:hover:not(:disabled) {
      background-color: #c82333;
      border-color: #bd2130;
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primaryLight};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.gray100};
    }
  `,
};

const sizeStyles = {
  sm: css`
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  `,
  md: css`
    padding: ${theme.spacing.sm} ${theme.spacing.lg};
    font-size: ${theme.fontSize.md};
  `,
  lg: css`
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    font-size: ${theme.fontSize.lg};
  `,
};

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  
  font-weight: ${theme.fontWeight.medium};
  line-height: ${theme.lineHeight.tight};
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};
  cursor: pointer;
  
  ${props => variantStyles[props.$variant]}
  ${props => sizeStyles[props.$size]}
  ${props => props.$fullWidth && 'width: 100%;'}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  ${props =>
    props.$loading &&
    css`
      pointer-events: none;
      position: relative;
      color: transparent;

      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        top: 50%;
        left: 50%;
        margin-left: -8px;
        margin-top: -8px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.6s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  type = 'button',
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
