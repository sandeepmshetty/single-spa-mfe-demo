const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
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
      filename: isProduction ? 'vue-mfe.[contenthash].js' : 'vue-mfe.js',
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
    
    externals: isProduction ? {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'single-spa': 'singleSpa',
    } : {},
    
    optimization: {
      splitChunks: false,
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};