const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const webpack = require('webpack');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from root .env.local
const envPath = path.resolve(__dirname, '../../.env.local');
const envConfig = dotenv.config({ path: envPath });
const env = envConfig.parsed || {};

// Log if env loaded successfully
if (envConfig.error) {
  console.warn('⚠️  Could not load .env.local file:', envConfig.error.message);
} else {
  console.log('✅ Loaded environment variables from .env.local');
}

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Don't override entry, let single-spa-angular handle it
  // Custom webpack configuration for Single SPA
  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    library: '@single-spa-demo/angular-mfe',
    libraryTarget: 'system',
    publicPath: 'http://localhost:3003/'
  };

  singleSpaWebpackConfig.externals = {
    ...singleSpaWebpackConfig.externals,
    'single-spa': 'singleSpa',
    '@single-spa-demo/shared-library': '@single-spa-demo/shared-library'
  };

  // Add resolve alias
  singleSpaWebpackConfig.resolve = {
    ...singleSpaWebpackConfig.resolve,
    alias: {
      ...singleSpaWebpackConfig.resolve?.alias,
      '@': path.resolve(__dirname, 'src')
    },
    fallback: {
      ...singleSpaWebpackConfig.resolve?.fallback,
      "buffer": require.resolve("buffer/"),
      "stream": false,
      "util": false,
    }
  };

  // Add environment variables plugin (don't spread existing plugins to avoid conflicts)
  if (!singleSpaWebpackConfig.plugins) {
    singleSpaWebpackConfig.plugins = [];
  }
  
  singleSpaWebpackConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(env.NEXT_PUBLIC_SENTRY_DSN || ''),
      'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_KEY || ''),
      'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.npm_package_version': JSON.stringify('1.0.0'),
      'process.env.SENTRY_ENABLE_IN_DEV': JSON.stringify(env.SENTRY_ENABLE_IN_DEV || ''),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    })
  );

  // Keep HtmlWebpackPlugin for standalone development
  // The src/index.html file includes SystemJS to load the SystemJS-formatted bundle

  return singleSpaWebpackConfig;
};