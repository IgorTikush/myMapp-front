import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line import/default
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const htmlPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html',
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyPlugin = new CopyPlugin(
  {
    patterns: [
      { from: path.resolve(__dirname, 'src', 'countries.json'), to: path.resolve(__dirname, 'dist') },
    ],
  },
);

export default {
  // devtool: 'source-map',
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
    {
      test: /\.(less|css)$/,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
      ],
    },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
  },
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserPlugin({ parallel: true }),
  //   ],
  // },
  plugins: [
    htmlPlugin,
    copyPlugin,
  ],
  // experiments: {
  //   lazyCompilation: true,
  // },
  devServer: {
    historyApiFallback: true,
  },
};
