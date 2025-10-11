// Global type definitions for Vue MFE

declare global {
  interface Window {
    singleSpaNavigate?: (url: string) => void;
    System: any;
  }
  
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      VUE_APP_API_URL?: string;
    }
  }
}

// Vue module declarations
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

// Single-SPA Vue types
declare module 'single-spa-vue' {
  import { App } from 'vue';
  
  interface SingleSpaVueOpts {
    createApp: (props?: any) => App;
    appOptions?: any;
    handleInstance?: (app: App, info: any) => void;
    replaceMode?: boolean;
  }
  
  interface SingleSpaVueLifecycles {
    bootstrap?: (props: any) => Promise<void>;
    mount?: (props: any) => Promise<void>;
    unmount?: (props: any) => Promise<void>;
  }
  
  function singleSpaVue(opts: SingleSpaVueOpts): SingleSpaVueLifecycles;
  export default singleSpaVue;
}

// Shared services types
interface SharedServices {
  eventBus?: {
    on: (event: string, callback: (data: any) => void) => void;
    off: (event: string, callback?: (data: any) => void) => void;
    emit: (event: string, data: any) => void;
  };
  authService?: {
    isAuthenticated: () => boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
    getUser: () => any;
    onAuthChange: (callback: (authState: any) => void) => void;
  };
  storageService?: {
    setItem: (key: string, value: any) => void;
    getItem: (key: string) => any;
    removeItem: (key: string) => void;
  };
  apiClient?: {
    get: (url: string, config?: any) => Promise<any>;
    post: (url: string, data?: any, config?: any) => Promise<any>;
    put: (url: string, data?: any, config?: any) => Promise<any>;
    delete: (url: string, config?: any) => Promise<any>;
  };
  logger?: {
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
  };
}

// Product types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productCount: number;
}

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

// Component props types
interface MFEProps extends SharedServices {
  domElement?: HTMLElement;
}

export { 
  SharedServices, 
  MFEProps, 
  Product, 
  Category, 
  CartItem 
};