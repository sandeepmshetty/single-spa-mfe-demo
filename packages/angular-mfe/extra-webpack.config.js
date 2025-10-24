const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env.local at the root
const envPath = path.resolve(__dirname, '../../.env.local');
const env = dotenv.config({ path: envPath }).parsed || {};

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Fix Babel runtime resolution using NormalModuleReplacementPlugin
  // This handles the hardcoded absolute paths in Angular's compiled modules
  const babelRuntimePath = path.resolve(__dirname, '../../node_modules/@babel/runtime');
  const buildAngularBabelPath = path.resolve(__dirname, '../../node_modules/@angular-devkit/build-angular/node_modules/@babel/runtime');
  
  singleSpaWebpackConfig.plugins = singleSpaWebpackConfig.plugins || [];
  singleSpaWebpackConfig.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/@angular-devkit\/build-angular\/node_modules\/@babel\/runtime/,
      (resource) => {
        // Redirect any @babel/runtime requests to the root node_modules
        resource.request = resource.request.replace(
          buildAngularBabelPath,
          babelRuntimePath
        );
      }
    ),
    new webpack.DefinePlugin({
      // NODE_ENV is automatically set by Angular CLI based on configuration
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN || ''),
      'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_KEY || ''),
      'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
    })
  );

  // Configure module resolution
  singleSpaWebpackConfig.resolve = singleSpaWebpackConfig.resolve || {};
  singleSpaWebpackConfig.resolve.alias = {
    ...singleSpaWebpackConfig.resolve.alias,
    '@babel/runtime': babelRuntimePath
  };
  
  singleSpaWebpackConfig.resolve.modules = [
    ...(singleSpaWebpackConfig.resolve.modules || []),
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, '../../node_modules'),
  ];

  // Configure externals for shared dependencies
  singleSpaWebpackConfig.externals = {
    'zone.js': 'Zone', // Zone.js is loaded globally via CDN
    'single-spa': 'singleSpa', // Single-SPA is loaded globally
    '@single-spa-demo/shared-library': '@single-spa-demo/shared-library' // Shared library
  };

  // Set output configuration
  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    filename: 'main.js',
    libraryTarget: 'system',
    library: '@single-spa-demo/angular-mfe',
    publicPath: 'http://localhost:3003/'
  };

  // Configure dev server
  if (config.devServer) {
    singleSpaWebpackConfig.devServer = {
      ...config.devServer,
      port: 3003,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  return singleSpaWebpackConfig;
};
