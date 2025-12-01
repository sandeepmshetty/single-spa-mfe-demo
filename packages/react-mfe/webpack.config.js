const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env at the root
const envPath = path.resolve(__dirname, '../../.env');
const env = dotenv.config({ path: envPath }).parsed || {};

module.exports = (argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    mode: argv.mode || 'development',
    target: ['web', 'es2020'],
    
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ['last 2 versions', 'not dead', 'not ie 11']
                  },
                  modules: false
                }],
                '@babel/preset-react',
                '@babel/preset-typescript',
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ],
    },
    
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    
    output: {
      filename: 'react-mfe.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      library: {
        name: '@single-spa-demo/react-mfe',
        type: 'system',
      },
      clean: true,
      environment: {
        arrowFunction: true,
        const: true,
        destructuring: true,
        dynamicImport: true,
        module: true,
        optionalChaining: true,
        templateLiteral: true,
        asyncFunction: true,
      },
    },
    
    plugins: [
      new CleanWebpackPlugin(),

      new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: false,
        templateParameters: {
          isLocal: !isProduction,
        },
      }),
      
      new webpack.DefinePlugin({
        // NODE_ENV is automatically set by webpack based on mode
        'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || ''),
        'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
        'process.env.NEXT_PUBLIC_SENTRY_DSN': JSON.stringify(process.env.NEXT_PUBLIC_SENTRY_DSN || env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN || ''),
        'process.env.NEXT_PUBLIC_POSTHOG_KEY': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_KEY || env.NEXT_PUBLIC_POSTHOG_KEY || ''),
        'process.env.NEXT_PUBLIC_POSTHOG_HOST': JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_HOST || env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'),
      }),
    ],
    
    devServer: {
      port: process.env.PORT || 3001,
      host: '0.0.0.0',
      historyApiFallback: true,
      hot: true,
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
    },
    
    externals: {
      // Externalize everything for shell integration with SystemJS import map names
      '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
      'react': 'react',
      'react-dom': 'react-dom',
    },
    
    optimization: {
      splitChunks: false,
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};