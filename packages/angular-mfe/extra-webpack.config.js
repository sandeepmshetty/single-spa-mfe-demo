const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Configure externals for shared dependencies
  singleSpaWebpackConfig.externals = {
    'zone.js': 'Zone', // Zone.js is loaded globally via CDN
    'single-spa': 'singleSpa', // Single-SPA is loaded globally
    '@single-spa-demo/shared-library': '@single-spa-demo/shared-library' // Shared library
  };

  // Set output configuration
  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
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
