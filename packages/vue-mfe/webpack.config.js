const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { ModuleFederationPlugin, DefinePlugin } = require('webpack').container;
const webpack = require('webpack');
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/main.ts',
    mode: argv.mode || 'development',
    
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
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
          test: /\.scss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.css$/,
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
      extensions: ['.tsx', '.ts', '.js', '.vue'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue': '@vue/runtime-dom',
      },
    },
    
    output: {
      filename: 'vue-mfe.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      library: '@single-spa-demo/vue-mfe',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
    },
    
    plugins: [
      new CleanWebpackPlugin(),
      new VueLoaderPlugin(),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: false,
        templateParameters: {
          isLocal: !isProduction,
        },
      }),
    ],
    
    devServer: {
      port: 3002,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      static: {
        directory: path.join(__dirname, 'dist'),
      },
    },
    
    externals: {
      '@single-spa-demo/shared-library': '@single-spa-demo/shared-library',
      'vue': 'vue',
    },
    
    optimization: {
      splitChunks: false,
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};