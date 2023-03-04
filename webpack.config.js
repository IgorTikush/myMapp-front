import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from 'html-webpack-plugin';

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  devtool: "source-map",
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
      },
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({ parallel: true }),
  //   ],
  // },
  plugins: [
    htmlPlugin,
  ],
  experiments: {
    lazyCompilation: true,
  },
  devServer: {
    historyApiFallback: true,
  },
};
