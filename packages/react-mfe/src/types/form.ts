/**
 * Form Type Definitions
 * Reusable form types and validation types
 */

export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export type FormValues = Record<string, any>;

export interface FormConfig {
  fields: FormField[];
  validationRules?: Record<string, ValidationRule[]>;
  onSubmit: (values: FormValues) => Promise<void> | void;
}
