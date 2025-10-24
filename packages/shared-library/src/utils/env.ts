/**
 * Environment Variable Utilities
 *
 * Provides safe access to environment variables in both Node.js and browser environments.
 */

/**
 * Safely get an environment variable
 * Works in both Node.js (process.env) and browser (webpack DefinePlugin) environments
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  // Check if running in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }

  // In browser, environment variables should be injected by webpack DefinePlugin
  // They are replaced at build time as string literals
  return defaultValue;
};

/**
 * Check if we're in a production environment
 */
export const isProduction = (): boolean => {
  return getEnvVar('NODE_ENV') === 'production';
};

/**
 * Check if we're in a development environment
 */
export const isDevelopment = (): boolean => {
  return getEnvVar('NODE_ENV', 'development') === 'development';
};
