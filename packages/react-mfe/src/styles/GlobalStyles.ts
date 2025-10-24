/**
 * Global styles for React MFE
 * Applied at the app level to ensure consistent styling
 * Scoped to #single-spa-application\\:react-mfe to prevent CSS leakage
 */
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  #single-spa-application\\:react-mfe {
    * {
      box-sizing: border-box;
    }

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    color: ${theme.colors.textPrimary};
    line-height: ${theme.lineHeight.normal};

    h1, h2, h3, h4, h5, h6 {
      margin-bottom: ${theme.spacing.md};
      font-weight: ${theme.fontWeight.semibold};
      line-height: ${theme.lineHeight.tight};
      color: ${theme.colors.textPrimary};
    }

    h1 {
      font-size: ${theme.fontSize.xxxl};
    }

    h2 {
      font-size: ${theme.fontSize.xxl};
    }

    h3 {
      font-size: ${theme.fontSize.xl};
    }

    h4 {
      font-size: ${theme.fontSize.lg};
    }

    h5, h6 {
      font-size: ${theme.fontSize.md};
    }

    p {
      margin-bottom: ${theme.spacing.md};
    }

    a {
      color: ${theme.colors.primary};
      text-decoration: none;
      transition: color ${theme.transitions.fast};

      &:hover {
        color: ${theme.colors.primaryHover};
        text-decoration: underline;
      }
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    input, textarea, select {
      font-family: inherit;
    }
  }

  /* Focus styles for accessibility - scoped to react-mfe */
  #single-spa-application\\:react-mfe *:focus-visible {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }

  /* Scrollbar styling (webkit browsers) - scoped to react-mfe */
  #single-spa-application\\:react-mfe ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  #single-spa-application\\:react-mfe ::-webkit-scrollbar-track {
    background: ${theme.colors.gray100};
  }

  #single-spa-application\\:react-mfe ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray400};
    border-radius: ${theme.borderRadius.sm};

    &:hover {
      background: ${theme.colors.gray500};
    }
  }
`;
