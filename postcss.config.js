module.exports = {
  parser: 'postcss-scss',
  map: false,
  plugins: {
    'postcss-easy-import': {},
    'autoprefixer': {browsers: ['last 2 versions', 'ie 10']}
  }
}
