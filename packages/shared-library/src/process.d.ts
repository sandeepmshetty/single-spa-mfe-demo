// Type definitions for Node.js process in browser environment
declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV?: 'development' | 'production' | 'test';
    readonly NEXT_PUBLIC_SUPABASE_URL?: string;
    readonly NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
    readonly NEXT_PUBLIC_SENTRY_DSN?: string;
    readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
    readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
    readonly SENTRY_ENABLE_IN_DEV?: string;
    readonly npm_package_version?: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
