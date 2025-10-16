import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { defineConfig } from 'rollup';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env.local
const envPath = path.resolve(process.cwd(), '../../.env.local');
const envConfig = dotenv.config({ path: envPath });

if (envConfig.error) {
  console.warn('⚠️ No .env.local found at root, using process.env');
}

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/shared.esm.js',
      format: 'es',
      sourcemap: true,
      inlineDynamicImports: true
    },
    {
      file: 'dist/shared-library.js',
      format: 'system',
      sourcemap: true,
      inlineDynamicImports: true
    }
  ],
  external: [
    'rxjs'
    // Bundle premium services instead of externalizing them
    // '@supabase/supabase-js',
    // '@sentry/browser',
    // '@sentry/tracing',
    // 'posthog-js',
    // 'resend'
  ],
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(process.env.NEXT_PUBLIC_SENTRY_DSN || ''),
      'process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT': JSON.stringify(process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || 'development'),
      'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_KEY || ''),
      'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
      'process.env.RESEND_API_KEY': JSON.stringify(process.env.RESEND_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist/types'
    })
  ]
});