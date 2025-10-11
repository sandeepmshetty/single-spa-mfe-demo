// Global type definitions for React MFE

declare global {
  interface Window {
    singleSpaNavigate?: (url: string) => void;
    System: any;
  }
}

// Single-SPA React types
declare module 'single-spa-react' {
  import { ComponentType } from 'react';
  
  interface SingleSpaReactOpts {
    React: any;
    ReactDOM: any;
    rootComponent: ComponentType<any>;
    errorBoundary?: (err: Error, info: any, props: any) => ComponentType<any>;
    suppressComponentDidCatchWarning?: boolean;
    domElementGetter?: () => HTMLElement;
  }
  
  interface SingleSpaReactLifecycles {
    bootstrap?: (props: any) => Promise<void>;
    mount?: (props: any) => Promise<void>;
    unmount?: (props: any) => Promise<void>;
  }
  
  function singleSpaReact(opts: SingleSpaReactOpts): SingleSpaReactLifecycles;
  export default singleSpaReact;
}

// Shared services types
interface SharedServices {
  eventBus: {
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback?: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
  };
  authService: {
    isAuthenticated: () => boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
    getUser: () => any;
    onAuthChange: (callback: (authState: any) => void) => void;
  };
  storageService: {
    setItem: (key: string, value: any) => void;
    getItem: (key: string) => any;
    removeItem: (key: string) => void;
  };
  apiClient: {
    get: (url: string, config?: any) => Promise<any>;
    post: (url: string, data?: any, config?: any) => Promise<any>;
    put: (url: string, data?: any, config?: any) => Promise<any>;
    delete: (url: string, config?: any) => Promise<any>;
  };
  logger: {
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
  };
}

// Component props types
interface MFEProps extends SharedServices {
  domElement?: HTMLElement;
}

export { SharedServices, MFEProps };