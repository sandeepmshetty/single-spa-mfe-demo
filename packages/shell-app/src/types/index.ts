/**
 * Shared Type Definitions for Shell Application
 */

export interface SystemModule {
  default?: MFELifecycles | (() => MFELifecycles);
  bootstrap?: () => Promise<void>;
  mount?: (props: unknown) => Promise<void>;
  unmount?: (props: unknown) => Promise<void>;
}

export interface MFELifecycles {
  bootstrap: () => Promise<void>;
  mount: (props: unknown) => Promise<void>;
  unmount: (props: unknown) => Promise<void>;
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface MFEConfig {
  name: string;
  importName: string;
  activeWhen: string | ((location: Location) => boolean);
  customProps?: () => Record<string, unknown>;
  errorMessage: string;
}

// Shared services type (loaded dynamically)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SharedServices = Record<string, any>;

export interface ShellAppDebug {
  navigateToUrl: (url: string) => void;
  sharedServices: () => SharedServices;
  performHealthCheck: () => Promise<void>;
  showLoadingState: (message?: string) => void;
  hideLoadingState: () => void;
  showErrorState: (message: string) => void;
}
