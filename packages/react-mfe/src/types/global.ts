/**
 * Global Type Definitions and Helpers
 * Helpers to access globalThis.sharedServices with type safety
 */

// Augment the counter actions type to include missing methods
interface CounterActionsExtended {
  increment: (source?: string) => void;
  decrement: (source?: string) => void;
  reset: (source?: string) => void;
  getValue: () => number;
  subscribe: (callback: (value: number) => void) => () => void;
}

// Helper functions to access shared services with type safety
export const getSharedServices = () => {
  return globalThis.sharedServices;
};

export const getAuthService = () => {
  return globalThis.sharedServices?.supabaseAuthService;
};

export const getAuthStateManager = () => {
  return globalThis.sharedServices?.authStateManager;
};

export const getEventBus = () => {
  return globalThis.sharedServices?.eventBus;
};

export const getCounterActions = (): CounterActionsExtended | undefined => {
  return globalThis.sharedServices?.counterActions as any;
};
