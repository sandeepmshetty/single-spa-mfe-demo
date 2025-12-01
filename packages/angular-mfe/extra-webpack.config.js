const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local at the root
const envPath = path.resolve(__dirname, '../../.env.local');
const env = dotenv.config({ path: envPath }).parsed || {};

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Fix Babel runtime resolution using NormalModuleReplacementPlugin
  // This handles the hardcoded absolute paths in Angular's compiled modules
  const babelRuntimePath = path.resolve(__dirname, '../../node_modules/@babel/runtime');
  
  singleSpaWebpackConfig.plugins = singleSpaWebpackConfig.plugins || [];
  // Plugins can be added here if needed

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
    publicPath: `http://localhost:${process.env.PORT || 3003}/`
  };

  // Configure dev server
  if (config.devServer) {
    singleSpaWebpackConfig.devServer = {
      ...config.devServer,
      port: process.env.PORT || 3003,
      host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }

  return singleSpaWebpackConfig;
};
