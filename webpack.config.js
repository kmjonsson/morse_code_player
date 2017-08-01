module.exports = {
  entry: ['./src/morse.ts' ],
  output: {
    library: 'MorsePlayer',
    filename: 'morse_code_player.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}
