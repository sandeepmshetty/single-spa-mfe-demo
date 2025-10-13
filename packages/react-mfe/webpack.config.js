const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.tsx',
    mode: argv.mode || 'development',
    
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
                '@babel/preset-env',
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
      filename: isProduction ? 'react-mfe.[contenthash].js' : 'react-mfe.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      library: '@single-spa-demo/react-mfe',
      libraryTarget: 'umd',
      globalObject: 'this',
      clean: true,
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
    ],
    
    devServer: {
      port: 3001,
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
      'react': 'React',
      'react-dom': 'ReactDOM',
      'single-spa': 'singleSpa',
    } : {},
    
    optimization: {
      splitChunks: false,
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
  };
};