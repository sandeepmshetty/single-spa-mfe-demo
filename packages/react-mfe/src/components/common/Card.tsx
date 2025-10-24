/**
 * Card Component
 * Container component with consistent styling
 */
import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  padding?: keyof typeof theme.spacing;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const StyledCard = styled.div<{ $padding: keyof typeof theme.spacing; $clickable: boolean }>`
  background-color: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${props => theme.spacing[props.$padding]};
  box-shadow: ${theme.shadows.sm};
  transition: all ${theme.transitions.fast};

  ${props =>
    props.$clickable &&
    `
    cursor: pointer;
    
    &:hover {
      box-shadow: ${theme.shadows.md};
      border-color: ${theme.colors.borderDark};
    }
  `}
`;

export const Card: React.FC<CardProps> = ({ children, padding = 'lg', className, style, onClick }) => {
  return (
    <StyledCard
      $padding={padding}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
      style={style}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </StyledCard>
  );
};
