const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/shell-app.ts',
    mode: argv.mode || 'development',
    
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    
    output: {
      filename: 'shell-app.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: false,
        templateParameters: {
          isLocal: !isProduction,
        },
        minify: false,
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../shared-library/dist/shared-library.js'),
            to: 'shared-library.js',
          },
          {
            from: path.resolve(__dirname, '../shared-library/dist/shared-library.js.map'),
            to: 'shared-library.js.map',
            noErrorOnMissing: true,
          },
        ],
      }),
      new (require('webpack')).DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
    ],
    
    devServer: {
      port: 9999,
      historyApiFallback: true,
      hot: true,
      open: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      static: [
        {
          directory: path.join(__dirname, 'dist'),
        },
        {
          directory: path.resolve(__dirname, '../shared-library/dist'),
          publicPath: '/',
        },
      ],
      devMiddleware: {
        writeToDisk: (filePath) => {
          // Write shared-library.js to disk so it can be served
          return /shared-library\.js/.test(filePath);
        },
      },
    },
    
    // Bundle Single-SPA directly instead of using externals for better reliability
    // externals: {
    //   'single-spa': 'window.singleSpa',
    //   'single-spa-layout': 'window.singleSpaLayout',
    // },
    
    optimization: {
      splitChunks: {
        chunks: 'async', // Only split async chunks, keep main bundle together
      },
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};