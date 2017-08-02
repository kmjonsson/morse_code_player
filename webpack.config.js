var webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  entry: ['./src/morse.ts' ],
  output: {
    library: 'MorsePlayer',
    filename: 'morse_code_player.js',
    umdNamedDefine: true
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, dead_code: true },
    })
  ] : []
}
