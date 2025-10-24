/**
 * Validation Utilities
 * Reusable validation functions for forms
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate email format
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string, minLength: number = 8): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
};

/**
 * Validate passwords match
 */
export const validatePasswordsMatch = (
  password: string,
  confirmPassword: string
): ValidationResult => {
  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Validate min length
 */
export const validateMinLength = (
  value: string,
  minLength: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate max length
 */
export const validateMaxLength = (
  value: string,
  maxLength: number,
  fieldName: string = 'Field'
): ValidationResult => {
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate pattern (regex)
 */
export const validatePattern = (
  value: string,
  pattern: RegExp,
  errorMessage: string
): ValidationResult => {
  if (!pattern.test(value)) {
    return { isValid: false, error: errorMessage };
  }

  return { isValid: true };
};

/**
 * Validate URL format
 */
export const validateUrl = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate phone number (basic US format)
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const phoneRegex = /^[\d\s\-()]+$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  // Remove non-digits and check length
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return { isValid: false, error: 'Phone number must have at least 10 digits' };
  }

  return { isValid: true };
};

/**
 * Validate multiple fields
 */
export const validateFields = (
  validators: Array<() => ValidationResult>
): ValidationResult => {
  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
};

/**
 * Common validators object for easy access
 */
export const validators = {
  email: validateEmail,
  password: validatePassword,
  passwordsMatch: validatePasswordsMatch,
  required: validateRequired,
  minLength: validateMinLength,
  maxLength: validateMaxLength,
  pattern: validatePattern,
  url: validateUrl,
  phone: validatePhone,
};
