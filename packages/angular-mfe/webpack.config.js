const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const singleSpaWebpackConfig = singleSpaAngularWebpack(config, options);

  // Custom webpack configuration for Single SPA
  singleSpaWebpackConfig.entry = {
    main: './src/main.single-spa.ts'
  };

  singleSpaWebpackConfig.output = {
    ...singleSpaWebpackConfig.output,
    library: '@single-spa-demo/angular-mfe',
    libraryTarget: 'system',
    publicPath: 'http://localhost:3003/'
  };

  singleSpaWebpackConfig.externals = {
    'single-spa': 'singleSpa',
    '@single-spa-demo/shared-library': '@single-spa-demo/shared-library'
  };

  // Add resolve alias
  singleSpaWebpackConfig.resolve = {
    ...singleSpaWebpackConfig.resolve,
    alias: {
      ...singleSpaWebpackConfig.resolve?.alias,
      '@': require('path').resolve(__dirname, 'src')
    }
  };

  // Keep HtmlWebpackPlugin for standalone development
  // The src/index.html file includes SystemJS to load the SystemJS-formatted bundle

  return singleSpaWebpackConfig;
};