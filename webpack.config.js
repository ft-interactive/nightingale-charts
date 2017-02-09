var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')

var sassLoaders = [
  `css-loader?sourceMap&root=${rootPublic}`,
  'postcss-loader',
  `sass-loader?sourceMap&outputStyle=expanded`
];

var rootPublic = path.join(__dirname, 'public');

module.exports = {
  devtool: "inline-sourcemap",
  entry: {
    'nightingale-charts' : [
      "./src/scripts/nightingale-charts.js"
    ],
    'examples': [
      "./examples/scripts/bar-chart-examples.js",
      "./examples/scripts/column-chart-examples.js",
      "./examples/scripts/line-chart-examples.js",
      "./examples/scripts/utils.js",
      "./examples/scripts/config.js",
      "./examples/scripts/fixtures.js"
    ]
  },
  output: {
    path: path.resolve(__dirname, '_site'),
    filename: "/scripts/[name].min.js"
  },
  resolve: {
    extensions: ['', '.js', '.scss']
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: /.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", sassLoaders.join("!")),
      },
      {
        test: /\.json$/, loader: 'json-loader'
      },
      {
          test: /\.js$/,
          loader: "transform-loader?brfs"
      }
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    new ExtractTextPlugin('/styles/[name].css'),
    new CopyWebpackPlugin([{
        context: './examples',
        from:'**.html',
        to: './',
        toType: 'dir'
    }])
  ],
  node: {
    console: true,
    fs: 'empty'
  }
};
