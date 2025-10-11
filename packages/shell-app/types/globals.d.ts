// Global type augmentations for Single-SPA Shell App

// Shared Services Types
interface SharedServices {
  eventBus: {
    emit: (type: string, data: any, source?: string) => void;
    on: (type: string, callback: (payload: any) => void) => () => void;
    onAll: (callback: (payload: any) => void) => () => void;
  };
  authService: any;
  storageService: any;
  apiClient: any;
  logger: any;
  utils: any;
  counterState: {
    getValue: () => number;
    setValue: (value: number, source?: string) => void;
    subscribe: (callback: (value: number) => void) => () => void;
  };
  counterActions: {
    increment: (source?: string) => void;
    decrement: (source?: string) => void;
    reset: (source?: string) => void;
    setValue: (value: number, source?: string) => void;
    getValue: () => number;
    subscribe: (callback: (value: number) => void) => () => void;
  };
  userState: any;
  userActions: any;
}

declare global {
  const System: SystemJS.System;
  interface Window {
    System: SystemJS.System;
    sharedServices: SharedServices;
    shellApp: {
      navigateToUrl: (url: string) => void;
      sharedServices: () => SharedServices;
      performHealthCheck: () => Promise<void>;
      showLoadingState: (message?: string) => void;
      hideLoadingState: () => void;
      showErrorState: (message: string) => void;
    };
  }
}

// SystemJS module definitions
declare module '@single-spa-demo/react-mfe' {
  const app: any;
  export default app;
}

declare module '@single-spa-demo/vue-mfe' {
  const app: any;
  export default app;
}

declare module '@single-spa-demo/angular-mfe' {
  const app: any;
  export default app;
}

declare module '@single-spa-demo/shared-library' {
  export const eventBus: any;
  export const authService: any;
  export const storageService: any;
  export const apiClient: any;
  export const logger: any;
  export const Utils: any;
  export const counterState: any;
  export const counterActions: any;
  export const userState: any;
  export const userActions: any;
}

// Environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    REACT_MFE_URL?: string;
    VUE_MFE_URL?: string;
    ANGULAR_MFE_URL?: string;
    SHARED_LIB_URL?: string;
  }
}

export {};