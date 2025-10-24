/**
 * Theme configuration for React MFE
 * Provides consistent colors, spacing, typography, and other design tokens
 */

export const theme = {
  colors: {
    // Primary colors
    primary: '#0066cc',
    primaryHover: '#0052a3',
    primaryLight: '#e6f2ff',
    
    // Secondary colors
    secondary: '#6c757d',
    secondaryHover: '#5a6268',
    
    // Status colors
    success: '#28a745',
    successLight: '#d4edda',
    successBorder: '#c3e6cb',
    successText: '#155724',
    
    error: '#dc3545',
    errorLight: '#f8d7da',
    errorBorder: '#f5c6cb',
    errorText: '#721c24',
    
    warning: '#ffc107',
    warningLight: '#fff3cd',
    warningBorder: '#ffeeba',
    warningText: '#856404',
    
    info: '#17a2b8',
    infoLight: '#d1ecf1',
    infoBorder: '#bee5eb',
    infoText: '#0c5460',
    
    // Neutral colors
    white: '#ffffff',
    black: '#000000',
    
    // Grays
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
    
    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6c757d',
    textMuted: '#adb5bd',
    textDisabled: '#ced4da',
    
    // Background colors
    background: '#ffffff',
    backgroundAlt: '#f8f9fa',
    backgroundDark: '#343a40',
    
    // Border colors
    border: '#dee2e6',
    borderLight: '#e9ecef',
    borderDark: '#adb5bd',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },
  
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
  
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    xxl: '1400px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
} as const;

export type Theme = typeof theme;

// Type helper for theme access
export type ThemeColor = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeFontSize = keyof typeof theme.fontSize;
