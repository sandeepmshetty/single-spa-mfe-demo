/**
 * Input Component
 * Reusable input field with label, error state, and validation
 */
import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: ${theme.fontWeight.medium};
  color: ${theme.colors.textPrimary};
  display: block;
`;

const StyledInput = styled.input<{ $hasError: boolean }>`
  width: 100%;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.fontSize.md};
  line-height: ${theme.lineHeight.normal};
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.white};
  border: 1px solid ${props => (props.$hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${theme.borderRadius.sm};
  transition: all ${theme.transitions.fast};

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:hover:not(:disabled) {
    border-color: ${props => (props.$hasError ? theme.colors.error : theme.colors.borderDark)};
  }

  &:focus {
    outline: none;
    border-color: ${props => (props.$hasError ? theme.colors.error : theme.colors.primary)};
    box-shadow: 0 0 0 3px
      ${props =>
        props.$hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  }

  &:disabled {
    background-color: ${theme.colors.gray100};
    color: ${theme.colors.textDisabled};
    cursor: not-allowed;
  }
`;

const ErrorText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.error};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`;

const HelperText = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textSecondary};
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, fullWidth = true, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
    const hasError = !!error;
    
    let ariaDescribedBy: string | undefined;
    if (error) {
      ariaDescribedBy = `${inputId}-error`;
    } else if (helperText) {
      ariaDescribedBy = `${inputId}-helper`;
    }

    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <Label htmlFor={inputId}>{label}</Label>}
        <StyledInput
          ref={ref}
          id={inputId}
          $hasError={hasError}
          aria-invalid={hasError}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        {error && (
          <ErrorText id={`${inputId}-error`} role="alert">
            {error}
          </ErrorText>
        )}
        {!error && helperText && (
          <HelperText id={`${inputId}-helper`}>{helperText}</HelperText>
        )}
      </InputContainer>
    );
  }
);

Input.displayName = 'Input';
