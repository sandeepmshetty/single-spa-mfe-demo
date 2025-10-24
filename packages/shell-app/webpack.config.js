const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local at the root
const envPath = path.resolve(__dirname, '../../.env.local');
const env = dotenv.config({ path: envPath }).parsed || {};

module.exports = (argv) => {
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
        '@/types': path.resolve(__dirname, 'src/types'),
        '@/core': path.resolve(__dirname, 'src/core'),
        '@/ui': path.resolve(__dirname, 'src/ui'),
        '@/services': path.resolve(__dirname, 'src/services'),
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
          {
            from: path.resolve(__dirname, 'src/styles.css'),
            to: 'styles.css',
          },
          {
            from: path.resolve(__dirname, 'src/config'),
            to: 'config',
          },
        ],
      }),
      new webpack.DefinePlugin({
        // NODE_ENV is automatically set by webpack based on mode, don't redefine it
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_URL || ''),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
        'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN || ''),
        'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_KEY || ''),
        'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
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