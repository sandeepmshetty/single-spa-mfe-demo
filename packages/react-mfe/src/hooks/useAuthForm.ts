/**
 * useAuthForm Hook
 * Shared hook for managing authentication form state and logic
 */
import { useState, useCallback } from 'react';
import type { AuthFormState } from '../types';

export const useAuthForm = () => {
  const [state, setState] = useState<AuthFormState>({
    loading: false,
    error: null,
    success: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, success: null }));
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setState((prev) => ({ ...prev, success, error: null }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({ ...prev, error: null, success: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, success: null });
  }, []);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    reset,
  };
};
